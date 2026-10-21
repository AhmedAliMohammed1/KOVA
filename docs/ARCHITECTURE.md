# Architecture

Reviewed 2026-10-22. Two Next.js 16.3.3 App Router applications share React 19/TypeScript source and one Supabase database. [Agent handoff](AGENT_HANDOFF.md) and [project state](../PROJECT_STATE.md) establish current targets.

## Workspace boundaries

| Location | Responsibility |
|---|---|
| apps/storefront/src/app | Localized public/customer pages, checkout APIs, Auth callbacks, Paymob webhook, health, cron, merchant feed, revalidation |
| apps/admin/src/app | Staff sign-in/callbacks, dashboard routes, exports and protected evidence APIs |
| apps/admin/src/features | Staff product, inventory, order, return, promotion, shipping, sizing, CMS, review and role mutations/forms |
| packages/shared/src/components | Shared UI, product cards, cart provider, navigation, dialogs, analytics |
| packages/shared/src/features | Customer commerce, domain validation, repository contracts, auth, payments and notifications |
| packages/shared/src/lib | Typed Supabase clients, catalog adapter selection, money, locale/URL helpers, cache transport |
| packages/shared/src/server/catalog | Supabase catalog repository implementation |
| packages/shared/src/server/auth | Database-backed role policy and server guards |
| packages/shared/src/types/database.ts | Database/RPC TypeScript contract |
| packages/shared/tokens.css and src/fonts | Shared palette and licensed Arabic fonts |
| supabase/migrations | Single schema, RLS, grants and RPC history |

Both app tsconfigs resolve @/* to app-owned source before shared source. Both Next configs set the workspace tracing/Turbopack root and transpile @kova/shared. Do not introduce imports from one application's routes into the other or duplicate database migrations per deployment.

## Read path

Storefront route -> catalog/domain repository -> anonymous public Supabase HTTP client -> RLS-filtered normalized data -> localized server-rendered content. Small-catalog filtering remains application-side; it is not DB-side search pagination. The explicit no-credentials development catalog is a preview adapter, not a fail-open production store.

The anonymous client alone uses allowlisted GET/HEAD caching: 60-second revalidation, kova-public-storefront tag, eight-second deadline through response-body completion. Authenticated session, role, order and checkout data use different clients and remain outside this cache. See [loading](KOVA_LOADING_FIX.md).

## Mutation and authorization path

Customer/staff form -> validated server action or Route Handler -> current user/role check -> typed Supabase RPC/row operation -> database constraints/RLS/transaction -> explicit pending/success/error feedback. Browser visibility is never sufficient permission. Supabase server secret clients are used only for privileged server-side commerce/evidence/provider work.

Product/inventory/content edits are owned by admin. Its revalidation helper posts to the storefront's bearer-protected /api/revalidate; both use the same separate server secret. A cache refresh failure must not cause a stock/order mutation to be replayed.

Super-admin role updates additionally run through public security-invoker wrappers and private guarded functions, with serialized changes and private audit storage. [User-role details](KOVA_USER_ROLES.md).

## Commerce flow

Variant/colour selection -> persisted bag -> server-priced shipping/promotions/deposit -> atomic stock reservation/order snapshot -> manual private proof or held Paymob integration -> role-scoped review/fulfilment -> tracking/invoice/return/review. Money uses integer EGP piastres; orders preserve historical snapshots. Payment redirects and client events cannot mark orders paid.

Storefront alone owns both scheduled jobs and the Paymob callback. Administration owns proof review, fulfilment and staff exports. Auth cookies are host-scoped; users may sign in separately on both apps. / redirects to Arabic only on storefront; admin / redirects to /en/admin.

## Extending the project

Read the relevant installed Next docs, identify the owning app, preserve contracts and privacy, add appropriate tests, and update [ADRs](../DECISIONS.md), [route inventory](KOVA_ROUTE_COVERAGE.md) and feature docs when boundaries change. Remaining provider/operations acceptance is in [TASKS](../TASKS.md).
