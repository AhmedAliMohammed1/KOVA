# Testing and evidence

Reviewed 2026-10-22. Last application baseline: [TEST_REPORT](../TEST_REPORT.md), 45 files / 378 tests. Counts and JSON artifacts are dated evidence, not permanent assertions.

## Commands and scope

| Command | Scope |
|---|---|
| pnpm test | Vitest tests under tests; includes integration/migration invariants selected by its config |
| pnpm test:integration | tests/integration subset |
| pnpm lint | Workspace ESLint, zero warnings |
| pnpm typecheck | Both app projects |
| pnpm build | Both production apps and generated Next route/types |
| pnpm verify:release | Full application gate |
| node scripts/verify-kova-workspace.mjs | Built route/action ownership, cron and contrast checks; requires built artifacts |

Do not write tests that merely mirror trivial reversible changes. Add meaningful tests for domain/security behavior and regressions. Docs-only edits use Markdown/link/path/env consistency checks rather than repeating runtime tests or claiming new provider acceptance.

## Browser scripts

scripts/browser contains kova-language-colours.cjs, kova-arabic-typography.cjs, kova-live-loading.cjs, kova-performance.cjs, kova-connected-smoke.cjs and historical kova-smoke.cjs. Playwright and Edge must be available; bundled runtimes are workstation-specific. Set NODE_PATH only to an actual available dependency directory. Inspect each script's defaults first: some default to 3100, some 3200 or live hosting. Where supported, KOVA_STOREFRONT_URL/KOVA_ADMIN_URL choose the targets.

The older smoke script assumes initial unpublished/unavailable products and can fail after real stock is supplied. Update fixtures/expectations before reuse; do not change live inventory to satisfy it. Connected smoke includes an invalid sign-in attempt. Typography/colour scripts create screenshots/JSON; keep generated changes separate from source unless deliberately updating evidence.

Check Arabic/English, small mobile and landscape, no horizontal overflow, keyboard/focus/confirmation/error behavior and image loading. Existing global reduced-motion behavior must be retained. Inspect runtime/network and actual data boundaries; a screenshot or success toast alone is insufficient.

## Database and transactional tests

Use a disposable non-production DB for checkout, proof, email, inventory, returns and provider cases. Inspect migration/test SQL before execution. tests/database/super-admin-role-management.sql rolls back its test writes but depends on named fixture accounts and one initial super admin. Recheck fixtures and target; production role assignments must never be changed just to make the test pass.

Anonymous, customer, each authorized/unauthorized staff role, stale role/session state, duplicate requests and failure paths matter. Match RPC signatures and shared types to actual schema. Provider events, customer communications and destructive recovery need appropriate authorization and a known test environment.

Local warm-cache LCP/CLS samples are not field p75/INP. Existing token contrast checks are not a full WCAG audit. Timestamp origin/commit/conditions and report untested boundaries in the test report and TASKS.
