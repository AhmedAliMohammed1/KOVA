# Payments and checkout phone verification

Reviewed 2026-10-22. Source: shared features/checkout and storefront API routes. [Environment matrix](ENVIRONMENT.md) and [Paymob activation](../PAYMOB_ACTIVATION.md) define setup.

## Authority and methods

Server/database logic re-reads active variants, prices, shipping, promotions and deposit rules; it reserves stock and creates immutable order snapshots transactionally. Browser totals, photo selection, uploaded screenshots and return URLs are not evidence of payment or available stock.

COD, Vodafone Cash and InstaPay flows are implemented. COD can require the per-product deposit; the approved KOVA deposit is EGP 200, subject to actual stored product rules. Manual transfer/deposit proof is JPG/PNG/WebP in private payment-proofs storage and requires authorized staff review. Follow returned order/payment states rather than assuming every COD request immediately becomes confirmed.

Paymob Unified Checkout is implemented but held pending signed callback/sandbox acceptance. Only verified server callbacks can establish success. The callback is on the current storefront: https://kova-green-delta.vercel.app/api/payments/paymob/webhook. Do not configure it on the admin or legacy host.

Checkout/private storage/transactional order creation use a server-only same-project Supabase secret. Payment destination values are owner-provided public details, not API keys; do not invent wallet/bank details. Credentials do not replace provider acceptance or stock.

## Phone OTP

CHECKOUT_PHONE_OTP_ENABLED is server-controlled. Code and .env.example default to true; false, 0, off and no disable it after trim/case normalization. The chosen current deployment setting was false. Explicitly configure the desired environment and redeploy; an old process/deployment or encrypted env export can still yield unexpected behavior. Disabling it does not disable Egyptian phone syntax validation or Supabase email confirmation.

Enabled OTP uses Twilio Verify, with phone/IP rate limiting and a short-lived single-use checkout token, independently of the customer's Supabase email session. TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID and a separate OTP_RATE_LIMIT_SALT are needed only for that enabled flow. CHECKOUT_TEST_OTP is development-only and ignored in production.

## Acceptance and failures

Use non-production inventory/users/provider settings to test successful and declined transactions, proof upload/replacement/approval/rejection, duplicate callbacks, wrong amount/currency/integration/signature, reservation release and retries. Do not submit real orders, emails or transfers to diagnose a cosmetic issue. If an originating transaction succeeds but a notification/cache refresh fails, repair that secondary operation without replaying the order or inventory change.

Never store card details, OTPs, secrets or proof images publicly or in logs. Remaining provider and operational acceptance is tracked in [TASKS](../TASKS.md).
