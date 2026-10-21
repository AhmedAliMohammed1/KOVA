# Release and rollback

Reviewed 2026-10-22. The existing kova and admin projects are separate deployments using one database. [Current targets](../../PROJECT_STATE.md), [deployment guide](../KOVA_DEPLOYMENT.md).

## Gate and release

1. Inspect branch/diff, preserve unrelated changes, confirm user scope and exact app/project/environment. Record compatible known-good deployments and current migration state.
2. Application changes: use the pinned lockfile and pnpm verify:release. Documentation-only changes: check links, source/config references and stale facts; do not claim a new runtime suite run.
3. Review migrations/RLS/grants/types and apply additive changes once before dependent apps. Never reset/reseed live products, roles or commerce history.
4. Test affected English/Arabic/mobile/access/error journeys. Transactions/providers require known sandbox fixtures and destinations.
5. Configure exact origins, callbacks, public/server variables and revalidation secrets. Keep feature holds unless acceptance authorizes activation.
6. Push/promote within user authorization. Verify READY state, matching commit and production aliases on both affected projects; push output alone is insufficient.
7. Inspect runtime/health, invalidation, cron ownership, payment/proof queues and advisor changes; record actual tests and limits.

## Application rollback

Restore a known-good compatible deployment separately for each app. Check root/build/env settings and schema compatibility; a prior monolith is historical, not the automatic rollback target. Code rollback does not reverse migrations, uploaded media, user roles, inventory, payment records or every cron setting.

Verify current-host health/readiness, Arabic default, explicit English, catalog/colour/cart, auth callbacks and permitted/denied staff access. Recheck schedules on both current and old projects; do not enable duplicate recovery/stock jobs.

## Database and payment policy

Prefer additive forward fixes to destructive down migrations. A production restore needs explicit incident authorization, verified backup/target/timestamp and the [backup procedure](BACKUP_RESTORE.md). Current restore scripts have an unresolved target-guard gap; do not run drills against either production/history database.

Emergency Paymob hold: set PAYMOB_ENABLED=false in storefront and redeploy. Preserve callbacks/audit and reconcile transactions; never infer paid status from a redirect or repeat successful orders to recover email/cache failures. Manual methods require healthy staff review queues before continued use.
