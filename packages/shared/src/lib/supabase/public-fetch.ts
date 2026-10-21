const publicTables = new Set([
  "products", "product_images", "product_options", "product_option_values",
  "categories", "category_translations", "cms_banners", "size_chart_entries",
  "product_review_summaries", "product_reviews", "product_recommendations", "product_bundles", "product_bundle_items",
]);
export const PUBLIC_STOREFRONT_TAG = "kova-public-storefront";

// Only used by the anonymous, cookie-free public client. Account and commerce
// clients never use this transport. Checkout still validates stock atomically.
export function publicFetchOptions(input: string | URL | Request, init?: RequestInit) {
  const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
  const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
  const table = url.pathname.match(/^\/rest\/v1\/([^/]+)$/)?.[1];
  const publicSummary = url.pathname === "/rest/v1/rpc/get_product_review_summary";
  return ["GET", "HEAD"].includes(method) && ((table && publicTables.has(table)) || publicSummary)
    ? { cache: "force-cache" as const, next: { revalidate: 60, tags: [PUBLIC_STOREFRONT_TAG] } }
    : { cache: "no-store" as const };
}

export async function fetchPublicData(input: string | URL | Request, init?: RequestInit) {
  const timeout = AbortSignal.timeout(8000);
  const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
  try {
    const response = await fetch(input, { ...init, ...publicFetchOptions(input, init), signal });
    // Include the response body in the deadline; streamed headers alone do not
    // mean that a stalled database response has finished.
    const body = await response.arrayBuffer();
    return new Response(body.byteLength ? body : null, {
      status: response.status, statusText: response.statusText, headers: response.headers,
    });
  } catch (error) {
    // PostgREST does not retry AbortError. A request must not start another long
    // retry cycle after its loading deadline has expired.
    if (signal.aborted) throw new DOMException("Public data request timed out", "AbortError");
    throw error;
  }
}
