# Super-admin user-role management

Entry: `/{locale}/admin/users` in the existing admin deployment. Both navigation
and overview links render only for users with the `super_admin` database role.

The page supports name/email search, 20-user pagination, current role badges,
verified-email status and a native confirmation dialog. All existing staff roles
can be granted or revoked, including `super_admin`. Customer access remains
automatic. The actor cannot revoke their own super-admin role, and the final
super admin cannot be removed. Staff grants require verified email addresses.

Security boundaries:

- The page and every server-action invocation independently require a current
  `super_admin` entry in `user_roles`.
- Public RPC wrappers are security invokers, with anonymous execution revoked.
  Privileged implementations live in the non-exposed `private` schema, use an
  empty search path, and recheck `auth.uid()` and current database roles.
- Role mutations share a transaction advisory lock, preventing competing changes
  from removing all super admins or allowing an actor revoked while waiting.
- Direct authenticated inserts/deletes to `user_roles` remain disallowed.
- Real changes record actor, target, role, operation and time in private audit
  storage. Duplicate grants/revocations do not create duplicate audit events.
- No service-role key, emailed login link or additional environment variable is
  required for this feature. Existing session cookies and publishable keys suffice.

Initial account changes were explicitly authorized by the owner:
`mslammohamed51@gmail.com` received `admin`; `ahmedelsaify213@gmail.com` received
`super_admin` and retains their existing admin/customer roles.

Validation: 45 unit-test files / 378 tests passed, lint passed, both production
builds passed. The database integration test exercises authenticated super-admin
search, literal search handling, pagination, idempotent grant/revoke, immutable
customer access, final-super-admin and self-removal protection, regular-admin
and non-staff rejection, missing identity rejection and exact audit recording.
All integration-test writes are rolled back. The two requested role assignments
were checked again afterward.

Supabase advisors report no exposed definer functions introduced by this change.
The private audit table intentionally has RLS, no direct grants and no policies
(default deny); its informational no-policy notice is expected. Existing public
commerce RPC and password-protection advisories are outside this change.
