# Project state â€” verified 2026-10-22

Read this dated snapshot together with the [agent handoff](docs/AGENT_HANDOFF.md). Recheck mutable live data before changing it.

## Current deployment

| Item | Verified value |
|---|---|
| Repository | AhmedAliMohammed1/KOVA; main |
| Last application release | c0a2b234f9297d3bbf9d397c2b8f2cfbadc6fc06 |
| Storefront | https://kova-green-delta.vercel.app; Vercel project kova; root apps/storefront |
| Admin | https://admin-two-tau-18.vercel.app; Vercel project admin; root apps/admin |
| Supabase | khccehpehasicomumani; Ireland eu-west-1 |
| Vercel functions | dub1 for both apps |
| Runtime | Next 16.3.3, React 19.2, TypeScript 5.9, Tailwind 4.1; pnpm 11.25.0 |

Both application deployments for c0a2b23 were READY. Publishing source alone does not verify a future deployment. Do not create a replacement Vercel project merely because the legacy kovaadmin name is inaccessible.

## Current behavior

- Storefront / redirects to /ar; /en remains English. Arabic UI uses self-hosted Noto Sans Arabic and Noto Naskh Arabic, with RTL spacing and upright headings.
- Home/shop/shared product-card swatches change the card photograph and link to the corresponding product colour through ?colour=code.
- Anonymous catalog/CMS/sizing/review reads use a 60-second allowlisted cache and eight-second complete-response deadline. Private clients stay uncached. Admin changes invalidate public data through a bearer-protected fixed-scope endpoint.
- Active women's product ID 2: kova-womens-scrub-set, grey/blue/burgundy, 50 mapped photos. Live snapshot: 18 variants.
- Active men's product ID 3: kova-mens-scrub-set, black, 13 mapped photos. Live snapshot: 6 variants.
- Both base prices are EGP 850 (85000 minor units); approved COD deposit EGP 200 (20000). Do not invent or overwrite owner-maintained sizes/stock.
- 70 unique source photographs were reviewed; optimized derivatives exist in both apps. Seven water/still-life frames are excluded from published product galleries; imagery does not substantiate fabric claims.
- Four storage buckets: public product-media/banners; private payment-proofs/return-evidence. Public application tables have RLS enabled.

## Identity and administration

- ahmedelsaify213@gmail.com: verified account with customer, admin, super_admin.
- mslammohamed51@gmail.com: verified account with customer, admin.
- Super admins alone see /{locale}/admin/users and can grant/revoke staff roles. Page, action and private database function enforce permission independently. Self-super-admin removal and last-super-admin removal are blocked; changes are audited.
- The one-time initial admin bootstrap has already been claimed. Do not recreate accounts or assign a password. Use existing sign-in/recovery and the super-admin page for routine access changes.
- Roles are relational user_roles data, not editable user metadata. Existing sessions recheck roles on subsequent protected requests; refresh old navigation after access changes.

## Configuration baseline and limits

Both deployed apps use the new database. The chosen checkout setting was CHECKOUT_PHONE_OTP_ENABLED=false; code/example default is true, so explicit configuration and redeployment matter. Phone syntax validation and Supabase email verification remain independent. Paymob remains held pending provider acceptance. Provider secrets/SMTP/sender state must be inspected securely before transactional testing; a configured variable is not evidence of successful delivery or payment acceptance.

The legacy database iqufqtjotgpmhhtvlxwf and its historical orders/users remain separate. Earlier KOVA drafts 20/21 and nine archived legacy products refer to the old database, not current IDs 2/3. Accounts/orders were not copied between projects.

## Verification and next work

Last application release: 45 test files / 378 passing tests, lint and both production builds passed. Authenticated owner browser checks covered Arabic/English role directory, correct role badges, mobile/landscape reflow, confirmation wording, search recovery, self-demotion prevention and focus restoration. Grant/revoke/denial/audit database tests ran inside a rolled-back transaction. Payment/order/return sandbox acceptance and field performance remain separate gaps.

Actual operations gaps found during the documentation audit: the hourly smoke workflow still targets the legacy hostname; restore scripts hardcode only the old production ref as a deny target. Treat both databases as protected production/history and fix those safeguards before restore use. Shared instrumentation also has no discovered app-local entrypoint; verify wiring before claiming automatic runtime coverage. See [TASKS](TASKS.md) and [operations](docs/OPERATIONS.md).
