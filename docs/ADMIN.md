# Administration

Production: https://admin-two-tau-18.vercel.app. Source owner: apps/admin. Sign in at /ar/account or /en/account with an existing staff account. Admin / redirects to /en/admin; storefront staff routes redirect to the configured admin origin. Host-scoped cookies can require a separate sign-in.

## Page-level access

| Workspace | Explicitly allowed roles |
|---|---|
| Overview, banners, discounts, shipping, sizing | admin, super_admin |
| Product editing | product_manager, admin, super_admin |
| Orders | support, warehouse, admin, super_admin |
| Reviews | content_editor, product_manager, admin, super_admin |
| Commercial | support, warehouse, content_editor, product_manager, analyst, admin, super_admin; each mutation has narrower role checks |
| Users & roles | super_admin only |

This is a navigation aid, not permission to generalize across actions. RequireRoles checks in each route/action and database RPC/RLS remain authoritative. A staff role does not automatically imply overview access or every mutation in its workspace.

## Workflows

- Product content, prices, COD deposits, publication, colour galleries and size inventory are edited through admin; preserve current live variants/stock. Guarded deletion/archive behavior must respect historical references.
- Orders display immutable snapshots, private proof review, payment state, shipment/tracking and fulfilment transitions. Do not infer paid status from an upload or redirect. Shipping states require the contract's shipment details. Delivery/cancellation update reservations/inventory atomically.
- Commercial operations handle merchandising, bundles/recommendations, stock alerts, role-scoped return receiving/restock/settlement and CSV exports.
- Reviews support moderation, responses and featured approved reviews with history.
- CMS, sizing, shipping and campaigns use their existing forms and server mutations; successful writes request storefront invalidation.

## User roles

A super admin sees Users & roles in navigation and overview, at /{locale}/admin/users. Search by name/email, open Manage roles, choose a role, read grant/revoke wording, check confirmation and submit. Unverified users cannot receive staff roles. Customer access is automatic. Self-super-admin and final-super-admin removal are protected; actual changes are privately audited. [Implementation/security details](KOVA_USER_ROLES.md).

The initial bootstrap has been claimed. Routine role administration should use this page; offline operator scripts require server secrets and bypass application-level workflow, so use only for explicitly authorized recovery after verifying the target database.
