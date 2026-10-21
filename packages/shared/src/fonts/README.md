# Arabic fonts

Maintained documentation: [current implementation context](../../../../docs/KOVA_ARABIC_TYPOGRAPHY.md). Reviewed 2026-10-22.

Self-hosted Arabic-subset WOFF2 variable fonts, weights 400–700, downloaded
from the official Google Fonts CSS API on 2026-10-22:

- Noto Sans Arabic v33: 165,960 bytes, interface and reading text.
- Noto Naskh Arabic v44: 94,032 bytes, editorial headings.

Total font payload: 259,992 bytes (254 KiB), cached as Next.js hashed assets.
`next/font/local` uses `display: swap` and loads only when used; English pages
do not request these fonts. Latin text falls back to the existing system stacks.
The fonts do not depend on Google being reachable at build or runtime.

Source stylesheet:
https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400..700&family=Noto+Naskh+Arabic:wght@400..700&display=swap

The accompanying OFL files are from the corresponding `ofl/notosansarabic`
and `ofl/notonaskharabic` directories in https://github.com/google/fonts.
Both fonts are distributed under the SIL Open Font License 1.1.
