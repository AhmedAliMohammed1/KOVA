-- The application uses the KOVA multi-colour creator; disable the legacy branded RPC.
revoke all on function public.admin_create_product(text, text, text, bigint, bigint, text, text[], integer, integer, public.product_status, text, text, bigint, bigint, text, text, text, text, text, text, text) from public, anon, authenticated;
