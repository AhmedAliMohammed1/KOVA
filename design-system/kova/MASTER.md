# KOVA Scrubs design system

Authoritative palette: `packages/shared/tokens.css`. Shared component styles: `packages/shared/src/styles/globals.css`. Supersedes the Scrub Vibe master; the earlier document remains as history.

## Direction and source

Midnight navy, teal, white, quiet neutral shopping surfaces, and editorial serif headings follow the three supplied reference JPEGs. The primary UI/UX Pro Max search returned an unrelated liquid-glass recommendation, which was rejected. The narrower editorial/apparel search supported a minimal grid, readable hierarchy, restrained motion, and clear shopping actions; its unrelated pink palette was also rejected. The Next.js stack search supported server components and responsive image sizing.

The official shield and wordmark are cropped directly from the supplied artwork without redrawing or stretching. The source is a flattened JPEG with an embedded background, not a standalone vector logo; the small raster asset is a temporary production asset pending an official SVG/transparent master. Do not recreate the shield using an approximate icon. Keep the full logo proportions (410:560) and clear space. The text-only footer is a typographic brand label, not a replacement shield.

## Semantic colors

| Role | Value | Usage |
|---|---|---|
| Brand / primary | `#06152D` | Navigation, editorial panels, primary buttons, admin header |
| Elevated navy | `#102947` | Secondary dark surfaces |
| Interactive teal | `#087E83` | Links, selection, focus, headings on light surfaces |
| Highlight teal | `#55D5CD` | Highlights on navy; never white text on this teal |
| Soft teal | `#DCEFEE` | Selected controls, gentle callouts |
| Canvas / card | `#F7F8FA` / `#FFFFFF` | Shopping pages and readable forms |
| Strong / muted ink | `#102239` / `#526276` | Body copy and supporting information |
| Divider / control border | `#D5DDE5` / `#7C899B` | Decorative separators / visible input boundaries |
| Danger / success / warning | `#B42318` / `#18794E` / `#935400` | Include an explicit text status; never color alone |

White text belongs on navy and the dark teal action token. Highlight teal belongs on navy. `docs/qa/contrast.json` records calculated token contrast, independently of screenshot review. A light divider is not a sufficient input boundary; form controls use the stronger control token.

## Typography and bilingual behavior

English display: Iowan Old Style, Baskerville, Georgia, serif. English interface: Inter, Aptos, Segoe UI, Arial, sans-serif. Arabic interface: self-hosted Noto Sans Arabic; Arabic display: self-hosted Noto Naskh Arabic. Licensed Arabic-subset variable WOFF2 assets (400–700) live in `packages/shared/src/fonts`, with OFL licenses and provenance. The focused UI/UX Pro Max typography search verified the “Arabic Elegant” pairing. Fonts load on use through `next/font/local`, with swap rendering and no third-party font requests; English routes do not load the Arabic assets. Explicit English brand labels retain Latin serif styling.

Body and form text: 16px; supporting text 12–14px where appropriate. Editorial headings scale with `clamp`, use balanced wrapping, and have no decorative uppercase paragraphs. Arabic uses normal letter spacing, upright lettering, 1.5 heading line-height (1.45 hero), and 1.8–1.85 body/control line-height for joined letters and diacritics. Arabic editorial links/buttons are 14px and eyebrows 13px. Long reading content is limited to 70ch. Interfaces retain native Arabic RTL; logical spacing and directional arrows mirror appropriately.

## Layout and components

- Rhythm: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Content maximum 1440px. Fluid gutters 20–48px; admin maximum 1600px. Forms and account cards use readable white surfaces.
- Buttons: 48px primary height, 44px icon target, modest 2px corners. Navy/white primary, white/border secondary, underlined text links. Disabled controls use native disabled semantics; busy labels explain progress.
- Forms: persistent labels, 16px text, visible boundaries, clear focus, inline error associations. Authentication errors focus a linked summary and retain entered input. Checkout errors focus their alert and preserve the bag. Password managers and paste remain supported.
- Product cards: stable 4:5 image, factual price/stock/discount, descriptive image text, persistent choose-size link and wishlist control. Choosing options precedes cart addition. Do not infer a new product, discount, stock level or fabric claim from a photograph.
- Product pages: image group and purchase pane, keyboard-operable color radios, size buttons with selected state, color-specific media fallback explanation, size guide, truthful reviews only. Color/size choices are URL-addressable and survive locale switching.
- Tables: readable compact labels, labeled horizontal scrolling inside the table wrapper, no page-wide horizontal expansion, pagination and role checks. Consequential operations retain existing server validation, confirmations and database enforcement.
- Overlays: use native dialog for navigation; Escape closes and focus returns to its trigger. Existing size and proof dialogs retain their behavior. Dialog backgrounds and controls must remain readable at 200% zoom and in RTL.
- Feedback: explicit loading, empty, not-found, unavailable-service, success and error messages with a useful next action. A submitted proof is pending verification, never a paid status by assumption.
- Motion: mostly color changes, 150–200ms. No autoplay hero by default. Slideshow play/pause is explicit; hover/focus pauses it and reduced motion prevents timed changes. Announcements are expandable static text. No new animation library.

## Scope of acceptance

The browser evidence covers both locales, 375/768/812/1440px layouts, native navigation focus, catalog recovery, product selection and cart persistence. It is not a WCAG certification. Authenticated dialogs, staff workflows, transactions and screen-reader behavior still need sandbox and assistive-technology acceptance as listed in the delivery report.
