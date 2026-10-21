# Monitoring and escalation

Reviewed 2026-10-22. Storefront: https://kova-green-delta.vercel.app; admin: https://admin-two-tau-18.vercel.app; DB: khccehpehasicomumani. [Current snapshot](../../PROJECT_STATE.md).

## Known gap

The configured hourly GitHub operations-smoke workflow still probes the legacy host. Update and verify its actual KOVA runs before treating it as current monitoring. Security/monitor definitions are not evidence that scheduled runs, email routing or alert subscriptions are healthy. Inspect old project cron schedules to avoid duplicate jobs.

## Signals and actions

| Signal | Response |
|---|---|
| Current storefront liveness/readiness repeatedly fails, checkout 5xx surge, payment inconsistency or exposure | Immediate incident triage |
| Proof age over configured threshold (default 12h), payment review over default 24h, cron/notification failures | Same-business-day operational review; do not fulfil unpaid/rejected proof orders |
| Stock alerts, non-exploited dependency advisory, isolated latency regression | Prioritized investigation with measured evidence |
| Admin role denials, role audit anomalies, private evidence/export failures | Verify actor/current roles and request boundary; preserve audit |
| Admin mutation succeeded but revalidation failed | Repair origin/secret/cache refresh without repeating the mutation |

Runtime logs should filter structured errors and relevant checkout, webhook, cron, health and staff routes. Correlate minimal request/provider identifiers, not PII or proof bodies. Supabase advisors/logs and provider dashboards supply additional evidence.

## Secrets and health

CRON_SECRET and OPERATIONS_SECRET are separate server-only random values. Public /api/health/ready is intentionally minimal; detailed output needs its bearer secret. Check readiness components rather than treating a held optional provider as the cause of every failure. Rotate disclosed secrets through the approved channel, across affected environments, and redeploy.

App cron schedules are UTC in apps/storefront/vercel.json (08:00/08:30 daily); admin has no scheduled jobs. See [operations](../OPERATIONS.md), [environment](../ENVIRONMENT.md) and [incident response](INCIDENT_RESPONSE.md).
