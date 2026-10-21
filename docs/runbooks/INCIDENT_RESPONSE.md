# Incident response

Reviewed 2026-10-22. Use current KOVA app/database targets in [PROJECT_STATE](../../PROJECT_STATE.md); legacy history is a separate protected system.

## Severity

SEV-1: broad checkout outage, data corruption/loss, exposure, incorrect payment capture or overselling. SEV-2: major customer/staff workflow failure, blocked fulfilment or accumulating job/notification failures. SEV-3: isolated defect with a safe workaround.

## First response

Assign an incident owner; record time, affected journeys and exact deployed commits/env changes. Preserve Vercel/Supabase/provider evidence without tokens, connection strings, personal proofs or unnecessary customer data. Contain the affected feature rather than weakening RLS or changing all flags. Confirm whether rollback, forward fix or authorized data recovery is appropriate.

Diagnose actual KOVA health/readiness -> recent code/env changes -> route/runtime errors -> Supabase Auth/DB/Storage/locks/advisors -> relevant provider identifiers. The legacy smoke workflow does not establish current health. Distinguish phone OTP, email verification, missing server configuration, real stock, private access and optional-provider holds.

## Commerce and access

- Pause affected products when inventory is inconsistent; reconcile reservations/movements before an audited adjustment.
- Keep fulfilment blocked until payment/deposit evidence is accepted. Reconcile verified Paymob server events; browser return status is not payment.
- Preserve successful order transactions when email/cache refresh fails; retry the secondary operation without duplicate mutations or communications.
- For unexpected staff access, inspect current user_roles and private role-change audit, contain compromised access through an authorized super admin/operator, and retain self/last-super-admin protections.
- Do not run restore scripts until current target protections and exact URL/ref are independently verified. Never restore a drill into current KOVA or legacy history.

## Closure

Verify affected Arabic/English, auth, commerce and staff boundaries using safe fixtures. Reconcile records/payments before resuming. Customer/staff communications require the appropriate authorization and factual scope. Record cause, timeline, impact, recovery evidence and preventive tasks, including measured RPO/RTO where applicable. [Release/rollback](RELEASE_ROLLBACK.md), [monitoring](MONITORING.md).
