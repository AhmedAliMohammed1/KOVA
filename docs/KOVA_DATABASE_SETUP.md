# Current KOVA database and safe setup

Current production project: khccehpehasicomumani, https://khccehpehasicomumani.supabase.co, Ireland. [DATABASE](DATABASE.md) describes domains and contract ownership; [PROJECT_STATE](../PROJECT_STATE.md) has a dated live snapshot.

## Installed state

The previously empty project received reviewed commerce schema/security/RPCs, shipping data and public product-media/banners plus private payment-proofs/return-evidence buckets. Both approved KOVA products are now active and have variants; they are not the old draft-only installation. Current product IDs are 2/3. Sizes and inventory are owner-maintained; never replace them from initial setup notes.

The original database iqufqtjotgpmhhtvlxwf remains separate with historical users/orders. Earlier IDs 20/21 and archived legacy product counts belong there. The new installation did not migrate those accounts/orders. Do not delete historical records, globally rewrite asset paths or switch databases without an explicit data plan.

## Accounts and roles

The verified-email initial admin bootstrap has already been claimed. The owner has super_admin and the requested second account has admin; see [role management](KOVA_USER_ROLES.md). Fresh registration does not grant staff access. Do not seed a hardcoded password or rearm the bootstrap.

## Extending or provisioning a sandbox

1. Confirm the actual target URL/ref and inspect existing schema plus migration history. Never execute restore/reset against production/history.
2. Read root migrations and schema-only adaptations in scripts/operations/kova-bootstrap before planning a new project. Historical migrations include legacy seeds; no unattended fresh-KOVA reset recipe has been accepted.
3. Use a disposable non-production project and matching keys/callbacks/buckets. Review schema/data separation, grants, RLS and Auth triggers before applying once.
4. Add only explicit test fixtures, with no live recipient/provider side effects. Keep private evidence private.
5. Verify anonymous/customer/staff boundaries, transactional behavior, relevant RPC signatures/types and advisors. Record exact scope and rollback/cleanup evidence.

Local Docker/Postgres availability is environment-dependent; inspect installed CLI help rather than assuming it exists or installing system services. Root supabase/migrations is the source history; do not execute it independently for both apps. The latest role-management migration and its rolled-back test are described in [DATABASE](DATABASE.md).
