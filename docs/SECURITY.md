# Security boundaries

Reviewed 2026-10-22. Read [auth](AUTH.md), [database](DATABASE.md) and [user-role design](KOVA_USER_ROLES.md) before privileged changes.

- Supabase secret/service-role, payment/SMTP/provider tokens, cron and operational secrets stay server-only and out of Git/logs. Publishable keys are not authorization to bypass RLS.
- Every protected read/mutation validates the current user and explicit required roles; user_roles is authoritative. Editable user metadata, URL parameters and hidden buttons cannot establish permission.
- Public tables require RLS and least-privilege grants. Definer functions must have justified scope, fixed search paths, explicit execution ACLs and actor checks; new role-management definer implementations are private, behind invoker wrappers.
- Role changes serialize before rechecking the actor, protect self/last-super-admin removal, require verified target email for staff grants, preserve customer access and audit actual changes. Direct authenticated role writes stay denied.
- Prices, inventory, discounts and order/payment states are recalculated/validated transactionally. Webhook signatures, allowed integrations, amount/currency and idempotency remain mandatory.
- Evidence buckets are private, with scoped signed access. Authenticated/account/order/checkout data must never enter the anonymous public cache.
- Cron and detailed readiness require separate bearer secrets and fail closed when missing. Logs omit tokens, request bodies, payment proofs and unnecessary customer details.
- User registration/recovery callbacks restrict destinations. Session cookies are host-scoped; broad redirect allowlists are not a substitute for validation.

## Advisor and acceptance status

The last role-management advisor review introduced no exposed definer RPCs. Private role-change audit storage intentionally has no direct grants/policies (RLS default deny), so an informational no-policy notice is expected. Existing public guarded commerce RPC advisories and leaked-password protection status need current review; do not claim they were eliminated or that a plan upgrade happened.

Security workflow configuration exists, but successful scheduled runs and external protection settings must be verified. Monitoring/restore scripts still include legacy targets; see [operations](OPERATIONS.md) before execution. Restore drills must never target current KOVA or legacy history.

For suspected compromise use [incident response](runbooks/INCIDENT_RESPONSE.md): preserve evidence, contain exposure, rotate only affected secrets through the approved channel, recheck access and reconcile commerce. Documentation is not authorization to send messages, expose data or perform destructive recovery.
