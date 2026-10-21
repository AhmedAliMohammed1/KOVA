# Documentation index

Reviewed 2026-10-22. Start with [agent handoff](AGENT_HANDOFF.md).

## Authority and navigation

| Need | Canonical reference |
|---|---|
| Agent rules | [root AGENTS](../AGENTS.md), app-specific AGENTS files |
| Install/run commands | [root README](../README.md) |
| Verified current facts | [PROJECT_STATE](../PROJECT_STATE.md) |
| Next work and acceptance gaps | [TASKS](../TASKS.md), [implementation plan](../IMPLEMENTATION_PLAN.md) |
| Feature ownership and data flow | [architecture](ARCHITECTURE.md) |
| Variables, flags and key ownership | [environment](ENVIRONMENT.md), [.env.example](../.env.example) |
| Hosting/root directories/releases | [deployment](KOVA_DEPLOYMENT.md) |
| Database/schema/bootstrap | [database](DATABASE.md), [setup](KOVA_DATABASE_SETUP.md) |
| Sessions and permissions | [auth](AUTH.md), [admin](ADMIN.md), [user roles](KOVA_USER_ROLES.md) |
| Payments and OTP | [payments](PAYMENTS.md), [Paymob activation](../PAYMOB_ACTIVATION.md) |
| Security and operations | [security](SECURITY.md), [operations](OPERATIONS.md), [runbooks](runbooks/RELEASE_ROLLBACK.md) |
| Tests and evidence | [testing](TESTING.md), [test report](../TEST_REPORT.md), [route inventory](KOVA_ROUTE_COVERAGE.md) |
| Product/brand | [product](../PRODUCT.md), [design](../DESIGN.md), [KOVA master](../design-system/kova/MASTER.md) |
| Photos/fonts/performance | [assets](KOVA_ASSETS.md), [Arabic typography](KOVA_ARABIC_TYPOGRAPHY.md), [loading](KOVA_LOADING_FIX.md) |
| Analytics | [analytics](ANALYTICS.md) |
| Delivery/status summary | [delivery](KOVA_DELIVERY.md), [UI progress](UI_UX_REDESIGN_PROGRESS.md) |
| Decisions/history | [ADRs](../DECISIONS.md), [changelog](../CHANGELOG.md), [archive](archive/README.md) |

`DEPLOYMENT.md` and `KOVA_RUNTIME_SETUP.md` are entry points to the canonical
deployment/environment references, not independent competing configurations.
`docs/qa/` JSON/screenshots are dated evidence; machine-generated old values do
not override PROJECT_STATE. Photography manifests describe asset provenance,
not the current database's inventory or product publication status.

## Keeping docs current

- Architecture change: update ARCHITECTURE, ownership map and ADRs.
- Route/role change: update route inventory, ADMIN/AUTH and security acceptance.
- Env/deployment change: update ENVIRONMENT and PROJECT_STATE after verification.
- Product/stock change: database is authoritative; timestamp any documented snapshot.
- Test run: record command, date, scope and limits; never silently promote a local
  lab sample to a production performance or payment-acceptance claim.
- Preserve meaningful old checkpoints in `archive/` or Git history. Do not keep
  contradictory current-state paragraphs above/below each other.
- Do not include secrets, personal payment proofs, auth tokens or private env dumps.
- Check relative links and referenced source files after moves. A docs-only
  update does not require editing runtime configuration or live records.

[Documentation audit](qa/documentation-audit.json) records link, source-path, environment-variable, route-inventory and generated-instruction checks for this refresh.
