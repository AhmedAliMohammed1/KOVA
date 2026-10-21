import type { Metadata } from "next";
import { headers } from "next/headers";
import "@/styles/globals.css";

export const metadata: Metadata = { title: "KOVA Scrubs · Administration", robots: { index: false, follow: false } };
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get("x-scrub-vibe-locale") === "ar" ? "ar" : "en";
  return <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}><body>{children}</body></html>;
}
