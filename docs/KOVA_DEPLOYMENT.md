# KOVA deployment and release

Reviewed 2026-10-22. The existing Vercel projects are deployed and accessible; older inaccessible-kovaadmin checkpoints are historical.

| App | Project | Project ID | Root | Production |
|---|---|---|---|---|
| Storefront | kova | prj_bqeOERwYomSbxsu2lRwjBkImwfha | apps/storefront | https://kova-green-delta.vercel.app |
| Admin | admin | prj_LYwK7WHAtSRkA2SIJ7GC3odCA9AD | apps/admin | https://admin-two-tau-18.vercel.app |

Team: team_Zv3m5y9WSpCNUFJJvpTZYiVq. Repository: AhmedAliMohammed1/KOVA, production branch main. Both applications use Supabase khccehpehasicomumani. Both Vercel configs use dub1; Supabase is in Ireland. Exact deployment IDs are dated facts in provider history, not constants to reuse.

## Build configuration

Next.js framework, Node 24 on hosting, pnpm 11.25.0 and the root lockfile. Allow access to workspace files outside each project root. A project's pnpm build runs its own app; root pnpm build runs both. Keep monorepo tracing/transpilation configuration in each next.config.ts. Default output is .next.

App roots own vercel.json. Storefront alone defines abandoned-cart (08:00 UTC daily) and commercial (08:30 UTC daily) jobs. Admin has no cron. The root vercel.json is legacy context, not a third deployment to enable. Schedulers on old projects must be inspected to avoid duplicate mail/stock jobs; code alone does not prove external jobs are disabled.

## Configuration and Auth

Use [ENVIRONMENT](ENVIRONMENT.md) as the canonical variable matrix. Each app needs its own NEXT_PUBLIC_APP_URL and correct cross-app origins. Same-project public Supabase values are shared; secret keys stay server-only. Cache invalidation uses an identical separate random secret in both projects and storefront origin in the admin URL setting. Configure exact /en/auth/confirm and /ar/auth/confirm allowlist entries for both origins in Supabase.

Public variables are compiled at build time; changing any app configuration requires redeployment. Leave Paymob held and explicitly configure the chosen phone-OTP policy. Preview deployments must not accidentally connect transactional tests to production or use live notification recipients.

## Release sequence

1. Inspect git status, task authorization, intended project/root/branch/environment and live migration history. Record known-good deployments for both apps.
2. Run the appropriate checks; application releases use pnpm verify:release. Docs-only changes use documentation consistency checks and do not claim a fresh application test run.
3. Review/apply compatible database migrations once, including RLS/grants and typed RPCs, before dependent code. Do not reset/reseed live data.
4. Build/verify both affected apps, configure their intended origins and callbacks, then push/promote within authorization.
5. Confirm READY deployments match the intended commit. Inspect production aliases, not just preview URLs; Vercel protection may apply differently.
6. Test Arabic default, explicit English, colour selection, sign-in callbacks, permitted/denied staff access, and fixed-scope invalidation. Use sandbox records for transaction acceptance; do not send test emails/orders without authorization.
7. Review runtime errors, health/readiness, cron ownership, proof/fulfilment queues and advisor changes. Record results/limits in project state and test report.

Storefront legacy /{locale}/admin and /api/admin paths redirect when NEXT_PUBLIC_ADMIN_URL is configured. Payment webhooks, checkout and cron remain storefront-owned. Redirects do not transfer host-scoped login cookies.

## Rollback and operations

Roll back each app independently to a compatible known-good deployment. Application rollback does not undo database migrations, media, inventory or user roles. Forward-fix schema by default; never replay stock/order mutations just to refresh cached content. Recheck cron definitions and old deployments after rollback.

[Release/rollback procedure](runbooks/RELEASE_ROLLBACK.md), [monitoring](runbooks/MONITORING.md), [backup safeguards](runbooks/BACKUP_RESTORE.md), [incident response](runbooks/INCIDENT_RESPONSE.md). The current smoke workflow still targets the legacy hostname and restore scripts only deny the old project ref; those are documented follow-up work, not completed KOVA protections.
