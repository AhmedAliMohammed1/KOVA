# KOVA Scrubs Commerce

Bilingual Egyptian medical apparel commerce with independently built Next.js storefront and admin applications, shared TypeScript commerce code and design tokens, and one authoritative Supabase database.

## Start locally

Use Node.js 22/24 and pnpm 11.25.0. Run `pnpm install --frozen-lockfile` at the repository root. Copy `.env.example` into each application's `.env.local` and configure values directly in those local files.

- `apps/storefront/.env.local`: `NEXT_PUBLIC_APP_URL=http://localhost:3000`, `NEXT_PUBLIC_ADMIN_URL=http://localhost:3001` for local admin links.
- `apps/admin/.env.local`: `NEXT_PUBLIC_APP_URL=http://localhost:3001`, `NEXT_PUBLIC_STOREFRONT_URL=http://localhost:3000`.
- Both use the same database URL and publishable key. Secrets stay server-only. Use a non-production database for transaction testing.

Run `pnpm dev` and, in another terminal, `pnpm dev:admin`. The storefront is on port 3000 and administration is on port 3001. Without database credentials, the development catalog remains browsable; checkout and account services show recoverable unavailable states. This is a preview mode, not a production commerce configuration.

## Commands

| Command | Purpose |
|---|---|
| `pnpm lint` | Workspace ESLint, zero warnings |
| `pnpm typecheck` | Both application TypeScript checks |
| `pnpm test` | Commerce/security/unit regression suite |
| `pnpm build` | Both independent production builds |
| `pnpm build:storefront` / `pnpm build:admin` | Build one application |
| `node scripts/verify-kova-workspace.mjs` | Verify built route/action separation and token contrast |
| `node scripts/browser/kova-smoke.cjs` | Browser QA; requires Playwright (bundled runtime can be used through NODE_PATH) |
| `node scripts/browser/kova-performance.cjs` | Reproducible production navigation lab samples |

## Repository

- `apps/storefront`: customer routes, checkout, payment webhook, cron jobs, public media and marketing.
- `apps/admin`: staff routes, admin APIs and supporting mutations/repositories/forms.
- `packages/shared/src`: reusable components, types, validation, database clients and customer commerce.
- `packages/shared/tokens.css`: semantic palette shared by both applications.
- `supabase`: single migration/RLS source; no database migration is introduced by this redesign.

Read [delivery status](docs/KOVA_DELIVERY.md), [deployment and rollback](docs/KOVA_DEPLOYMENT.md), [route coverage](docs/KOVA_ROUTE_COVERAGE.md), [design system](design-system/kova/MASTER.md) and [asset mapping notes](docs/KOVA_ASSETS.md). Historical implementation and operational runbooks remain available. Do not activate Paymob before its existing acceptance checklist passes.

The requested kovaadmin Vercel project is not accessible through the connected account in this session. Production routing was not changed. Sandbox transactions, authenticated staff acceptance, confirmed sizes/stock and policy sign-off remain required before launch.

The current local preview uses ports 3200/3201. Its ignored app environment files restore the public Supabase connection. `KOVA_LOCAL_CATALOG_PREVIEW=true` in the storefront explicitly shows approved drafts only on localhost; it is ignored on Vercel. Buying still awaits confirmed sizes/stock. The local server secret must be restored separately for privileged commerce operations. Run `node scripts/browser/kova-connected-smoke.cjs` to check connected interactions without creating accounts, orders or emails.
