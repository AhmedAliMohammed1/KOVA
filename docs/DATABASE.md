# Database and contracts

Reviewed 2026-10-22. Current project: khccehpehasicomumani, Ireland eu-west-1. The legacy iqufqtjotgpmhhtvlxwf project holds separate historical commerce and must not be treated as the KOVA runtime database. [Current data snapshot](../PROJECT_STATE.md).

## Model and authority

Normalized products -> options/values -> variants -> inventory/movements; translations and colour-specific image galleries supply the catalog. Orders preserve immutable item/price/address snapshots. Reservations, discounts and payment/fulfilment transitions are database-authoritative. Money is integer piastres; timestamps use timestamptz.

Additional domains cover Auth profiles/user_roles, shipping zones/governorates, carts/wishlists, saved addresses, payment proof/webhook audit, promotions, sizing, CMS, recovery, merchandising/recommendations, stock alerts, returns and verified reviews. Public tables have RLS and explicit grants; those are independent controls. Private helpers/storage are not public authorization shortcuts.

Storage buckets: public product-media and banners; private payment-proofs and return-evidence. Private evidence is served with constrained signed access. The new private role_change_events table records actor/target/role/operation/time and has no direct client grants; no-policy RLS intentionally denies direct access.

## Schema workflow

Root supabase/migrations is the single migration source for both apps. The latest application migration is 20261021222209_super_admin_role_management.sql. Shared RPC types are in packages/shared/src/types/database.ts. Inspect real hosted definitions/history before writing additive changes; do not infer installation state solely from filenames.

Earlier migrations and scripts/operations/kova-bootstrap include legacy data assumptions or schema-only adaptations. An unattended db reset/db push or replay of bootstrap/seed SQL is not a validated fresh-KOVA installation procedure. Plan a reviewed schema/data migration for a new sandbox, without production credentials. See [database setup](KOVA_DATABASE_SETUP.md).

Create migration filenames through the installed Supabase CLI; read its help for current flags. Keep grants, policies, search paths, function signatures and TypeScript definitions aligned. Apply a shared migration once, before code requiring it. Test unauthorized access as well as success; inspect advisors. Do not reset either hosted database to fix a failing test.

Tests/database/super-admin-role-management.sql provides targeted rolled-back checks, but depends on named fixture accounts and one initial super admin. Inspect current roles before running it. Advisors can include intentional private default-deny tables and pre-existing guarded commerce RPC warnings; assess actual exposure rather than broad grants.
