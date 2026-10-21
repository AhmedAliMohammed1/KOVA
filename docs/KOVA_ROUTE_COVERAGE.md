# KOVA route and journey coverage

Every pre-existing page/API route was migrated to an owning application. All route files build; the table distinguishes browser-verified public journeys from protected/provider-dependent acceptance. `[locale]` covers English and Arabic. A checked implementation entry is not a claim of a completed live transaction.

| Implemented | Application | Route | Verification |
|---|---|---|---|
| [x] | storefront | `/[locale]/account/forgot-password` | Build verified; account/order-dependent acceptance requires sandbox records |
| [x] | storefront | `/[locale]/account/orders/[orderNumber]/invoice` | Build verified; account/order-dependent acceptance requires sandbox records |
| [x] | storefront | `/[locale]/account` | Build verified; account/order-dependent acceptance requires sandbox records |
| [x] | storefront | `/[locale]/account/returns/new` | Build verified; account/order-dependent acceptance requires sandbox records |
| [x] | storefront | `/[locale]/account/returns` | Build verified; account/order-dependent acceptance requires sandbox records |
| [x] | storefront | `/[locale]/account/reviews` | Build verified; account/order-dependent acceptance requires sandbox records |
| [x] | storefront | `/[locale]/account/sign-up` | Build verified; account/order-dependent acceptance requires sandbox records |
| [x] | storefront | `/[locale]/account/update-password` | Build verified; account/order-dependent acceptance requires sandbox records |
| [x] | storefront | `/[locale]/auth/confirm` | Build verified; account/order-dependent acceptance requires sandbox records |
| [x] | storefront | `/[locale]/cart` | EN/AR responsive browsing checked; persistence/recovery checked where applicable |
| [x] | storefront | `/[locale]/checkout` | Unconfigured failure + bag recovery checked; sandbox transaction required |
| [x] | storefront | `/[locale]/help/[topic]` | EN/AR responsive browsing checked; persistence/recovery checked where applicable |
| [x] | storefront | `/[locale]` | EN/AR responsive browsing checked; persistence/recovery checked where applicable |
| [x] | storefront | `/[locale]/products/[slug]` | EN/AR responsive browsing checked; persistence/recovery checked where applicable |
| [x] | storefront | `/[locale]/shop` | EN/AR responsive browsing checked; persistence/recovery checked where applicable |
| [x] | storefront | `/[locale]/track/[orderNumber]` | Build verified; account/order-dependent acceptance requires sandbox records |
| [x] | storefront | `/[locale]/track` | Build verified; account/order-dependent acceptance requires sandbox records |
| [x] | storefront | `/[locale]/wishlist` | Build verified; account/order-dependent acceptance requires sandbox records |
| [x] | storefront | `/api/cart/unsubscribe` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/checkout/discounts/validate` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/checkout/orders` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/checkout/otp/request` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/checkout/otp/verify` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/cron/abandoned-cart` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/cron/commercial` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/google/merchant-feed` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/health/live` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/health/ready` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/orders/[orderNumber]/payment-proof` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/orders/[orderNumber]` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/payments/paymob/webhook` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/returns` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/revalidate` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/stock/subscribe` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/api/stock/unsubscribe` | Build + relevant regression tests; provider/database runtime acceptance outstanding |
| [x] | storefront | `/` | Build verified; account/order-dependent acceptance requires sandbox records |
| [x] | admin | `/[locale]/account/forgot-password` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/[locale]/account` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/[locale]/account/update-password` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/[locale]/admin/banners` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/[locale]/admin/commercial` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/[locale]/admin/discounts` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/[locale]/admin/orders` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/[locale]/admin` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/[locale]/admin/products/[id]/edit` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/[locale]/admin/reviews` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/[locale]/admin/shipping` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/[locale]/admin/sizes` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/[locale]/auth/confirm` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/[locale]` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/api/admin/exports/[report]` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/api/admin/returns/evidence` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |
| [x] | admin | `/` | Guest sign-in boundary verified; authenticated staff/RLS workflows need sandbox account |

## Shared journey checklist

- [x] KOVA shared tokens, shell, focus, responsive type, RTL and reduced motion.
- [x] Navigation/search entry, native mobile dialog, retained URL context on locale changes, announcements and footer.
- [x] Catalog filters/sort/pagination, no-results recovery, factual prices/review counts and available-size summary.
- [x] Product galleries/variant URLs, size guidance and explicit choose-size path; color fallback media behavior retained.
- [x] Cart/wishlist persistence and existing guest merge contracts retained. Server money/stock logic unchanged.
- [x] Existing checkout, proof replacement/review, order/tracking/invoice, account/address, returns/reviews paths preserved and reskinned.
- [x] All existing dashboard pages, CSV/private-evidence APIs and mutations migrated to admin, with page/action/API role checks.
- [x] Storefront owns payment webhooks and both cron jobs; admin has no scheduled jobs.
- [x] Secure fixed-scope cross-app invalidation and legacy redirects prepared, disabled until actual deployment URLs are configured.
- [ ] Sandbox completion: checkout/confirmation, authenticated guest merge/addresses/history, payment upload/replacement/failure/retry and staff review.
- [ ] Sandbox completion: fulfillment, invoices, returns/exchanges/restock/refunds, customer reviews/moderation, exports and unauthorized-role checks against live RLS.
- [ ] Cross-deployment synchronization and auth callback tests after verified project/domain access.
- [ ] Business sign-off: garment/SKU mappings, material/care information, full policy conditions, standalone logo and provider/sender settings.

Existing architecture/security/testing/operations documents retain historical detail. Source paths moved to the owning app or shared package; use this inventory and the current runbook for new work.
