# KOVA two-application deployment and operations

## Repository and build settings

| Application | Vercel root directory | Build command | Development |
|---|---|---|---|
| Storefront | `apps/storefront` | `pnpm build` in that project directory | root `pnpm dev`, port 3000 |
| Admin (requested existing project: `kovaadmin`) | `apps/admin` | `pnpm build` in that project directory | root `pnpm dev:admin`, port 3001 |

Enable access to files outside each Vercel root directory. Workspace installation runs from the repository lockfile. Framework: Next.js; default `.next` output; Node.js 22 or 24, pnpm 11.25.0. Root `pnpm build` deliberately builds both apps; per-project Vercel builds run only that application's script. Root `pnpm typecheck` checks both; root lint and tests cover the workspace. Each Next configuration sets the monorepo tracing/Turbopack root explicitly.

`packages/shared/src` owns common design components, validation, money, types, database clients, customer commerce and notifications. `packages/shared/tokens.css` is the palette source. All dashboard pages, admin APIs, product management, CMS mutations, moderation, shipping/discount mutations, inventory/order/return operations and cross-project invalidation live under `apps/admin/src`. Apps do not import each other's routes. Legacy local product photos are included in both public directories so existing database paths also render in staff previews; newly uploaded media uses the existing Supabase infrastructure.

## Verified external state and blockers (2026-10-21)

The supplied management URL was queried in its supplied team slug. `get_project(kovaadmin)` returned 404. Team discovery confirmed `team_Zv3m5y9WSpCNUFJJvpTZYiVq`; scoped project listing returned zero projects, both with and without a KOVA name filter. This does not establish that the project does not exist; it establishes that this connection cannot currently inspect it. No deployment domain is guessed and no production project, routing, environment, callback allowlist or domain was changed. Reconnect Vercel with access to the requested project before applying the settings above.

The original database `iqufqtjotgpmhhtvlxwf` remains the authoritative existing commerce source. The owner-authorized catalog cutover archived nine legacy products and created KOVA draft products 20 and 21, preserving 19 orders, 22 linked items and one review. Both drafts have EGP 850 prices and EGP 200 COD deposits, 50/13 photos respectively, and no invented size variants or stock. Deploy the new local image assets in both applications before publishing after inventory confirmation. Another accessible Supabase project is named KOVA (`khccehpehasicomumani`); this redesign does not switch to it, copy records or change migrations. Both app environments must point to the same original project unless a separately reviewed data migration is performed.

## Environment ownership

Copy `.env.example` to each application's `.env.local` for local work; a root environment file is not loaded automatically by both apps. Configure production/preview values in Vercel, not source control. Do not paste credentials into chat or commit downloaded Vercel environment files.

| Setting | Storefront | Admin |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | This storefront's actual origin | This admin's actual origin; auth callbacks stay here |
| `NEXT_PUBLIC_ADMIN_URL` | Verified admin origin; enables legacy page/API redirects | Optional |
| `NEXT_PUBLIC_STOREFRONT_URL` | Own storefront origin | Verified storefront origin for View store links |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Same authoritative database | Same authoritative database |
| `SUPABASE_SECRET_KEY` or existing service-role alias | Server-only commerce/webhook/automation | Server-only operations and private evidence |
| `STOREFRONT_REVALIDATION_SECRET` | Receives authenticated invalidation | Same server-only secret; separate from Supabase/cron keys |
| `STOREFRONT_REVALIDATION_URL` | Not needed | Verified storefront origin |
| Resend key, verified sender, staff destination | Checkout and scheduled notifications | Existing order/return lifecycle notifications |
| Payment destinations, Paymob and Twilio settings | Checkout owner only | Readiness display only where needed; keep Paymob disabled |
| `CRON_SECRET`, `OPERATIONS_SECRET` | Scheduled jobs and readiness owner | Do not schedule duplicate jobs |
| GA/Meta credentials | Optional marketing owner | Do not install storefront marketing scripts |

Preview environments need a non-production Supabase project and sandbox provider values. Do not clone production secrets into untrusted previews. A separate domain does not create an authorization boundary: every page/API/action continues checking roles and the existing RLS/RPC policies remain authoritative. Cookies are host-local; staff signs in again on the admin domain. Add only the actual production and trusted preview auth callback/recovery URLs to Supabase's allowlist. No wildcard domain cookie or browser cross-origin API access is required.

