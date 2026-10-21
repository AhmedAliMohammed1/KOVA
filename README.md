# KOVA Scrubs Commerce

Arabic-first Egyptian medical apparel commerce, with independently deployed Next.js storefront and administration apps and one Supabase database.

**New agent?** Read [AGENTS.md](AGENTS.md), [agent handoff](docs/AGENT_HANDOFF.md), [current project state](PROJECT_STATE.md), then the [documentation index](docs/README.md).

## Live applications

| Application | URL | Vercel project/root |
|---|---|---|
| Storefront | https://kova-green-delta.vercel.app | kova / apps/storefront |
| Admin | https://admin-two-tau-18.vercel.app | admin / apps/admin |

The current Supabase project is **khccehpehasicomumani**. The former database and old Scrub Vibe deployments are historical; do not use their keys or seed data for KOVA.

## Local setup

Use Node.js 22 or 24 and pnpm 11.25.0. Hosting uses Node 24; CI currently uses Node 22. From the repository root:

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example apps/storefront/.env.local
Copy-Item .env.example apps/admin/.env.local
```

Copy only when the destination does not already contain configuration. Edit each app's ignored file; a root .env.local does not configure both applications.

| Variable | Storefront | Admin |
|---|---|---|
| NEXT_PUBLIC_APP_URL | http://localhost:3000 | http://localhost:3001 |
| NEXT_PUBLIC_ADMIN_URL | http://localhost:3001 | optional |
| NEXT_PUBLIC_STOREFRONT_URL | optional | http://localhost:3000 |
| STOREFRONT_REVALIDATION_URL | not needed | http://localhost:3000 |
| Supabase URL/publishable key | same chosen project | same chosen project |
| STOREFRONT_REVALIDATION_SECRET | same separate server secret | same separate server secret |

Use SUPABASE_SECRET_KEY for server-only commerce/private evidence operations. Role management itself uses the authenticated session and public key. Never publish server secrets. See the complete [environment reference](docs/ENVIRONMENT.md), including OTP, payments, email and key retrieval.

Run in separate terminals:

```powershell
pnpm dev
pnpm dev:admin
```

Defaults are storefront 3000 and admin 3001. Alternative production-preview ports used during QA were 3200/3201; those are not the dev-script defaults. Set each app's URL values to match the actual port. Production preview: build first, then run `pnpm --filter @kova/storefront exec next start --port 3200` and the admin equivalent on 3201.

The storefront root opens Arabic. Explicit /en and /ar URLs remain supported. Admin / redirects to /en/admin. Sign in on the admin origin with an existing staff account; the two origins do not share host-scoped cookies. Only super admins see Users & roles.

Without valid Supabase public configuration the development adapter may show demonstration content; it does not make checkout/auth production-ready. Never enable KOVA_LOCAL_CATALOG_PREVIEW on Vercel or treat demo products as live data.

## Commands

| Command | Purpose |
|---|---|
| pnpm lint | ESLint, zero warnings |
| pnpm typecheck | Both TypeScript projects |
| pnpm test | Vitest unit/integration suite |
| pnpm build | Both independent production builds |
| pnpm build:storefront / pnpm build:admin | Build one application |
| pnpm verify:release | Lint, typecheck, tests, both builds |
| node scripts/verify-kova-workspace.mjs | Built route/action separation and contrast checks |

Browser QA lives in scripts/browser; inspect defaults/assumptions before running. [Testing](docs/TESTING.md) describes evidence and limits. Last application release: 45 files / 378 tests passed; docs-only updates do not imply a fresh application test run.

## Repository

- apps/storefront: customer routes, checkout, webhooks, cron jobs, public assets.
- apps/admin: staff routes/APIs, product/order/content operations, role management.
- packages/shared: shared source, typed contracts, design tokens and fonts.
- supabase/migrations: one schema/RLS history; do not apply separately per app.
- tests: regressions plus explicit database scripts; scripts: QA and operations.

[Architecture](docs/ARCHITECTURE.md) maps features to source. [TASKS](TASKS.md) records real remaining acceptance work, including legacy operational targets. Old material is labelled under docs/archive. Runtime configuration, stock and provider acceptance must be verified rather than inferred from a successful build.
