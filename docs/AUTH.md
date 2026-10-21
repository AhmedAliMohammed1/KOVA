# Authentication and authorization

Reviewed 2026-10-22. Supabase Auth is implemented using PKCE and host-scoped cookies through @supabase/ssr; it is not a planned future integration.

Browser/server session clients use the publishable key. Each app's proxy refreshes and verifies claims, supplies locale context and propagates SSR cache-prevention headers. Server Components tolerate unavailable cookie writes; callback routes and proxy handle writes. Role checks query current user_roles rows under RLS, independently of client visibility. Never authorize from editable user_metadata or only a navigation item.

## Sign-in and callbacks

Storefront and admin each have /{locale}/account, recovery/update-password and /{locale}/auth/confirm routes. Registration is storefront-owned. Callbacks accept PKCE codes or supported hashed email tokens and restrict continuation URLs to permitted locale/account destinations. Do not introduce open redirects.

Configure Supabase Auth Site URL to the intended storefront and allow the exact locale callbacks for both actual origins: /en/auth/confirm and /ar/auth/confirm. Local callback URLs must match ports actually used. Changing NEXT_PUBLIC_APP_URL or provider allowlists does not repair an already-issued link pointing at an obsolete host.

Supabase email verification/recovery delivery is separate from Resend application notifications and checkout Twilio phone OTP. CHECKOUT_PHONE_OTP_ENABLED=false affects checkout phone verification only. Use existing account passwords/recovery; do not recreate the claimed bootstrap or retrieve passwords.

## Roles

customer, support, warehouse, content_editor, product_manager, analyst, admin, super_admin are the database enum values. Roles are not a blanket hierarchy: pages/actions/RLS specify allowed sets. Main overview and storefront staff links require admin or super_admin; narrower staff workspaces permit their explicit operational roles.

Only super_admin may view the user directory or change staff roles. Server actions recheck the actor before RPC; the private database function rechecks after taking its role-change lock. Customer access remains automatic; last-super-admin and self-super-admin removal are blocked. See [role management](KOVA_USER_ROLES.md) and [admin access matrix](ADMIN.md).

The current project is khccehpehasicomumani. Legacy users were not migrated automatically. The dated owner/admin assignments live in [PROJECT_STATE](../PROJECT_STATE.md); do not use those email addresses as hardcoded application authorization rules.