## Synchronization and database behavior

Admin mutations retain local invalidation and additionally schedule a server-to-server POST to the storefront `/api/revalidate` endpoint. This endpoint fails closed without its own secret, uses a timing-safe bearer comparison, accepts no arbitrary paths, invalidates the fixed public locale tree/feed/sitemap, and exposes no CORS permission. The endpoint's credentials and fixed scope have automated regression tests.

Inventory, reservations, current prices, discounts and checkout remain database-authoritative and uncached as before. No direct Postgres connection or new pool is introduced: clients keep using Supabase HTTP APIs/RPC. The split changes deployment ownership, not database workload. No reduction in query duration or connection counts is claimed. The existing catalog adapter still retrieves the complete small catalog for filtering; server-side query pagination is a future scaling task, not an optimization claimed here.

If invalidation fails after a successful database mutation, the admin server logs `[kova] Storefront revalidation failed` or `unavailable`. Confirm the record, correct the URL/secret, and retry the fixed endpoint from an authenticated operator environment. Do not repeat inventory adjustments or order mutations just to invalidate a cache. Public pages are currently dynamic; the explicit hook also protects future cached catalog/content changes. Existing private account/order pages are not publicly cached.

## Single operational owner

| Responsibility | Owner |
|---|---|
| Supabase schema, RLS, migration history, backups | Root `supabase/` and existing operator process; deploy once |
| Payment webhooks, checkout, OTP, proof submission/replacement | Storefront |
| Daily abandoned-cart and commercial cron jobs | Storefront `vercel.json` only |
| Storefront analytics, merchant feed, sitemap, stock subscriptions | Storefront |
| Proof review, order/fulfillment actions, private staff evidence, exports | Admin |
| Product/inventory/content/shipping/discount/size/review management | Admin |
| Transaction emails | Application performing the originating action; no duplicate scheduler |

## Deployment sequence and acceptance

1. Verify access and actual domains on the existing storefront and `kovaadmin` projects. Record previous deployments and root/build/env settings for rollback.
2. Configure both roots and environment scopes. Configure exact auth callbacks and server-only revalidation credentials. Keep production routing unchanged.
3. Deploy both to previews against the same non-production database. Run lint, typecheck, all regression tests and both production builds.
4. Run guest and authenticated discovery → variant → cart/merge → checkout → confirmation tests with sandbox accounts. Check pending/approved/rejected/replacement proof, cancellation/retry, invoices, tracking, returns and reviews. Check authorized and unauthorized staff roles, uploads, edit/save, stock and order transitions, and CSV exports. Verify resulting records, not only toast messages.
5. Change a sandbox product price/stock/content in admin; confirm authoritative checkout, storefront refresh and invalidation logs. Test wrong-secret rejection. Verify lifecycle emails link to the intended storefront/carrier and auth emails remain on their originating app.
6. Promote the verified admin deployment first. Only then set the verified `NEXT_PUBLIC_ADMIN_URL` on the storefront, rebuild and test old `/{locale}/admin/...` and `/api/admin/...` redirects. These are temporary 307 redirects and preserve query parameters. Old API bookmarks may require a new staff login on the admin host. Do not redirect payment webhooks or cron paths.
7. Promote storefront and inspect health/readiness, callback and invalidation logs, duplicate scheduled jobs, page errors, proof queues, revenue event deduplication and database advisors. Record a release checkpoint.

These external steps were not executed because project access and sandbox account/provider configuration are unavailable in this session. Existing dormant Paymob remains dormant. Business policy sign-off, actual garment associations and sender-domain verification remain launch requirements.

## Monitoring and rollback

Monitor storefront health/readiness and existing cron smoke workflows; monitor admin errors, proof review queues, role-denial responses, export failures and cache invalidation failures. Follow the existing backup/restore and incident runbooks. Log only IDs/statuses, not payment screenshots, phone numbers, auth tokens or credentials.

Keep the last known-good monolithic deployment and both new deployments recorded. If the split fails acceptance, restore the previous storefront deployment and previous root/build settings; remove the new admin redirect environment value and rebuild if necessary. Restore the prior admin deployment separately. No schema migration is part of this redesign, so application rollback does not require database rollback. Confirm cron ownership after any rollback and never run both old and new schedulers concurrently. Stop new mutations while diagnosing inconsistent state; reconcile records before replaying actions.
