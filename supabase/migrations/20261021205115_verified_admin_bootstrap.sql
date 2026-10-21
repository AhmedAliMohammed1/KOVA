-- A one-time administrator assignment, seeded separately in the private schema.
-- Only a verified owner of an explicitly approved email can claim it.
create table if not exists private.admin_bootstrap (
  email text primary key check (email = lower(trim(email))),
  claimed_user_id uuid references auth.users(id),
  claimed_at timestamptz
);
revoke all on private.admin_bootstrap from public, anon, authenticated;

create or replace function private.claim_bootstrap_admin()
returns trigger language plpgsql security definer set search_path = '' as $$
declare approved_email text;
begin
  if new.email is null or new.email_confirmed_at is null then return new; end if;
  update private.admin_bootstrap
    set claimed_user_id = new.id, claimed_at = now()
    where email = lower(trim(new.email)) and claimed_user_id is null
    returning email into approved_email;
  if approved_email is not null then
    insert into public.user_roles(user_id, role) values(new.id, 'admin')
      on conflict(user_id, role) do nothing;
  end if;
  return new;
end;
$$;
revoke all on function private.claim_bootstrap_admin() from public, anon, authenticated;
drop trigger if exists kova_verified_admin_bootstrap on auth.users;
create trigger kova_verified_admin_bootstrap
  after insert or update of email, email_confirmed_at on auth.users
  for each row execute function private.claim_bootstrap_admin();
