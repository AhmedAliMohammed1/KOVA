# Environment and key reference

Reviewed 2026-10-22. Configure apps/storefront/.env.local and apps/admin/.env.local locally; configure each Vercel project separately for its intended environment and redeploy. Never commit real env files or paste their contents into chat. [.env.example](../.env.example) lists placeholders, not verified production readiness.

## Core configuration

| Variable | App | Purpose/source |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Both | Current project URL: https://khccehpehasicomumani.supabase.co |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Both | Publishable key from that same Supabase project's API Keys settings |
| SUPABASE_SECRET_KEY | Both where privileged server operations are used | Server-only secret from the same Supabase project; required for checkout/private evidence/automation, not for the authenticated role-management RPC |
| SUPABASE_SERVICE_ROLE_KEY | Server-only compatibility alias | Alternative legacy service-role key; do not configure conflicting aliases |
| NEXT_PUBLIC_APP_URL | Each app | That app's full origin, including the actual local port |
| NEXT_PUBLIC_ADMIN_URL | Storefront | Admin origin for staff links and legacy staff redirects |
| NEXT_PUBLIC_STOREFRONT_URL | Admin | Storefront origin for return links |
| STOREFRONT_REVALIDATION_URL | Admin | Storefront origin only; helper appends /api/revalidate |
| STOREFRONT_REVALIDATION_SECRET | Both | Identical separately generated random server secret; not a Supabase or cron key |
| KOVA_LOCAL_CATALOG_PREVIEW | Storefront, local only | Explicit draft preview; requires localhost origin and is ignored on Vercel. Keep false for normal connected work |

Use SUPABASE_SECRET_KEY as the primary server setting. The client selects it with nullish coalescing: an empty string still masks SUPABASE_SERVICE_ROLE_KEY. If using the alias, remove the unused primary variable rather than leaving it empty. Do not reuse old-project keys with the new URL.

Production origins are storefront https://kova-green-delta.vercel.app and admin https://admin-two-tau-18.vercel.app. Dev defaults are 3000/3001; optional QA previews used 3200/3201. Match config to the process you actually start.

## Payments and phone verification

| Variable | Purpose/source |
|---|---|
| NEXT_PUBLIC_VODAFONE_CASH_NUMBER | Owner-approved payment destination, not an API key |
| NEXT_PUBLIC_INSTAPAY_ADDRESS | Owner-approved payment destination, not an API key |
| CHECKOUT_PHONE_OTP_ENABLED | Storefront server flag. Code/example default true; explicitly set false for the chosen OTP-free checkout |
| TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID | Twilio console and Verify Service, only when phone OTP is enabled |
| OTP_RATE_LIMIT_SALT | Separate random server salt for phone/IP rate limiting |
| CHECKOUT_TEST_OTP | Local-development-only test value; do not configure on production |
| PAYMOB_ENABLED | Keep false until [activation acceptance](../PAYMOB_ACTIVATION.md) passes |
| PAYMOB_SECRET_KEY, PAYMOB_PUBLIC_KEY, PAYMOB_HMAC_SECRET | Paymob merchant dashboard; all used by server integration despite PUBLIC in the provider's name |
| PAYMOB_INTEGRATION_ID | Merchant's allowed positive integration IDs, comma-separated |

Disabling phone OTP does not disable Egyptian phone-number validation or Supabase account email verification. Missing/invalid flag values may leave OTP enabled. Check exact variable spelling, selected Vercel environment, deployment commit and runtime after changes. A historical Vercel bulk env response contained encrypted values: do not copy such payloads as plaintext local configuration.

## Email, jobs and observability

| Variable | App/purpose/source |
|---|---|
| RESEND_API_KEY | Both apps' originating lifecycle notifications; Resend API Keys |
| RESEND_FROM_EMAIL | Verified sender in the Resend domain; provider ownership must be confirmed |
| STAFF_EMAIL | Owner-approved staff notification destination |
| CRON_SECRET | Storefront jobs and recovery-link signing fallback; separate random server value |
| OPERATIONS_SECRET | Storefront detailed readiness bearer; separate random server value |
| OPERATIONS_PROOF_REVIEW_HOURS | Default 12 |
| OPERATIONS_PAYMENT_REVIEW_HOURS | Default 24 |
| OPERATIONS_WEBHOOK_LOOKBACK_HOURS | Default 24 |
| CART_RECOVERY_ENABLED | Default true; verify sender/consent and real cron ownership before relying on it |
| CART_RECOVERY_FIRST_DELAY_HOURS, CART_RECOVERY_SECOND_DELAY_HOURS, CART_RECOVERY_DISCOUNT_DELAY_HOURS | Defaults 2 / 24 / 48 |
| CART_RECOVERY_DISCOUNT_PERCENT, CART_RECOVERY_DISCOUNT_EXPIRY_HOURS, CART_RECOVERY_BATCH_SIZE | Defaults 10 / 72 / 20 |
| NEXT_PUBLIC_SITE_URL | Optional recovery-link compatibility override; if present use the actual storefront origin |
| VERCEL_PROJECT_PRODUCTION_URL | Hosting-provided recovery origin fallback; not a manually generated key |

Supabase sign-up/recovery email is configured through Supabase Auth email/SMTP and redirect settings, separately from Resend application notification configuration. Configure both app callback origins; see [Auth](AUTH.md). SMTP provider credentials belong in Supabase settings and must not be copied into browser variables.

## Optional analytics and reserved placeholders

- NEXT_PUBLIC_GA_MEASUREMENT_ID: GA4 data-stream measurement ID.
- NEXT_PUBLIC_META_PIXEL_ID: Meta dataset/pixel ID.
- META_CONVERSIONS_API_TOKEN: server token from Meta; never public.
- META_TEST_EVENT_CODE: sandbox event testing only.
- META_GRAPH_API_VERSION: integration default v24.0; verify provider compatibility when changing.
- SENTRY_DSN, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN: reserved placeholders in the example; configuring them does not install an integration or implement distributed rate limiting.

Operation scripts additionally accept shell-only backup/restore connection variables such as SUPABASE_DB_URL, RESTORE_TARGET_DB_URL and RESTORE_TARGET_SUPABASE_URL/SECRET_KEY/PROJECT_REF. Read script parameters and [backup safeguards](runbooks/BACKUP_RESTORE.md) first. Never put connection URLs in public app variables.

## Key handling and verification

Obtain provider keys directly from the owner-managed provider console or approved secret store. Use publishable keys in browser clients only. Set variables in both projects where indicated; public values are compiled into client bundles and require a rebuild. Server configuration changes also require a fresh deployment to take effect. Inspect only names/presence or specific non-secret flags when diagnosing; never dump secrets to logs.

Missing credentials, disabled features, inventory availability and provider acceptance are different conditions. Verify the actual failing boundary rather than changing all flags or bypassing validation. [Runtime setup](KOVA_RUNTIME_SETUP.md) and [deployment](KOVA_DEPLOYMENT.md) provide the sequence.
