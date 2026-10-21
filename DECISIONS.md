# Architectural decisions

Reviewed 2026-10-22. Earlier decisions preserve implementation history; current KOVA deployment, brand and role decisions below supersede obsolete identity/configuration details. See [PROJECT_STATE](PROJECT_STATE.md).

## ADR-001 — Supabase PostgreSQL as system of record

**Status:** Accepted. **Reason:** Commerce data is relational and needs transactions, constraints, auditability and row-level authorization.

## ADR-002 — Repository boundary with explicit development adapter

**Status:** Accepted. **Reason:** Pages can run without credentials while production remains database-first. The demo adapter is labelled and cannot be mistaken for the production store.

## ADR-003 — Locale-prefixed App Router

**Status:** Accepted. **Reason:** `/en` and `/ar` provide indexable, shareable locale URLs and deterministic `dir` switching. A message framework can replace the compact dictionary when translation volume grows.

## ADR-004 — Money in integer minor units

**Status:** Accepted. **Reason:** Avoids floating-point pricing defects and maps cleanly to payment providers.

## ADR-005 — Provider abstractions for payments, shipping and email

**Status:** Accepted. **Reason:** Paymob/COD, Egyptian couriers and Resend must be replaceable and testable without leaking provider concerns into checkout.

## ADR-006 — Original editorial identity

**Status:** Superseded by ADR-019. Earlier NOVA/Scrub Vibe branding and generated/sand-clay photography direction are historical; current KOVA uses supplied studio photography and the navy/teal master.

## ADR-007 — Database-backed RBAC with private policy helper

**Status:** Accepted. **Reason:** Roles are server-controlled relational data. A private `security definer` helper performs indexed role lookup for RLS, explicitly checks `auth.uid()`, fixes its search path and revokes broad execution.

## ADR-008 — Supabase session refresh in Next.js 16 Proxy

**Status:** Accepted. **Reason:** Server Components cannot write refreshed cookies. Proxy verifies claims before rendering and propagates the cache-prevention headers supplied by the current SSR client.

## ADR-009 — Explicit Paymob activation and callback source of truth

**Status:** Accepted. **Reason:** Paymob stays unavailable unless `PAYMOB_ENABLED=true` and every credential/callback setting is valid. Server-to-server HMAC callbacks—not browser redirects—are authoritative. Callback identities are deduplicated in PostgreSQL, successful payments cannot be downgraded by later failures, and only payload digests plus operational identifiers are retained for audit.

## ADR-010 — Server-authoritative shipping quotes with immutable order snapshots

**Status:** Accepted. **Reason:** The checkout UI may preview delivery charges, but the order transaction validates the selected Egyptian governorate/city and recalculates the zone fee, free-shipping discount and COD surcharge from live database settings. Each order stores the resulting zone, destination labels, charge breakdown and delivery window so later admin rate changes cannot rewrite the commercial terms promised to the customer.

## ADR-011 — Multi-stage transactional order lifecycle notifications

**Status:** Accepted as implementation design, not a delivery guarantee. Bilingual lifecycle notification attempts are non-blocking: failures must not undo a successful order or staff transaction. Sender selection can use the configured sender or test fallback, but real delivery still requires verified provider/domain/recipient configuration and acceptance. Never claim an arbitrary unverified domain will deliver successfully.

## ADR-012 — Hybrid size chart architecture with client-side recommendation engine

**Status:** Accepted. **Reason:** Medical scrub sizing requires standard collection measurements (Women, Men, Unisex) for baseline consistency, while allowing granular per-product overrides for specialized cuts (joggers, lab coats, slim-fit sets). The database stores measurements in `size_chart_entries` with public read RLS and role-restricted admin management. On the storefront, pure client calculation evaluates multi-dimensional body measurements (Chest, Waist, Hips) with configurable units (cm/inches) and recommends optimal sizes restricted to the product's actual stock inventory without leaking network latency.

## ADR-013 — Server-authoritative promotions with immutable redemption snapshots

**Status:** Accepted. **Reason:** Discount eligibility and amounts must never trust browser totals. PostgreSQL locks and revalidates the code, campaign, live variant prices, schedules, usage limits, customer limits and budgets in the same transaction that reserves inventory and creates the order. Orders and redemptions retain code/campaign names and monetary snapshots so later campaign edits cannot rewrite historical commercial terms. Promotion RPCs are executable only by the server service role, while RLS limits campaign management and reporting to authorized staff.

