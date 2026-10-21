# Loading and hosted catalog checkpoint

Historical performance measurements below retain their original commit/sample scope. Current deployment, catalog and roles: [PROJECT_STATE](../PROJECT_STATE.md). Latest Arabic font/content-height behavior: [typography](KOVA_ARABIC_TYPOGRAPHY.md). Do not interpret these dated samples as field p75/INP.

The hosted storefront at `https://kova-green-delta.vercel.app` was already deploying commit `8a93d9d` successfully. Its public Supabase URL/key matched the new project. Product cards were absent because both approved products were drafts, while only the localhost preview exposed drafts.

Both approved products were made publicly visible on 2026-10-21 at their existing EGP 850 prices and EGP 200 COD deposits. Publication did not create sizes, variants, stock or orders. Subsequent staff changes to the women's variants/inventory are preserved. The men's set later received owner-maintained variants; inspect the current database rather than this initial checkpoint. Purchase controls continue to follow actual database variants/stock; no checkout validation was bypassed.

## Performance changes

- Anonymous public catalog, CMS, sizing and approved-review reads use Next's data cache for 60 seconds. Only allowlisted read endpoints use it; account, order, checkout and staff clients are excluded.
- Published-time filters use the stable database `now` literal so each request does not generate a unique cache URL.
- Public responses have an eight-second deadline including their bodies. Timeout errors stop PostgREST retry cycles rather than extending a stalled load indefinitely.
- Product review pages use the summary's existing review count and skip fetching empty review pages, removing redundant reads. Personal eligibility and own-review data remain uncached.
- Both Vercel app configurations select Dublin (`dub1`), matching the Supabase database's Ireland region (`eu-west-1`). The previous deployment ran in `iad1`.
- An identical generated server-only cache invalidation secret is configured on both hosted projects. Staff edits invalidate the tagged public data through the authenticated endpoint. No secret is stored in Git.
- Photography files, derivative dimensions and quality settings are unchanged. Responsive image loading and lazy thumbnails are retained.

The previous live diagnostic received the first byte in about 0.68 seconds but did not finish streaming within 35 seconds; that single request does not establish a field percentile. The local connected warm-cache lab measured LCP around 1.05–1.22 seconds, with zero sampled CLS. These are local lab samples, not production p75 or INP evidence. See `qa/performance.json` and the live verification checkpoint for the measured limits.

## Administrator access

The owner-supplied email's account is now confirmed and has the `admin` and `super_admin` roles in the new project; the second requested account has regular `admin` access. Sign in at `https://admin-two-tau-18.vercel.app/en/admin` using the password chosen during registration. No password is generated or retrieved by this work. Use the recovery link if needed; successful email delivery depends on the configured Supabase Auth callback and email settings.

## Live acceptance

Both production deployments for commit `a8e856c` are READY and report region `dub1`. Public home and men's product pages returned 200, showed the expected catalog/product content, had no horizontal overflow and emitted no browser page errors. One unthrottled mobile-viewport navigation measured content ready at 1.785 seconds for home and 1.226 seconds for the men's page; corresponding LCP samples were 1.772 and 1.336 seconds. Sampled CLS was 0.052. This is a small live lab sample, not field p75 or a guarantee across networks. The authenticated production revalidation request returned 200 with `revalidated: true`. No image quality setting changed.

Initial live samples are retained in `qa/live-loading-initial.json`. The subsequent warm-data-cache run in `qa/live-loading.json` measured content ready at 0.426 seconds for home and 0.327 seconds for the men’s page. All homepage images were scrolled into view and decoded before the final screenshot, including lazy editorial images.
