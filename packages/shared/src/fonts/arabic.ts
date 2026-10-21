import localFont from "next/font/local";

// Arabic subsets only: Latin brand names keep the existing Latin font stacks.
// Load on use rather than preloading Arabic assets on English pages.
export const arabicUi = localFont({
  src: "./noto-sans-arabic-variable.woff2",
  variable: "--font-arabic-ui",
  weight: "400 700",
  style: "normal",
  display: "swap",
  preload: false,
  adjustFontFallback: "Arial",
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

export const arabicDisplay = localFont({
  src: "./noto-naskh-arabic-variable.woff2",
  variable: "--font-arabic-display",
  weight: "400 700",
  style: "normal",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "serif"],
});
