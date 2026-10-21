# KOVA design guide

The authoritative [KOVA master](design-system/kova/MASTER.md) defines the current visual system. Palette values live in packages/shared/tokens.css; shared styles in packages/shared/src/styles/globals.css. Earlier Scrub Vibe/NOVA palettes are historical and must not be reapplied.

Navy #06152D, teal #087E83, highlight #55D5CD, white and restrained neutral surfaces support real studio photography and editorial headings. Keep visible controls/focus, useful error states, clear prices, responsive cards and quiet motion. Follow existing tokens rather than introducing a second theme.

Arabic uses self-hosted Noto Sans Arabic for UI and Noto Naskh Arabic for editorial text. Preserve normal Arabic tracking, upright letters, diacritic clearance, logical spacing, RTL direction and Latin brand labels. English keeps existing system stacks. See [Arabic typography](docs/KOVA_ARABIC_TYPOGRAPHY.md) and the shared font licenses/provenance.

Use the supplied official raster crop proportionally until an approved SVG/transparent master exists; do not redraw the logo. Product photos are factual assets, not evidence for waterproof/antimicrobial/manufacturing claims. Preserve responsive image loading and quality settings.

Feature-specific rules: [user access](design-system/kova/pages/user-access.md). Asset source/mapping: [photography](docs/KOVA_ASSETS.md). Remaining accessibility/business acceptance: [TASKS](TASKS.md). The earlier full visual specification is retained in [archive](docs/archive/README.md).
