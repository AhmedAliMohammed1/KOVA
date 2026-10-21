# New KOVA Supabase project

Owner-selected project: `khccehpehasicomumani`, URL `https://khccehpehasicomumani.supabase.co`. It was empty before this installation. It now has 45 application tables with RLS, the existing commerce RPCs, shipping data for 27 governorates, and four buckets: public `product-media`/`banners`, private `payment-proofs`/`return-evidence`.

Only the approved KOVA catalog was added: women's product ID 2 (grey/blue/burgundy, 50 images) and men's product ID 3 (black, 13 images), EGP 850 each with EGP 200 COD deposits. Both are drafts, with no size variants or fabricated stock. Product media URLs point to the optimized files in both app deployments. Seven still-life/water frames are excluded.

## Administrator

The owner-approved administrator email is stored in `private.admin_bootstrap`, not in source. Register using that email in the new project and confirm the verification email, then sign in at the admin app's `/en/admin` or `/ar/admin`. A private trigger grants the `admin` role once, only after the approved email is verified. No password or actual Auth user was created. The pending approval remains unclaimed. A rollback-only test verified that unconfirmed users do not get admin and the confirmed approved owner does. The private table/function are inaccessible to anonymous and ordinary authenticated API callers.

Configure Supabase Authentication URL settings: the actual storefront Site URL, and allowed storefront/admin locale-specific `/auth/confirm` callbacks. Use the actual production origins; add local callbacks separately when testing. Auth verification/recovery emails use Supabase's own email configuration. Existing accounts in the former project were not copied here.

## Hosted application configuration

Both local apps already use this new URL and matching publishable key in ignored `.env.local` files. Both Vercel projects must also receive this project's URL, publishable key and server secret, followed by a redeploy. The former project's server secret cannot be reused. Hosted environment values were not modified by this database task. See `KOVA_RUNTIME_SETUP.md` for the rest of the settings.

The old database, its users, 19 orders and historical product references remain untouched. This was a fresh installation, not a user/order/storage transfer. No legacy merchandising bundles or Scrub Vibe product seeds were imported.

## Bootstrap sources and migration history

The schema was applied in chronological order using the existing migrations, omitting the two obsolete catalog seeds. Safer KOVA-specific sources under `scripts/operations/kova-bootstrap/` replace the legacy merchandising seed and product management migrations. Product removal archives; it does not delete history. Product editing starts newly added variants at zero stock. The newer catalog, bootstrap and product-contract migrations are recorded under `supabase/migrations/`.

`qa/new-database-bootstrap.json` records the applied source mappings and actual remote migration history. MCP assigns remote timestamps. Before a future CLI `db push`, reconcile source names and history using that ledger; do not blindly replay historical seeds. The ledger deliberately records the schema-only and archive-only alternatives.

## Verification

- `qa/new-database-verification.json`: table/RLS/bucket checks and zero-stock/archive/admin rollback tests.
- `qa/new-database-public-api.json`: actual publishable-key REST checks, draft visibility, shipping data, denied anonymous mutation and order access.
- `qa/connected-browser-results.json`: English/Arabic forms, invalid-credential Auth round trip, wishlist persistence, admin redirect and size-guide interactions against the local connected apps.
- `scripts/operations/kova-bootstrap/verify-security-rollback.sql`: synthetic identity and product-edit tests, fully rolled back; no test user or stock remains.
- 350 regression tests across 40 files, lint and both independent builds passed. No live order or email was submitted.

Advisor warnings remain for intentionally exposed validated newsletter/analytics RPCs and authenticated RPCs with internal role/ownership checks. OTP tables intentionally have no client policies because they are server-only. These notices are recorded in `qa/new-database-security-advisors.json`; this setup does not claim an absence of advisories. [Supabase function-exposure guidance](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable).
