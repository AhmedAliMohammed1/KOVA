# Runtime setup and admin access

Reviewed 2026-10-22. Follow [root local setup](../README.md), the [environment matrix](ENVIRONMENT.md) and [deployment guide](KOVA_DEPLOYMENT.md); this file no longer duplicates competing env values.

1. Install the pinned workspace dependencies using Node 22/24 and pnpm 11.25.0.
2. Configure ignored env files inside both apps. Public URL/key and any server secret must belong to khccehpehasicomumani or an explicitly chosen non-production project.
3. Set each app's own origin, cross-app links and shared cache invalidation secret. Match local ports to the command actually used: dev 3000/3001; optional production previews 3200/3201.
4. Explicitly set CHECKOUT_PHONE_OTP_ENABLED=false for the chosen OTP-free checkout. Code/example default true is not the current policy; email verification remains independent.
5. Start both apps or verify exact production deployments. A working catalog does not prove privileged commerce/provider configuration.

## Administration

Production admin: https://admin-two-tau-18.vercel.app/ar/admin or /en/admin. Staff sign-in is on the admin origin. The overview requires admin/super_admin; narrower workspaces have their own role sets. Only super_admin sees /{locale}/admin/users.

The owner and requested second admin accounts already exist and are email-confirmed; the one-time bootstrap is claimed. Current role assignments are a dated snapshot in [PROJECT_STATE](../PROJECT_STATE.md). Do not create a new password or duplicate account to fix configuration. Use ordinary recovery if the owner needs a password reset.

## Diagnose missing functionality

Check origin/root -> matching public configuration -> session/callback -> current database role -> intended RPC permission -> server-only key/provider configuration -> real variant stock -> cache/invalidation. Never weaken RLS, fake stock or treat fallback demo content as a successful production connection.

If OTP still appears, check exact flag name/value, app/env scope, deployment commit and runtime; rebuild after configuration changes. Disabled request/verify endpoints return the disabled response rather than contacting Twilio. See [payments](PAYMENTS.md).
