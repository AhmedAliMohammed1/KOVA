# Runtime configuration and admin access

The repository contains two independently deployed applications. Configure Vercel root directories as `apps/storefront` and `apps/admin`, enabling access to workspace files outside each root. Pushing source does not configure either project's environment or root directory. Both applications use the owner-selected Supabase project `khccehpehasicomumani`.

## Required for the store and dashboard

| Variable | Purpose | Where |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Existing Supabase project URL | Both apps |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public browser/API key | Both apps |
| `SUPABASE_SECRET_KEY` | Server access for privileged commerce operations; existing service-role key alias also supported | Both apps, server only |
| `NEXT_PUBLIC_APP_URL` | Actual origin of that application, including its port locally | Each app's own origin |
| `NEXT_PUBLIC_ADMIN_URL` | Staff links and redirects from former storefront admin routes | Storefront, admin origin |
| `NEXT_PUBLIC_STOREFRONT_URL` | Return-to-store links | Admin, storefront origin |
| `STOREFRONT_REVALIDATION_URL` | Target storefront origin for cache refresh after staff edits | Admin |
| `STOREFRONT_REVALIDATION_SECRET` | Same separately generated random secret for authenticated cache refresh | Both apps, server only |

For local work, put these in `apps/storefront/.env.local` and `apps/admin/.env.local`. Those files are ignored by Git. For hosting, configure each Vercel project's environment settings and redeploy. Public variables are embedded at build time. Keep server secrets out of `NEXT_PUBLIC_*` variables. The public connection is restored locally; the server secret is still missing. Vercel marks the existing server secret sensitive and does not return its value. Obtain it securely from the owner-managed Supabase API Keys settings or existing secret store; do not paste it into chat.

## Payments, email and background jobs

| Feature | Variables |
|---|---|
| Vodafone Cash / InstaPay proof payments and COD deposit destinations | Storefront: `NEXT_PUBLIC_VODAFONE_CASH_NUMBER`, `NEXT_PUBLIC_INSTAPAY_ADDRESS`; these are payment destination details, not API keys |
| Order/staff emails | Both apps: `RESEND_API_KEY`, `RESEND_FROM_EMAIL` with a verified sender, `STAFF_EMAIL`. Supabase Auth handles sign-up/recovery email separately through its Auth email/SMTP configuration. |
| Scheduled jobs | Storefront: `CRON_SECRET`; `OPERATIONS_SECRET` protects detailed readiness output |
| Phone verification, when enabled | Storefront: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID`; set `OTP_RATE_LIMIT_SALT` to a separate random secret. If phone verification is not required, explicitly set `CHECKOUT_PHONE_OTP_ENABLED=false`. |
| Optional Paymob card payments | Storefront: `PAYMOB_SECRET_KEY`, `PAYMOB_PUBLIC_KEY`, `PAYMOB_HMAC_SECRET`, `PAYMOB_INTEGRATION_ID`. Keep `PAYMOB_ENABLED=false` until the existing activation checklist passes. |
| Optional analytics | `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`; server Meta reporting also uses `META_CONVERSIONS_API_TOKEN`. |

Other `.env.example` settings tune features; Sentry/Upstash entries are reserved placeholders and do not currently make core commerce work. Never enable a test OTP in production. Provider credentials alone do not complete provider acceptance or establish approved inventory.

## Access the admin dashboard

The running local production preview uses storefront `http://localhost:3200` and admin `http://localhost:3201`. Open `http://localhost:3201/en/admin` or `/ar/admin`. Guests are redirected to the admin app's `/en/account` or `/ar/account` staff sign-in. Sign in with an existing Supabase staff account. Roles are checked on the server; the main dashboard requires `admin` or `super_admin`. Other existing staff roles retain access to the operations they are authorized to use.

The storefront's `/en/admin` and `/ar/admin` routes redirect to the configured admin origin. The header/footer staff link is shown to authorized viewers. The usual development commands still use ports 3000 (`pnpm dev`) and 3001 (`pnpm dev:admin`); update each app's URL settings to match if switching to those ports.

In production, use the actual admin deployment origin followed by `/en/admin` or `/ar/admin`. No KOVA admin production URL has been verified or deployed by this work. Configure Supabase Auth redirect allowlists for both actual app origins and their locale-specific `/auth/confirm` callbacks. Existing accounts and roles are preserved; no new administrator password was created.

## Catalog prerequisite

The legacy products and commerce history remain in the original database; they were not copied to this fresh KOVA project. New KOVA products 2/3 remain drafts at EGP 850 each, with EGP 200 COD deposits, until sizes and stock are confirmed and assets are deployed. Keys do not replace inventory. `KOVA_LOCAL_CATALOG_PREVIEW=true` only allows reviewing the approved drafts on localhost; it is ignored on Vercel. No purchased stock or product variants are fabricated.

See `KOVA_DEPLOYMENT.md` for deployment, provider acceptance and rollback, and `qa/connected-browser-results.json` for exactly which connected interactions were verified.

The owner selected the new project on 2026-10-21. Both local apps now use its matching URL/publishable key. Existing Vercel environment variables have not been changed: replace the URL, publishable key and server secret in BOTH projects with matching values from this new project, then redeploy. An old project's secret is not valid for the new URL. Configure Auth Site URL and allowed locale-specific `/auth/confirm` callbacks for the actual storefront and admin origins. The private one-time admin approval requires ownership of the email explicitly supplied by the owner and a confirmed email; no password or account was created by this setup.
