> Historical snapshot archived on 2026-10-22. Not current operating instructions. Original relative links may no longer resolve. Read the current README and PROJECT_STATE first.

# Latest database checkpoint

The owner-selected project is now `khccehpehasicomumani`. The fresh schema and KOVA drafts are installed; see `KOVA_DATABASE_SETUP.md` and `qa/new-database-verification.json`. Both local apps use the new public connection. All 350 tests pass across 40 files; both builds and lint pass. Historical checkpoints below refer to the former database unless explicitly dated as the new installation. No accounts/orders were copied and no hosted environment keys were changed.

# KOVA redesign delivery

Implemented: navy/teal bilingual storefront and shared account/checkout/admin design tokens; editorial studio photography; accessible native mobile navigation; persistent variant URLs across locale switches; explicit choose-size card actions; support, sizing, shipping, returns, privacy and terms pages; order-tracking entry; branded metadata, invoices, email templates, social card and actual-catalog sitemap; focused form error feedback; purchase reporting deduplication and private query-string exclusion from first-party analytics.

The monorepo now builds separate storefront and admin applications. Dashboard pages, APIs and supporting mutations are physically owned by admin. Shared contracts and database utilities live in `packages/shared`. Root migrations remain single-owner. Historical orders, storage paths, local cart keys, order-number formats, provider integrations and RLS policies were preserved. At the owner’s request, the nine old products were archived and two new KOVA drafts created. Both cost EGP 850 with EGP 200 COD deposits. The transaction verified preservation of all 19 orders, 22 linked order items and one review. Sizes and stock are unconfirmed; drafts remain unpublished and the local preview disables ordering. Retired products are removed from saved shopping selections.

## Evidence

- Token/component specification: `design-system/kova/MASTER.md` and `packages/shared/tokens.css`.
- Photograph manifest and mapping limits: `docs/product-photography-manifest.json` and `docs/KOVA_ASSETS.md`.
- Every page/API and operational owner: `docs/KOVA_ROUTE_COVERAGE.md`.
- Browser evidence: `docs/qa/browser-results.json`, English/Arabic desktop/mobile captures, product and admin guest captures.
- Automated regression suite and build/lint output: latest results recorded in `docs/qa/verification.json`.
- Reproducible local navigation metrics: `docs/qa/performance.json` (lab only; not field Core Web Vitals). Contrast calculations: `docs/qa/contrast.json`.
- Setup/deployment/monitoring/rollback: `docs/KOVA_DEPLOYMENT.md`.

## Full photography correction

The complete supplied local folder contains 70 JPEGs, not the 13-file subset returned by the earlier Drive listing. All 70 are inspected, optimized and recorded with hashes/dimensions/views/alt text. Four visual garment/color groups plus still-life/water frames were identified. The homepage now has a real men’s studio image; owner-confirmed galleries now contain 50 women’s and 13 men’s photographs. See `KOVA_ASSETS.md` and the updated manifest/contact sheets.

## Measured verification checkpoint

- 39 test files / **348 tests passed**; lint has zero warnings; both TypeScript and independent production builds pass.
- All **44 original page/API route files** are retained under their application owners; there are now **53 page/API route files** including the new support and standalone-auth routes.
- **19 browser checks passed** against the local production builds, with no page runtime errors. Screenshots cover English/Arabic desktop/mobile, product availability and colour controls and the admin guest boundary.
- Three-run medians at 375×812 with 4× CPU and the documented network configuration: English home **1.160s LCP**, Arabic home **1.224s**, catalog **1.068s**, product **1.144s**. Measured CLS was **0** on those samples. This is a warm-server local lab, without production database latency; INP and field p75 remain unmeasured.
- Six opaque color pairs passed calculated contrast thresholds. White on dark teal: **4.86:1**; white on navy: **18.21:1**; visible control borders: **3.55:1**.

## Remaining acceptance and external requirements

1. The supplied `kovaadmin` project returned 404 in the connected team and scoped project listing was empty. No verified deployment domain is available; no production routing or project settings were changed. Restore access before deployment.
2. Provide a non-production database environment, staff/customer test accounts, payment destinations and sandbox provider configuration to verify order creation through confirmation, uploads/replacement/approval/rejection, authenticated addresses/history/invoices, returns, reviews, inventory writes, order handling, exports and cross-deployment synchronization. Local browser tests deliberately did not submit live transactions.
3. Confirm available sizes and inventory for the women’s grey/blue/burgundy set and separate black men’s set before publishing the drafts. Product grouping, EGP 850 prices, EGP 200 COD deposits and photo mappings are owner-approved. Verify material/care fields before adding claims. Water imagery is not evidence of performance.
4. Obtain the standalone official logo and business-approved policy details (return conditions/costs, full privacy/legal policy). Current help text describes implemented journeys and avoids unverified promises. Existing contact channels were retained; no sender address or live domain was blindly renamed.
5. Complete Resend sender verification, any enabled Twilio OTP acceptance, optional GA/Meta acceptance and existing backup/restore release requirements. Paymob remains disabled pending its own activation checklist.
6. Real screen-reader and authenticated overlay acceptance, 200% zoom across protected pages, production field vitals, database query/connection baselines and deployment rollback drills remain unmeasured. No WCAG certification, field performance result, or database-load reduction is claimed.

The source redesign and independent builds are reviewable locally. Production launch acceptance remains incomplete for the external items above.

## Interactive repair checkpoint

The initial preview had no per-application Supabase configuration: account forms and checkout were unavailable, and admin redirects lacked their destination. The missing configuration was not covered by the original public-page checks. Public database credentials and existing public payment/OTP settings have now been restored to ignored local environment files. The original Vercel project `scrub-vibe` is readable by name without a team selector; the earlier supplied-team query returning an empty list did not establish that all projects were inaccessible. The requested `kovaadmin` project is still unverified.

The current preview runs storefront on localhost:3200 and admin on localhost:3201. An explicit local-only draft catalog flag keeps approved KOVA drafts reviewable while account services connect to Supabase; it cannot activate on Vercel. No products were published. The server secret remains unavailable because Vercel marks it sensitive and returns no readable value. Privileged order/payment/automation operations require that key locally. No server role was fabricated and no RLS was weakened.

Connected browser verification confirms English/Arabic enabled auth forms, an actual invalid-credential server-action round trip, admin redirect to the staff sign-in, persistent guest wishlist, both size-guide languages, unit switching, calculator input, Escape closure, mobile reflow and navy computed styles. These checks created no users or orders and sent no recovery emails. See `qa/connected-browser-results.json`. Successful authenticated staff/customer operations remain unverified without test credentials. The size guide and 12 related components/pages now use shared KOVA colour tokens instead of legacy hardcoded greens.

## Arabic entry and selectable card colours

The storefront root now redirects to `/ar`; explicit `/en` links remain English. Product-card swatches are keyboard-accessible buttons with selected state and 44px targets. Selecting a colour immediately changes the card photograph and adds the matching `colour` parameter to its image, title, action and review links. The product page opens with that colour selected. This applies to shared cards on home, shop and wishlist. Image quality settings are unchanged.

355 tests across 42 files passed, both application builds and lint passed. Browser checks verified an Arabic root visit with an English browser preference, matching blue card/product gallery images, selected-colour URLs, and no horizontal overflow in Arabic mobile and English desktop. See `qa/language-colour-results.json`.
