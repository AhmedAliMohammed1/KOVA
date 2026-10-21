import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/features/auth/site-url";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/en/admin", "/ar/admin", "/en/account", "/ar/account", "/en/checkout", "/ar/checkout", "/en/track", "/ar/track", "/en/cart", "/ar/cart", "/en/wishlist", "/ar/wishlist"] },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
