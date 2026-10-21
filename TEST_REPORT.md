# Verification baseline â€” 2026-10-22

Last application release: c0a2b23. This documentation refresh changes documentation only; it does not claim a new runtime test run.

| Scope | Evidence |
|---|---|
| Automated suite | 45 files / 378 tests passed |
| Lint | Zero-warning ESLint passed |
| TypeScript/build | Both independent production builds passed, including strict type checks |
| User-role database boundaries | Authenticated super-admin search/grant/revoke/idempotency, regular-admin/non-staff/absent-identity rejection, last/self-super-admin guards, customer-role protection and audit tested; transaction rolled back |
| Authenticated live admin UI | Arabic/English directory, real role badges, empty search, 375px dialog, landscape reflow, cancel/focus restoration, self-demotion disabled |
| Storefront release before roles | Arabic default, colour-specific card/product gallery flow, responsive typography, same-origin fonts and loading stability checked |
| Hosting | Both production deployments for c0a2b23 READY |

Current evidence includes docs/qa/user-roles-live-results.json and screenshots (workspace-generated artifacts may be uncommitted), docs/qa/arabic-typography-results.json, docs/qa/language-colour-results.json and the loading evidence described in [performance notes](docs/KOVA_LOADING_FIX.md). Each file's origin/date matters. Older JSON and test totals remain historical.

## Not established by this baseline

Full provider-backed order/payment/return acceptance, successful email delivery to every destination, authenticated assistive-technology coverage, production field p75/INP, backup restoration, and production-scale DB capacity are not implied by passing tests or a READY deployment. See [TASKS](TASKS.md).

The role-management SQL test uses specifically named owner/admin fixtures and expects one initial super admin. Inspect current state before reuse; do not alter real access to satisfy fixture assumptions.

## Documentation audit

Checked current application roots/scripts/configuration against maintained docs, verified active product/variant and bucket/RLS facts using read-only Supabase queries, and verified current Vercel project/root ownership. Local Markdown links and source references are checked separately during this update. Historical verification was preserved in [archive](docs/archive/README.md).
