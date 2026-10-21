-- Compatibility RPC: archive products, preserving all historical references.
create or replace function public.admin_delete_product(p_product_id bigint)
returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  if auth.uid() is null or not (select private.has_any_role(array['product_manager','admin','super_admin']::public.app_role[])) then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  update public.products set status='archived', updated_at=now() where id=p_product_id;
  if not found then raise exception 'Product not found'; end if;
  return true;
end;
$$;
revoke all on function public.admin_delete_product(bigint) from public, anon;
grant execute on function public.admin_delete_product(bigint) to authenticated;
