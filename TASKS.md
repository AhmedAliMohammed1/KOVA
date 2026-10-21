# Remaining work â€” 2026-10-22

Current implementation and verification are in [PROJECT_STATE](PROJECT_STATE.md). This list supersedes archived draft/deployment blockers.

## Completed baseline

- [x] Separate storefront/admin monorepo deployed to existing kova/admin projects.
- [x] New KOVA database schema, RLS, storage and approved active products installed.
- [x] Real photo mapping, responsive assets, shared navy/teal design and size-guide refresh.
- [x] Arabic default entry, interactive card colours and matching product selections.
- [x] Cached anonymous reads, bounded response deadlines, Dublin deployment and cross-app invalidation.
- [x] Self-hosted Arabic fonts and stable streamed-content layout.
- [x] Requested admin grants; super-admin-only role directory, mutation checks and audit.
- [x] Latest application release: 378 regressions, lint and both builds passed.
- [x] Documentation refreshed with current facts, source ownership and historical archive.

## Operational correctness before relying on automation

- [ ] Update .github/workflows/operations-smoke.yml from the legacy host to the current KOVA storefront and verify actual workflow runs.
- [ ] Extend restore-drill.ps1 and restore-storage.mjs production-target protections to cover current KOVA and legacy history; validate connection URL/ref agreement. Do not run a restore drill before this fix and independent target verification.
- [ ] Audit legacy URL fallbacks/identifiers in runtime and operation scripts; preserve intentional storage/order/payment compatibility identifiers. Do not blindly rename all scrub-vibe strings.
- [ ] Inspect current migration history before any reset/reseed. Root historical migrations/bootstrap scripts include old catalog data and are not an unattended fresh-project recipe.

- [ ] Verify/wire shared instrumentation into both app-specific Next entrypoints; source existence does not prove automatic startup/error registration.

## Commerce/provider acceptance

- [ ] Establish a disposable non-production DB, test users, private buckets and matching per-app configuration for transactions.
- [ ] Complete checkout/stock/promotion/deposit proof, replacement/rejection/approval, cancellation/retry, tracking/invoice and customer cart/address merge acceptance.
- [ ] Complete role-scoped fulfilment, inventory, returns/exchanges/refunds/restock, exports and review/moderation acceptance on test records.
- [ ] Verify Supabase Auth callbacks/email delivery and Resend verified sender/staff routing with owner-approved destinations.
- [ ] Keep Paymob disabled until signed webhook, amount/currency/integration checks and duplicate/declined/successful sandbox cases pass.
- [ ] If enabling phone OTP, verify Twilio limits, single-use tokens and rate limiting first. Current chosen setting is false.
- [ ] Verify any enabled analytics integrations and event deduplication without exposing personal data.

## Quality and business follow-up

- [ ] Obtain an official standalone vector/transparent logo and approved material/care/legal/return-policy details.
- [ ] Gather real production field vitals and database baselines; local samples are not p75/INP or a WCAG certification.
- [ ] Complete assistive-technology and 200% zoom acceptance across authenticated forms/dialogs.
- [ ] Broaden reproducible browser journeys after sandbox fixtures exist; update old script assumptions to actual stock/availability before reuse.
- [ ] Measure backup/restore and deployment rollback drills after target safeguards are corrected.
- [ ] Recheck Supabase advisors and hosting/auth plan capabilities; documented old findings are not a permanent security assessment.

Inventory and user roles remain live business data. Recheck rather than replacing them with these dated snapshots. Historical phase checklists are retained in [archive](docs/archive/README.md).
