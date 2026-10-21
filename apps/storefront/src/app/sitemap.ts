import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog";
import { supportTopics } from "@/features/support/content";
import { getSiteOrigin } from "@/features/auth/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteOrigin();
  const products = await catalog.featured();
  return ["en", "ar"].flatMap((locale) => [
    {
      url: `${base}/${locale}`,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${base}/${locale}/shop`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...Object.keys(supportTopics).map(topic => ({ url: `${base}/${locale}/help/${topic}`, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...products.map((p) => ({
      url: `${base}/${locale}/products/${p.slug}`,
      alternates: { languages: { en: `${base}/en/products/${p.slug}`, ar: `${base}/ar/products/${p.slug}` } },
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]);
}
