-- Integration test against the configured KOVA project. All test writes roll back.
begin;
do $$
declare v_owner uuid; v_admin uuid;
begin
  select id into strict v_owner from auth.users where lower(email)='ahmedelsaify213@gmail.com';
  select id into strict v_admin from auth.users where lower(email)='mslammohamed51@gmail.com';
  perform set_config('kova.test_owner',v_owner::text,true);
  perform set_config('kova.test_admin',v_admin::text,true);
  perform set_config('kova.test_audit_count',(select count(*)::text from private.role_change_events where actor_id=v_owner),true);
  if has_function_privilege('anon','public.super_admin_list_users(text,integer)','execute')
    or has_function_privilege('anon','public.super_admin_change_role(uuid,public.app_role,boolean)','execute') then
    raise exception 'Anonymous execution was granted';
  end if;
  if has_table_privilege('authenticated','public.user_roles','insert')
    or has_table_privilege('authenticated','public.user_roles','delete')
    or has_table_privilege('authenticated','private.role_change_events','select') then
    raise exception 'Direct role/audit access was granted';
  end if;
end;
$$;
set local role authenticated;
do $$
declare v_owner uuid:=current_setting('kova.test_owner')::uuid;
  v_admin uuid:=current_setting('kova.test_admin')::uuid; v_result jsonb;
begin
  perform set_config('request.jwt.claims',jsonb_build_object('sub',v_owner,'role','authenticated')::text,true);
  v_result:=public.super_admin_list_users('mslammohamed51@gmail.com',1);
  if (v_result->>'total')::integer<>1 then raise exception 'Exact user search failed'; end if;
  if (public.super_admin_list_users('%',1)->>'total')::integer<>0 then raise exception 'Search treated literal as wildcard'; end if;
  if (public.super_admin_list_users('',100000)->'users')<>'[]'::jsonb then raise exception 'Pagination limit failed'; end if;
  v_result:=public.super_admin_change_role(v_admin,'support',true);
  if not (v_result->>'changed')::boolean then raise exception 'Grant failed'; end if;
  v_result:=public.super_admin_change_role(v_admin,'support',true);
  if (v_result->>'changed')::boolean then raise exception 'Duplicate grant not idempotent'; end if;
  v_result:=public.super_admin_change_role(v_admin,'support',false);
  if not (v_result->>'changed')::boolean then raise exception 'Revoke failed'; end if;
  begin
    perform public.super_admin_change_role(v_admin,'customer',false);
    raise exception 'Customer removal allowed';
  exception when raise_exception then
    if sqlerrm<>'role_not_assignable' then raise; end if;
  end;
  begin
    perform public.super_admin_change_role(v_owner,'super_admin',false);
    raise exception 'Last super admin removal allowed';
  exception when raise_exception then
    if sqlerrm<>'last_super_admin' then raise; end if;
  end;
  perform public.super_admin_change_role(v_admin,'super_admin',true);
  begin
    perform public.super_admin_change_role(v_owner,'super_admin',false);
    raise exception 'Self-demotion allowed';
  exception when raise_exception then
    if sqlerrm<>'cannot_revoke_own_super_admin' then raise; end if;
  end;
  perform public.super_admin_change_role(v_admin,'super_admin',false);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',v_admin,'role','authenticated')::text,true);
  begin
    perform public.super_admin_list_users('',1);
    raise exception 'Regular admin accessed directory';
  exception when insufficient_privilege then null; end;
  begin
    perform public.super_admin_change_role(v_admin,'super_admin',true);
    raise exception 'Regular admin escalated privileges';
  exception when insufficient_privilege then null; end;
  -- Non-staff identities and an absent identity must also be rejected.
  perform set_config('request.jwt.claims',jsonb_build_object('sub',gen_random_uuid(),'role','authenticated')::text,true);
  begin
    perform public.super_admin_list_users('',1);
    raise exception 'Non-staff directory access allowed';
  exception when insufficient_privilege then null; end;
  perform set_config('request.jwt.claims','{}',true);
  begin
    perform public.super_admin_change_role(v_admin,'admin',true);
    raise exception 'Missing identity allowed';
  exception when insufficient_privilege then null; end;
end;
$$;
reset role;
do $$
begin
  if (select count(*) from private.role_change_events where actor_id=current_setting('kova.test_owner')::uuid)<>current_setting('kova.test_audit_count')::integer+4 then
    raise exception 'Role changes were not audited exactly once';
  end if;
end;
$$;
select 'Role-management database integration checks passed; test writes rolled back.' as result;
rollback;
