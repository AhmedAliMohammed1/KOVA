# Route and journey inventory

Generated from current app page.tsx/route.ts files on 2026-10-22. There are **54**
route source files across both applications; locale placeholders cover English
and Arabic. Metadata assets (icon/social image/robots/sitemap), proxy redirects,
error/loading boundaries and Server Actions are additional surfaces, not omitted
API owners. A source/build check does not certify a live financial transaction.

| App | Route | Source | Verification scope |
|---|---|---|---|
| storefront | `/[locale]/account/forgot-password` | [source](../apps/storefront/src/app/[locale]/account/forgot-password/page.tsx) | Auth UI and denied/invalid sign-in boundaries checked; successful email/account transaction acceptance is environment-specific. |
| storefront | `/[locale]/account/orders/[orderNumber]/invoice` | [source](../apps/storefront/src/app/[locale]/account/orders/[orderNumber]/invoice/page.tsx) | Built; owner-scoped contracts implemented; authenticated record/transaction acceptance requires test fixtures. |
| storefront | `/[locale]/account` | [source](../apps/storefront/src/app/[locale]/account/page.tsx) | Auth UI and denied/invalid sign-in boundaries checked; successful email/account transaction acceptance is environment-specific. |
| storefront | `/[locale]/account/returns/new` | [source](../apps/storefront/src/app/[locale]/account/returns/new/page.tsx) | Built; owner-scoped contracts implemented; authenticated record/transaction acceptance requires test fixtures. |
| storefront | `/[locale]/account/returns` | [source](../apps/storefront/src/app/[locale]/account/returns/page.tsx) | Built; owner-scoped contracts implemented; authenticated record/transaction acceptance requires test fixtures. |
| storefront | `/[locale]/account/reviews` | [source](../apps/storefront/src/app/[locale]/account/reviews/page.tsx) | Built; owner-scoped contracts implemented; authenticated record/transaction acceptance requires test fixtures. |
| storefront | `/[locale]/account/sign-up` | [source](../apps/storefront/src/app/[locale]/account/sign-up/page.tsx) | Auth UI and denied/invalid sign-in boundaries checked; successful email/account transaction acceptance is environment-specific. |
| storefront | `/[locale]/account/update-password` | [source](../apps/storefront/src/app/[locale]/account/update-password/page.tsx) | Auth UI and denied/invalid sign-in boundaries checked; successful email/account transaction acceptance is environment-specific. |
| storefront | `/[locale]/auth/confirm` | [source](../apps/storefront/src/app/[locale]/auth/confirm/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/[locale]/cart` | [source](../apps/storefront/src/app/[locale]/cart/page.tsx) | Public/recovery/persistence and typography checks exist; authenticated merge/records need sandbox acceptance. |
| storefront | `/[locale]/checkout` | [source](../apps/storefront/src/app/[locale]/checkout/page.tsx) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/[locale]/help/[topic]` | [source](../apps/storefront/src/app/[locale]/help/[topic]/page.tsx) | Public/recovery/persistence and typography checks exist; authenticated merge/records need sandbox acceptance. |
| storefront | `/[locale]` | [source](../apps/storefront/src/app/[locale]/page.tsx) | EN/AR responsive discovery, colour selection/gallery links and typography checked. |
| storefront | `/[locale]/products/[slug]` | [source](../apps/storefront/src/app/[locale]/products/[slug]/page.tsx) | EN/AR responsive discovery, colour selection/gallery links and typography checked. |
| storefront | `/[locale]/shop` | [source](../apps/storefront/src/app/[locale]/shop/page.tsx) | EN/AR responsive discovery, colour selection/gallery links and typography checked. |
| storefront | `/[locale]/track/[orderNumber]` | [source](../apps/storefront/src/app/[locale]/track/[orderNumber]/page.tsx) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/[locale]/track` | [source](../apps/storefront/src/app/[locale]/track/page.tsx) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/[locale]/wishlist` | [source](../apps/storefront/src/app/[locale]/wishlist/page.tsx) | Public/recovery/persistence and typography checks exist; authenticated merge/records need sandbox acceptance. |
| storefront | `/api/cart/unsubscribe` | [source](../apps/storefront/src/app/api/cart/unsubscribe/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/api/checkout/discounts/validate` | [source](../apps/storefront/src/app/api/checkout/discounts/validate/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/api/checkout/orders` | [source](../apps/storefront/src/app/api/checkout/orders/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/api/checkout/otp/request` | [source](../apps/storefront/src/app/api/checkout/otp/request/route.ts) | Disabled-OTP runtime behavior and relevant unit contracts checked; enabled Twilio flow requires acceptance. |
| storefront | `/api/checkout/otp/verify` | [source](../apps/storefront/src/app/api/checkout/otp/verify/route.ts) | Disabled-OTP runtime behavior and relevant unit contracts checked; enabled Twilio flow requires acceptance. |
| storefront | `/api/cron/abandoned-cart` | [source](../apps/storefront/src/app/api/cron/abandoned-cart/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/api/cron/commercial` | [source](../apps/storefront/src/app/api/cron/commercial/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/api/google/merchant-feed` | [source](../apps/storefront/src/app/api/google/merchant-feed/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/api/health/live` | [source](../apps/storefront/src/app/api/health/live/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/api/health/ready` | [source](../apps/storefront/src/app/api/health/ready/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/api/orders/[orderNumber]/payment-proof` | [source](../apps/storefront/src/app/api/orders/[orderNumber]/payment-proof/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/api/orders/[orderNumber]` | [source](../apps/storefront/src/app/api/orders/[orderNumber]/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/api/payments/paymob/webhook` | [source](../apps/storefront/src/app/api/payments/paymob/webhook/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/api/returns` | [source](../apps/storefront/src/app/api/returns/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/api/revalidate` | [source](../apps/storefront/src/app/api/revalidate/route.ts) | Bearer rejection and successful fixed-scope production invalidation previously checked; keep shared secret private. |
| storefront | `/api/stock/subscribe` | [source](../apps/storefront/src/app/api/stock/subscribe/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/api/stock/unsubscribe` | [source](../apps/storefront/src/app/api/stock/unsubscribe/route.ts) | Built and covered by relevant regression contracts; live transaction/provider acceptance is not implied. |
| storefront | `/` | [source](../apps/storefront/src/app/page.tsx) | Arabic /ar entry verified despite English browser preference. |
| admin | `/[locale]/account/forgot-password` | [source](../apps/admin/src/app/[locale]/account/forgot-password/page.tsx) | Staff sign-in/recovery boundary implemented; callback/email delivery must be verified for each environment. |
| admin | `/[locale]/account` | [source](../apps/admin/src/app/[locale]/account/page.tsx) | Staff sign-in/recovery boundary implemented; callback/email delivery must be verified for each environment. |
| admin | `/[locale]/account/update-password` | [source](../apps/admin/src/app/[locale]/account/update-password/page.tsx) | Staff sign-in/recovery boundary implemented; callback/email delivery must be verified for each environment. |
| admin | `/[locale]/admin/banners` | [source](../apps/admin/src/app/[locale]/admin/banners/page.tsx) | Built; page/action/database role checks remain required; transactional writes need sandbox acceptance. |
| admin | `/[locale]/admin/commercial` | [source](../apps/admin/src/app/[locale]/admin/commercial/page.tsx) | Built; page/action/database role checks remain required; transactional writes need sandbox acceptance. |
| admin | `/[locale]/admin/discounts` | [source](../apps/admin/src/app/[locale]/admin/discounts/page.tsx) | Built; page/action/database role checks remain required; transactional writes need sandbox acceptance. |
| admin | `/[locale]/admin/orders` | [source](../apps/admin/src/app/[locale]/admin/orders/page.tsx) | Built; page/action/database role checks remain required; transactional writes need sandbox acceptance. |
| admin | `/[locale]/admin` | [source](../apps/admin/src/app/[locale]/admin/page.tsx) | Built; page/action/database role checks remain required; transactional writes need sandbox acceptance. |
| admin | `/[locale]/admin/products/[id]/edit` | [source](../apps/admin/src/app/[locale]/admin/products/[id]/edit/page.tsx) | Built; page/action/database role checks remain required; transactional writes need sandbox acceptance. |
| admin | `/[locale]/admin/reviews` | [source](../apps/admin/src/app/[locale]/admin/reviews/page.tsx) | Built; page/action/database role checks remain required; transactional writes need sandbox acceptance. |
| admin | `/[locale]/admin/shipping` | [source](../apps/admin/src/app/[locale]/admin/shipping/page.tsx) | Live authenticated read-only form observed; changes need sandbox acceptance. |
| admin | `/[locale]/admin/sizes` | [source](../apps/admin/src/app/[locale]/admin/sizes/page.tsx) | Built; page/action/database role checks remain required; transactional writes need sandbox acceptance. |
| admin | `/[locale]/admin/users` | [source](../apps/admin/src/app/[locale]/admin/users/page.tsx) | Authenticated live EN/AR owner view, mobile/landscape/dialog/search/focus checked; grant/revoke/denial/audit SQL test rolled back. |
| admin | `/[locale]/auth/confirm` | [source](../apps/admin/src/app/[locale]/auth/confirm/route.ts) | Built; page/action/database role checks remain required; transactional writes need sandbox acceptance. |
| admin | `/[locale]` | [source](../apps/admin/src/app/[locale]/page.tsx) | Built; page/action/database role checks remain required; transactional writes need sandbox acceptance. |
| admin | `/api/admin/exports/[report]` | [source](../apps/admin/src/app/api/admin/exports/[report]/route.ts) | Built; page/action/database role checks remain required; transactional writes need sandbox acceptance. |
| admin | `/api/admin/returns/evidence` | [source](../apps/admin/src/app/api/admin/returns/evidence/route.ts) | Built; page/action/database role checks remain required; transactional writes need sandbox acceptance. |
| admin | `/` | [source](../apps/admin/src/app/page.tsx) | Built; page/action/database role checks remain required; transactional writes need sandbox acceptance. |

## Ownership and extension

Storefront owns checkout, proof submission, Paymob webhooks, both cron jobs,
merchant feed, health and public cache invalidation. Admin owns exports, staff
private evidence, product/inventory/content/order/return/review management and
super-admin user roles. Shared code is not a third independently deployed app.

Read [ADMIN](ADMIN.md) and each page/action/RPC for exact role sets; a route's
visibility is not authorization. The current user-role page is super-admin only.
Storefront old staff paths redirect only through the configured admin origin;
those redirects are next.config behavior, not duplicate source routes.

When adding/moving routes, update this inventory, source ownership, any metadata
and relevant auth/role tests. [Testing](TESTING.md) and [TASKS](../TASKS.md) separate
implemented behavior, browser evidence and remaining provider/sandbox acceptance.
