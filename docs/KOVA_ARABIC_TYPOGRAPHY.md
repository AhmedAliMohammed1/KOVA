# Arabic typography refinement

Reviewed 2026-10-22. Current deployment/data: [PROJECT_STATE](../PROJECT_STATE.md); entry point: [agent handoff](AGENT_HANDOFF.md). Feature evidence below is scoped to its recorded release.

Arabic pages use self-hosted Noto Sans Arabic for interface text and Noto Naskh
Arabic for editorial headings, with variable weights 400–700. The verified
UI/UX Pro Max “Arabic Elegant” typography result informed the pairing.

Arabic text uses normal tracking, upright headings, balanced wrapping, larger
navigation and supporting labels, and additional line-height for diacritics.
Latin brand labels retain their serif styling and direction. The shared root
font setup also applies to Arabic administration pages.

The two WOFF2 Arabic subsets total 254 KiB and use cached, hashed Next.js assets,
swap rendering and adjusted fallback metrics. No Google request is needed at
build time or in the browser. Fresh English visits do not download the fonts.
Image files and quality settings are unchanged.

Browser checks identified a separate footer shift while streamed route content
was still loading. Reserving a viewport of height in the content container keeps
the footer below the first screen during that transition.

Validation:

- Lint passed; 42 unit-test files / 355 tests passed.
- Storefront and admin production builds passed.
- Edge browser: 14 Arabic route/viewport cases, widths 375/768/812/1440px,
  including a 375px landscape height and reduced motion.
- Home, shop, product, account, checkout and sizing help: fonts loaded from the
  same origin, no horizontal overflow, no page errors, normal heading tracking.
- Final local loading-shift samples were below 0.01 in all 14 cases; these are
  controlled browser samples rather than production field measurements.
- Mobile navigation, size-guide dialog and Arabic admin sign-in inspected.
- Arabic-default entry and colour-swatch-to-product selection passed in Arabic
  and English.

Evidence: `docs/qa/arabic-typography-results.json`, Arabic viewport/dialog
screenshots, and `docs/qa/language-colour-results.json`. Live checks are repeated
after deployment. No orders, payments, account emails or database changes were
needed for this typography update.
