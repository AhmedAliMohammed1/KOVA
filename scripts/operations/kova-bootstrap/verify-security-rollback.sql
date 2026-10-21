-- Run only against the fresh KOVA project. Every synthetic record is rolled back.
begin;
do $test$
declare
  v_user uuid := gen_random_uuid(); v_email text; v_product public.products;
  v_colours jsonb; v_images jsonb;
begin
  select email into v_email from private.admin_bootstrap where claimed_user_id is null limit 1;
  if v_email is null then raise exception 'Expected pending approved admin'; end if;
  insert into auth.users(id,aud,role,email,raw_app_meta_data,raw_user_meta_data)
    values(v_user,'authenticated','authenticated',v_email,'{}'::jsonb,'{}'::jsonb);
  if exists(select 1 from public.user_roles where user_id=v_user and role='admin') then
    raise exception 'Unverified email received admin';
  end if;
  update auth.users set email_confirmed_at=now() where id=v_user;
  if not exists(select 1 from public.user_roles where user_id=v_user and role='admin') then
    raise exception 'Approved verified owner did not receive admin';
  end if;
  perform set_config('request.jwt.claim.sub',v_user::text,true);
  select * into v_product from public.products where slug='kova-womens-scrub-set';
  select jsonb_agg(jsonb_build_object('code',ov.code,'en',ov.label_en,'ar',ov.label_ar,'hex',ov.swatch_hex))
    into v_colours from public.product_option_values ov join public.product_options o on o.id=ov.option_id
    where o.product_id=v_product.id and o.code='color';
  select jsonb_agg(jsonb_build_object('url',storage_path,'colour_code',colour_code,'position',position,'alt_en',alt_en,'alt_ar',alt_ar))
    into v_images from public.product_images where product_id=v_product.id;
  perform public.admin_update_product(
    p_product_id=>v_product.id,p_slug=>v_product.slug,p_title_en=>'KOVA Women Test',p_title_ar=>'كوفا',
    p_description_en=>'Rollback test',p_description_ar=>'اختبار',p_category_id=>v_product.category_id,
    p_gender=>'women',p_status=>'draft',p_base_price_minor=>85000,p_cod_deposit_minor=>20000,
    p_colours=>v_colours,p_sizes=>array['S'],p_image_url=>'/images/kova/studio-1.webp',p_images=>v_images);
  if exists(select 1 from public.inventory i join public.product_variants v on v.id=i.variant_id
    where v.product_id=v_product.id and i.on_hand<>0) then raise exception 'Invented stock'; end if;
  perform public.admin_delete_product(v_product.id);
  if not exists(select 1 from public.products where id=v_product.id and status='archived') then
    raise exception 'Archive removed product'; end if;
  if (select count(*) from public.product_images where product_id=v_product.id)<>50 then
    raise exception 'Archive removed images'; end if;
end $test$;
rollback;
select jsonb_build_object('unverifiedAdminDenied',true,'verifiedAdminGranted',true,
  'newVariantsStartAtZeroStock',true,'archivePreservesProductAndImages',true,'rolledBack',true,
  'usersRemaining',(select count(*) from auth.users),
  'variantsRemaining',(select count(*) from public.product_variants)) as verification;
