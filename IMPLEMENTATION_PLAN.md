# Continuing implementation

The original greenfield phases are historical. Extend the existing deployed KOVA applications rather than scaffolding a replacement.

1. Establish the current baseline using [agent handoff](docs/AGENT_HANDOFF.md), PROJECT_STATE and live/code evidence.
2. Select an explicit item from [TASKS](TASKS.md) or the user's new request; identify the owning app and shared/database boundaries.
3. Design backward-compatible schema/API/UI changes. Preserve server money/stock/payment authority, fresh role checks, private data isolation, Arabic/English behavior and current image quality.
4. Implement focused validation and failure handling; add meaningful tests for security or domain behavior. Use sandbox fixtures for transactional acceptance.
5. Run appropriate checks and the release gate for application changes; inspect browser-to-data behavior, including unauthorized access and recovery states.
6. Release only within authorization, verify the exact deployed commit, and update docs/evidence with dated scope and remaining limits.

Cross-app dependencies: a DB/RPC contract change belongs to root migrations and shared types once; an admin change may require storefront invalidation; checkout/webhooks/cron remain storefront-owned. Feature ownership is detailed in [architecture](docs/ARCHITECTURE.md).
