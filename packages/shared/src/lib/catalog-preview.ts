// Preview only the owner-approved draft catalog on a local workstation. Auth,
// account data and staff operations still use Supabase and normal authorization.
export function isLocalCatalogPreview() {
  if (process.env.KOVA_LOCAL_CATALOG_PREVIEW !== "true" || process.env.VERCEL) return false;
  try {
    return ["localhost", "127.0.0.1"].includes(new URL(process.env.NEXT_PUBLIC_APP_URL || "").hostname);
  } catch {
    return false;
  }
}
