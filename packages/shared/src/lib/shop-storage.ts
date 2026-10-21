// Preserve the original project's storage, while avoiding product-ID collisions
// when a browser connects to a different Supabase database.
export function shopStorageKey(url = process.env.NEXT_PUBLIC_SUPABASE_URL) {
  if (!url) return "scrub-vibe-shop";
  try {
    const project = new URL(url).hostname.split(".")[0];
    return project === "iqufqtjotgpmhhtvlxwf" ? "scrub-vibe-shop" : `kova-shop-${project}`;
  } catch {
    return "scrub-vibe-shop";
  }
}
