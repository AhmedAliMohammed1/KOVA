# Agent handoff — KOVA Scrubs

Reviewed 2026-10-22 (Europe/Berlin). Start here when continuing development.

## Read in this order

1. Root [AGENTS.md](../AGENTS.md), then the owning application's AGENTS.md.
2. [PROJECT_STATE.md](../PROJECT_STATE.md) for verified deployment and data facts.
3. [README.md](../README.md) and [environment reference](ENVIRONMENT.md) for setup.
4. [Architecture](ARCHITECTURE.md), then the relevant feature document.
5. [TASKS.md](../TASKS.md) for remaining work and acceptance gaps.

The installed code, current database and verified deployment outrank historical
checkpoints. [Documentation index](README.md) identifies canonical references.
`docs/archive/` is historical evidence, not setup guidance. Do not use archived
project IDs, product IDs or test counts as current facts.

## Current product and deployments

KOVA is an Arabic-first, bilingual Egyptian medical apparel store. `/` redirects
to `/ar`; explicit `/en` remains English. Storefront and admin are separate Next
applications sharing one Supabase database and shared source package.

| Surface | Production | Source |
|---|---|---|
| Storefront | https://kova-green-delta.vercel.app | `apps/storefront` |
| Administration | https://admin-two-tau-18.vercel.app | `apps/admin` |
| Database | `khccehpehasicomumani` | root `supabase/migrations` |

The former `iqufqtjotgpmhhtvlxwf` database contains legacy commerce history. It
is separate; accounts/orders were not transferred. Do not migrate, erase or
reseed either database merely to make an example or test pass.

## Find the right code

| Change | Primary locations |
|---|---|
| Home/shop/product routes | `apps/storefront/src/app/[locale]` |
| Shared product cards, cart, navigation, size guide | `packages/shared/src/components/store` |
| Catalog adapters and variant contracts | `packages/shared/src/features/catalog` and `packages/shared/src/lib/catalog.ts`, `packages/shared/src/server/catalog/supabase-catalog.ts` |
| Checkout/OTP/Paymob | `packages/shared/src/features/checkout`, storefront `src/app/api` |
| Auth forms/actions and callback policy | `packages/shared/src/features/auth`, each app's auth routes/proxy |
| Role policy and current-role guards | `packages/shared/src/server/auth` |
| Super-admin role management | `apps/admin/src/features/admin/user-roles`, admin `users/page.tsx` |
| Product/inventory/content/staff operations | `apps/admin/src/features` |
| Database contracts | `packages/shared/src/types/database.ts`, root `supabase/migrations` |
| Public cache and invalidation | shared `lib/supabase/public-fetch.ts`, admin `lib/revalidate-storefront.ts`, storefront `api/revalidate` |
| Brand/Arabic fonts | shared `tokens.css`, `src/styles/globals.css`, `src/fonts`, `design-system/kova` |

Each app resolves `@/*` to its own `src/*` first, then shared source. Avoid adding
cross-app imports or a new root `src/` app. Use `rg --files` and `rg -n` to locate
actual implementations; several pre-split paths in archived docs no longer exist.

## Working sequence

1. Inspect `git status` and preserve unrelated work. Raw photography, editor-agent
   folders and archives may be untracked; stage explicit task paths.
2. Read the relevant installed Next docs in `node_modules/next/dist/docs/` before
   Next-specific code changes. Read applicable skill and directory instructions.
3. Inspect live schema before DB changes. Use additive reviewed migrations and
   keep generated RPC types aligned. Migration names/timestamps are UTC history.
4. Keep commerce authority on the server/database. Never trust browser price,
   stock, permissions or payment success. Do not weaken RLS for a failing UI.
5. Implement English and Arabic, including RTL, mobile reflow, confirmation,
   pending/error states and focus restoration. Preserve photographic quality.
6. Run appropriate targeted checks, then the release gate for application changes.
   Docs-only changes need link/path/config consistency checks, not a claim that
   the application test suite was rerun.
7. Release only within the current user's authorization. Verify the exact commit
   is READY on the intended project; Git push alone is not live verification.
8. Update PROJECT_STATE, TASKS, CHANGELOG, test evidence and affected feature docs.
   Distinguish implemented, unit-tested, browser-checked and provider-accepted.

## Important invariants and known traps

- Money is integer EGP piastres: EGP 850 = 85000; EGP 200 deposit = 20000.
- Women's grey/blue/burgundy set and separate black men's set are approved KOVA
  products. Current variants/stock are owner-editable; never invent inventory.
- Card swatches change the photo and carry `?colour=code` into product links.
- Roles come from `user_roles`, not editable Auth user metadata. Only
  `super_admin` may manage roles; preserve self/last-super-admin guards and audit.
- Checkout phone OTP defaults to enabled in code/example. The chosen deployed
  setting was `CHECKOUT_PHONE_OTP_ENABLED=false`; explicitly set it and redeploy.
  This flag does not disable Supabase email verification.
- Paymob is implemented but held pending sandbox acceptance. Do not enable it
  based on the presence of keys alone.
- Public data cache: allowlisted anonymous reads, 60s tag expiry, 8s response-body
  deadline. Authenticated/account/order/checkout clients must stay outside it.
- `.env.local` belongs in each app. Do not print or commit secrets. A server key
  must belong to the same project as the public URL/key. Remove a blank primary
  secret variable if relying on its legacy alias (nullish-coalescing behavior).
- Cron belongs only to storefront. Monitoring and restore scripts contain legacy
  targets: read [operations](OPERATIONS.md) before running them.
- Existing browser QA scripts have different defaults and some historical
  assumptions. Inspect them before executing against real commerce data.

## Resume checklist

Use [TASKS.md](../TASKS.md) rather than archived launch blockers. The last
application release passed 45 test files / 378 tests and both builds. This is a
dated baseline, not a permanent expected count. The user-role database integration
script rolls back test writes but assumes its named owner/admin fixtures and one
initial super admin; inspect current state before rerunning it.
