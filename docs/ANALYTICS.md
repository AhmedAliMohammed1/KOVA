# Analytics and commercial reporting

The implemented first-party model distinguishes product impressions, clicks, placement/session/UTM context and trusted server purchase events. Client purchase events never determine payment or authoritative revenue. Avoid private query strings, proof data and unnecessary personal information in analytics/logs.

Storefront owns event collection, the merchant feed and purchase reporting. Admin overview/commercial/orders workspaces read role-scoped metrics for engagement, conversion, revenue, promotions, cart recovery, inventory, returns and reviews. CSV exports are staff-protected. Source domains live in shared lib/analytics, features/commercial, features/cart-recovery and the owning app routes.

GA4, Meta Pixel and server Conversions API integrations are optional. See [ENVIRONMENT](ENVIRONMENT.md) for IDs/tokens and [TASKS](../TASKS.md) for provider acceptance. Missing IDs keep integrations inactive; configuring tokens alone does not prove deduplication, consent or delivery. Verify actual provider events in a sandbox before claiming successful reporting.

Recovery and notification links must use the actual storefront origin. A legacy recovery URL fallback remains in code; configure the origin explicitly rather than treating the old fallback as a KOVA domain. Scheduled recovery belongs to storefront only; inspect external cron ownership before enabling/relying on it.
