# Product photography and brand assets

Reviewed 2026-10-22. [Current data snapshot](../PROJECT_STATE.md) and [documentation index](README.md) take precedence over historical catalog checkpoints.

The complete local folder contains **70 JPEGs** (549,004,428 bytes, about 549 MB), numbered 1–70; `ELESAWY STUDIOS.jpg` is number 1. All were visually inspected in four numbered contact sheets. The earlier Drive search returned only a 13-file subset; the previous statement that this was the full folder was incorrect. The local archive is now the complete inventory source.

Source/local provenance, original dimensions, SHA-256, group and view, candidate gallery ordering, optimized paths, bilingual alt text and mapping status are in `product-photography-manifest.json`. All 70 files are unique by exact SHA-256; similar poses remain separate frames. Previously discovered Drive IDs are retained for 13 files. The other 57 have local source paths and hashes; no Drive IDs are fabricated. Review assignments live in `product-photo-review.json`. Contact sheets are `qa/studio-contact-sheet-1.jpg` through `qa/studio-contact-sheet-4.jpg`.

| Visual group | Files | Count |
|---|---|---|
| Grey women's set | 1–3, 10–24 | 18 |
| Blue women's set | 4–5, 25–27, 29–33 | 10 |
| Burgundy women's set | 28, 34–52, 62, 65 | 22 |
| Black men's set | 53–61, 63–64, 66–67 | 13 |
| Burgundy still-life / water demonstration | 6–9, 68–70 | 7 |

Owner confirmation establishes two new KOVA products: women's set (ID 2), with grey/blue/burgundy, and men's set (ID 3), with black. Both cost EGP 850 with an EGP 200 COD deposit. The women's gallery contains 50 photographs; the men's gallery contains 13. All associations and bilingual alt text are recorded in the manifest. Seven still-life/water frames remain excluded from product galleries and performance claims. No full rear view was identified.

The historical old-project cutover archived nine legacy products while preserving its 19 orders, 22 linked items and review. Current KOVA products 2/3 are active and have owner-maintained variants and stock in the new project. Never use the original draft-only checkpoint to disable ordering or overwrite inventory. Home images 14, 10 and 55 show the hero, women's and men's edits respectively.

Optimized WebP derivatives preserve colors, orientation and aspect ratio, with no enlargement, retouching or color grading. The 70 derivatives total **16,967,498 bytes** (about 17 MB), with a 1600×2000 maximum bounding box and quality 88. Next Image serves responsive derivatives; importing all 70 assets does not load them all on the homepage. Only the hero is preloaded. Original JPEGs and the supplied raw archive directory are ignored and are not shipped.

Regenerate from the supplied folder:

```powershell
node scripts/prepare-kova-assets.cjs 'ELESAWY STUDIOS-20261021T195231Z-1-001/ELESAWY STUDIOS'
node scripts/catalog-photo-manifest.cjs 'ELESAWY STUDIOS-20261021T195231Z-1-001/ELESAWY STUDIOS'
```

The preparation script supports the old numbered `.kova-assets/` source as an explicit fallback, excludes generated contact sheets from inputs, and creates paginated contact sheets. The manifest script verifies that every source is assigned exactly once to a reviewed garment group and view.

The shield/wordmark is a proportional crop from `5cb5ebdc-ec30-4ead-9d74-edc2083c17be.jpg`. A standalone logo was not supplied. Replace it with an owner-approved SVG or transparent master when available. Reference launch slogans are not used as availability statements. Legacy `/images/scrub-vibe/` paths remain valid to preserve historical order and receipt media.

Still required: approved material/care data and the official standalone logo. Recheck live size/stock availability; owner-maintained inventory is not an asset-manifest field.

Current database mapping is to project `khccehpehasicomumani`, product IDs 2/3. The historical archive and order counts above refer to the original project, which remains untouched by the fresh-project installation.
