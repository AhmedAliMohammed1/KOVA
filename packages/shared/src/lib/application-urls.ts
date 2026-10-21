import type { Locale } from "./i18n";
function origin(value: string | undefined) {
  if (!value) return "";
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.pathname !== '/') throw new Error('Application URL must be an HTTP(S) origin');
  return url.origin;
}
export function adminUrl(locale: Locale, path = "") { return `${origin(process.env.NEXT_PUBLIC_ADMIN_URL)}/${locale}/admin${path}`; }
export function storefrontUrl(locale: Locale, path = "") { return `${origin(process.env.NEXT_PUBLIC_STOREFRONT_URL)}/${locale}${path}`; }
