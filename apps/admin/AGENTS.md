<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# KOVA admin ownership

Read the [root instructions](../../AGENTS.md) and [agent handoff](../../docs/AGENT_HANDOFF.md).

Own staff routes/APIs and mutations. Require current roles independently in pages, actions and RPCs. Users & roles is super_admin only. Customer checkout/webhooks/cron belong to storefront, not this application.

This app resolves @/* to its src first, then packages/shared/src. Put its env file
in this directory. Read the installed Next docs from the workspace dependency
location before framework changes. Use shared tokens/fonts/contracts and update
the route/permission documentation when behavior changes.
