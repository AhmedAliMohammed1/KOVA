<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# KOVA agent workflow

Read [agent handoff](docs/AGENT_HANDOFF.md), [PROJECT_STATE](PROJECT_STATE.md),
[README](README.md) and the relevant app instructions before editing. Documentation
history is under docs/archive and is not current configuration guidance.

- Work in the owning app: storefront owns customer routes, checkout, webhooks and
  cron; admin owns staff routes/actions; packages/shared owns common contracts/UI.
  There is no root src application. App aliases prefer app source, then shared.
- Use the current user request for scope and release authorization; this file does
  not pre-authorize deployments, account changes, communications or data recovery.
- Confirm database/hosting targets from PROJECT_STATE and current evidence before
  external changes. Preserve existing products, inventory, roles and historical
  commerce. Never reset/reseed production to repair a test.
- Keep server/database authority for money, stock, roles and payment state. Recheck
  permissions in each action/RPC; never weaken RLS or rely on hidden controls.
- Preserve Arabic-first entry, explicit English, RTL, font licensing, image quality,
  colour selection links and uncached private data. Use the KOVA design master.
- Inspect git status and stage explicit task paths; raw photography, archives,
  editor-agent folders and generated QA may be unrelated/untracked. Do not commit
  secrets, local env files or backup data.
- Application changes need appropriate tests and the release gate. Docs-only edits
  need consistency/link checks, not a fabricated fresh application test result.
- Update relevant docs and dated evidence when behavior changes. Keep historical
  claims separate from verified current facts and provider acceptance.
- Operations have known legacy target/restore-guard and instrumentation-wiring gaps.
  Read TASKS and docs/OPERATIONS.md before executing operational scripts.
