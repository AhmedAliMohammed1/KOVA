-- Privileged implementations live outside the exposed public schema.
create table private.role_change_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  target_id uuid references auth.users(id) on delete set null,
  role public.app_role not null,
  enabled boolean not null,
  created_at timestamptz not null default now()
);
create index role_change_events_actor_idx on private.role_change_events(actor_id);
create index role_change_events_target_idx on private.role_change_events(target_id, created_at desc);
alter table private.role_change_events enable row level security;
revoke all on private.role_change_events from public, anon, authenticated;

create function private.super_admin_list_users(p_query text default '', p_page integer default 1)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_result jsonb; v_query text := lower(trim(coalesce(p_query,'')));
begin
  if auth.uid() is null or not private.has_any_role(array['super_admin']::public.app_role[]) then
    raise exception 'super_admin_required' using errcode = '42501';
  end if;
  if length(v_query)>120 or p_page is null or p_page<1 or p_page>100000 then
    raise exception 'invalid_search';
  end if;
  with matches as (
    select u.id,u.email,u.email_confirmed_at,u.created_at,coalesce(p.full_name,'') as full_name
    from auth.users u left join public.profiles p on p.id=u.id
    where v_query='' or strpos(lower(coalesce(u.email,'')),v_query)>0
      or strpos(lower(coalesce(p.full_name,'')),v_query)>0
  ), paged as (
    select * from matches order by created_at desc,id limit 20 offset (p_page-1)*20
  )
  select jsonb_build_object(
    'total',(select count(*) from matches),
    'users',coalesce((select jsonb_agg(jsonb_build_object(
      'id',p.id,'email',coalesce(p.email,''),'fullName',p.full_name,
      'verified',p.email_confirmed_at is not null,
      'roles',coalesce((select jsonb_agg(r.role order by r.role) from public.user_roles r where r.user_id=p.id),'[]'::jsonb)
    ) order by p.created_at desc,p.id) from paged p),'[]'::jsonb)
  ) into v_result;
  return v_result;
end;
$$;

create function private.super_admin_change_role(p_user_id uuid,p_role public.app_role,p_enabled boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := auth.uid(); v_verified timestamptz; v_changed integer;
begin
  if v_actor is null then raise exception 'super_admin_required' using errcode='42501'; end if;
  -- Serialize role changes, including concurrent removals and actor revocation.
  perform pg_catalog.pg_advisory_xact_lock(746463001);
  if not private.has_any_role(array['super_admin']::public.app_role[]) then
    raise exception 'super_admin_required' using errcode='42501';
  end if;
  if p_role is null or p_role='customer' or p_enabled is null then raise exception 'role_not_assignable'; end if;
  select email_confirmed_at into v_verified from auth.users where id=p_user_id for update;
  if not found then raise exception 'user_not_found'; end if;
  if p_enabled and v_verified is null then raise exception 'user_unverified'; end if;
  if not p_enabled and p_role='super_admin' then
    if (select count(*) from public.user_roles where role='super_admin')<=1 then
      raise exception 'last_super_admin';
    end if;
    if p_user_id=v_actor then raise exception 'cannot_revoke_own_super_admin'; end if;
  end if;
  if p_enabled then
    insert into public.user_roles(user_id,role,granted_by)
      values(p_user_id,p_role,v_actor) on conflict(user_id,role) do nothing;
  else
    delete from public.user_roles where user_id=p_user_id and role=p_role;
  end if;
  get diagnostics v_changed = row_count;
  if v_changed>0 then
    insert into private.role_change_events(actor_id,target_id,role,enabled)
      values(v_actor,p_user_id,p_role,p_enabled);
  end if;
  return jsonb_build_object('changed',v_changed>0,'enabled',p_enabled,'role',p_role);
end;
$$;

revoke all on function private.super_admin_list_users(text,integer) from public,anon,authenticated;
revoke all on function private.super_admin_change_role(uuid,public.app_role,boolean) from public,anon,authenticated;
grant execute on function private.super_admin_list_users(text,integer) to authenticated;
grant execute on function private.super_admin_change_role(uuid,public.app_role,boolean) to authenticated;

-- Public API wrappers retain the caller's identity and cannot bypass the guards.
create function public.super_admin_list_users(p_query text default '',p_page integer default 1)
returns jsonb language sql security invoker set search_path = '' as $$
  select private.super_admin_list_users(p_query,p_page);
$$;
create function public.super_admin_change_role(p_user_id uuid,p_role public.app_role,p_enabled boolean)
returns jsonb language sql security invoker set search_path = '' as $$
  select private.super_admin_change_role(p_user_id,p_role,p_enabled);
$$;
revoke all on function public.super_admin_list_users(text,integer) from public,anon,authenticated;
revoke all on function public.super_admin_change_role(uuid,public.app_role,boolean) from public,anon,authenticated;
grant execute on function public.super_admin_list_users(text,integer) to authenticated;
grant execute on function public.super_admin_change_role(uuid,public.app_role,boolean) to authenticated;