## ADR-014 — Customer Saved Addresses & Checkout Prefill Architecture

**Status:** Accepted. **Reason:** Healthcare professionals frequently purchase scrubs for delivery to specialized clinical locations (hospitals, clinics, surgery centers) or home. Customer delivery addresses are stored in `customer_addresses` with owner-scoped RLS and foreign-key constraints to Egyptian `shipping_governorates`. A PostgreSQL trigger transparently enforces single-default logic on insert, update, and delete. At checkout, registered customers can 1-click apply saved addresses—which instantly updates delivery zones, shipping rates, and COD rules without manual re-entry—or choose to save new delivery destinations directly from the checkout form.

## ADR-015 — Storefront Merchandising CMS & Dynamic Banners Architecture

**Status:** Accepted. **Reason:** Store administrators need the capability to publish, schedule, reorder, and style promotional messaging (announcement tickers, full-bleed hero carousels, and editorial promo blocks) without code redeployments or developer intervention. Data is stored in `cms_banners` with bilingual fields (`en`/`ar`), schedule windows (`starts_at`, `ends_at`), background and text colors, and media paths hosted in a dedicated public Supabase Storage bucket (`banners`). Public read RLS strictly filters by active status and current schedule timestamp, while writes are restricted to administrative roles (`admin`, `super_admin`). On the storefront, components implement graceful fallback: when no active CMS banners exist, the hardcoded foundational brand copy and assets render seamlessly with zero visual regression.

## ADR-016 — Automated Abandoned-Cart Recovery Sequence Architecture

**Status:** Accepted. **Reason:** To recover lost sales while respecting customer privacy and anti-spam standards, cart recovery operates on server-persisted carts belonging to authenticated or identified customers. An index-backed PostgreSQL RPC (`find_abandoned_cart_candidates`) identifies unpurchased carts meeting strict delay windows (2h, 24h, 48h) and progression requirements without client-side polling or race conditions. A Vercel Cron route (`/api/cron/abandoned-cart`) orchestrates a 3-stage escalation: gentle reminder, urgency notification, and an auto-generated limited-time single-use discount code (`RECOVER-XXXX`). Emails feature bilingual HTML responsive layouts, direct cart restore and checkout auto-apply links, and cryptographic HMAC-signed 1-click unsubscribe links storing opt-outs in `profiles.cart_recovery_opt_out`. Successful order completions asynchronously mark notifications as recovered, feeding live recovery rates and attributed revenue directly into the operations dashboard.



## ADR-017 — Two applications, one shared contract and database

**Status:** Accepted. Storefront owns customer commerce, webhooks and cron; admin owns staff workflows. Both reuse packages/shared and root migration history. Separate Vercel roots and host-scoped auth improve ownership clarity; app rollback remains independent of database state.

## ADR-018 — Owner-selected KOVA database

**Status:** Accepted. khccehpehasicomumani is current production. The earlier database retains separate legacy commerce; accounts/orders were not silently migrated. Mutable product/variant/role facts require live verification rather than replaying historical seed data.

## ADR-019 — Arabic-first KOVA identity and self-hosted fonts

**Status:** Accepted; supersedes ADR-006 identity. Storefront / redirects to /ar while /en stays explicit. Real supplied studio media and navy/teal tokens define KOVA. Licensed local Noto Sans/Naskh Arabic variable fonts provide consistent Arabic text without runtime third-party font requests. Preserve RTL, upright letters and image quality.

## ADR-020 — Bounded anonymous public caching

**Status:** Accepted. Only allowlisted anonymous reads receive 60-second tagged caching and an eight-second complete-response deadline. Private clients remain uncached. Admin invalidates public data through a fixed-scope bearer endpoint. Checkout remains database-authoritative even when a public availability view is cached.

## ADR-021 — Super-admin role management

**Status:** Accepted. Current relational roles gate page, action and private database function. Invoker wrappers expose only guarded APIs; serialized mutations prevent last-super-admin/concurrent actor-revocation races. Self-demotion is blocked, customer access is automatic, grants require verified email, and real changes are privately audited.

## ADR-022 — Current documentation separated from history

**Status:** Accepted. Agent handoff, project state, environment reference and domain guides are current sources; archive retains old checkpoints. Test results remain dated/scoped. Legacy operational target/restore/instrumentation gaps are documented work, not implied completed protections. Documentation does not authorize privileged external actions by itself.
