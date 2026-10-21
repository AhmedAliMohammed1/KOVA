import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSiteOrigin } from "@/features/auth/site-url";
import { copy, isLocale } from "@/lib/i18n";
import "@/styles/globals.css";
import { MarketingScripts } from "@/components/analytics/marketing-scripts";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: {
    default: "KOVA Scrubs Egypt — Premium medical scrubs",
    template: "%s — KOVA Scrubs Egypt",
  },
  description:
    "Discover KOVA Scrubs medical apparel in Egypt. Find your fit, explore the collection and review delivery and payment details before ordering.",
  openGraph: { type: "website", siteName: "KOVA Scrubs", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "KOVA Scrubs — For those who care" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const requestedLocale = (await headers()).get("x-scrub-vibe-locale");
  const locale =
    requestedLocale && isLocale(requestedLocale) ? requestedLocale : "ar";

  return (
    <html lang={locale} dir={copy[locale].dir} data-scroll-behavior="smooth">
      <body><MarketingScripts />{children}</body>
    </html>
  );
}
