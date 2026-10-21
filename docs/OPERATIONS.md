# KOVA operations

Reviewed 2026-10-22. Actual targets are in [PROJECT_STATE](../PROJECT_STATE.md); hosting/configuration in [deployment](KOVA_DEPLOYMENT.md) and [environment](ENVIRONMENT.md).

## Current automation gaps

The hourly .github/workflows/operations-smoke.yml still calls the legacy scrub-vibe-tau.vercel.app hostname. Its presence does not demonstrate monitoring of KOVA. scripts/operations/restore-drill.ps1 and restore-storage.mjs deny the legacy project ref but do not yet automatically deny khccehpehasicomumani. Never target either database for a drill; independently verify URL/ref and fix those guards before using restore scripts. These code follow-ups are in [TASKS](../TASKS.md); this documentation update does not claim to fix runtime scripts.

## Runtime signals

- Storefront /api/health/live is dependency-free; /api/health/ready checks configuration and Supabase connectivity. Readiness's public response is minimal; OPERATIONS_SECRET unlocks protected detail. An optional-provider warning differs from a core failure.
- Shared instrumentation source exists at packages/shared/src/instrumentation.ts, but no app-local instrumentation entrypoint was found in this audit. Verify/wire Next registration before claiming startup/uncaught-error coverage; explicit operational logger calls are a separate mechanism.
- Storefront alone owns /api/cron/abandoned-cart and /api/cron/commercial; app vercel.json defines daily UTC schedules. Cron requires CRON_SECRET. Verify external old-project jobs are not duplicating work.
- Admin queues expose proof/payment/fulfilment/returns/review and inventory work according to current roles. Super admins manage staff access.

## Operator routines

Daily: check actual KOVA liveness/readiness and errors, job history, stale proof/payment queues, reservation/stock alerts, notification failures and invalidation failures. Weekly: review security workflow results and current Supabase advisors, verify encrypted DB plus Storage backups, review staff access and reconcile active payment providers.

Initial service objectives are operational targets, not measured SLAs: 99.9% monthly availability, checkout error rate below 1% over 15 minutes, proof review within 12 hours, payment review within 24 hours, critical acknowledgement within 15 minutes, 24-hour logical-backup RPO and four-hour recovery target. Validate actual retention, plan capabilities, staffing and measured drills before promising these externally.

Do not log customer data, connection strings, tokens or proof images. Do not replay successful stock/order mutations to retry email or cache refresh. Follow [monitoring](runbooks/MONITORING.md), [release/rollback](runbooks/RELEASE_ROLLBACK.md), [backup/restore](runbooks/BACKUP_RESTORE.md) and [incident response](runbooks/INCIDENT_RESPONSE.md).
