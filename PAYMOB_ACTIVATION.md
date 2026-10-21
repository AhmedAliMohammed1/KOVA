# Paymob activation runbook

Reviewed 2026-10-22. Implementation exists but activation remains held pending acceptance. Do not enable merely because keys exist. [Payments](docs/PAYMENTS.md) describes independent manual/COD workflows.

## Storefront settings

PAYMOB_ENABLED=false until acceptance; PAYMOB_SECRET_KEY, PAYMOB_PUBLIC_KEY, PAYMOB_HMAC_SECRET and PAYMOB_INTEGRATION_ID belong in storefront server configuration. IDs are a positive comma-separated allowlist. NEXT_PUBLIC_APP_URL is the actual storefront origin: https://kova-green-delta.vercel.app in production. Never prefix provider secrets with NEXT_PUBLIC_.

Processed callback: https://kova-green-delta.vercel.app/api/payments/paymob/webhook. Customer return: generated /{locale}/track/{orderNumber}?payment=returned. Only the verified server callback establishes payment success; a redirect never does.

## Acceptance sequence

1. Verify the intended non-production app/database, test merchant keys/integrations and callback URL; record current known-good settings.
2. Configure required credentials with Paymob still held; redeploy and inspect readiness without exposing secrets.
3. Enable only the sandbox environment and redeploy. Test successful, declined and abandoned attempts.
4. Verify signatures, amount/currency/integration mismatch rejection, duplicate callback idempotency and resulting order/audit state. Reconcile provider identifiers against the test dashboard.
5. Only after acceptance and owner authorization configure live credentials/callbacks and enable Production. Record commit/environment/provider evidence.

Emergency stop: set PAYMOB_ENABLED=false and redeploy to stop new intentions. Preserve callback/payment audit records and reconcile ambiguous transactions; never manually infer paid status from a redirect. Keep manual methods active only when their review queues are healthy. [Release/rollback](docs/runbooks/RELEASE_ROLLBACK.md).
