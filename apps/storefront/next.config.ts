import type { NextConfig } from "next";
import path from "node:path";

const adminOrigin = process.env.NEXT_PUBLIC_ADMIN_URL?.replace(/\/$/, "");
const config: NextConfig = {
  typedRoutes: false,
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@kova/shared"],
  turbopack: { root: path.resolve(import.meta.dirname, "../..") },
  outputFileTracingRoot: path.resolve(import.meta.dirname, "../.."),
  experimental: { optimizePackageImports: ["lucide-react"], serverActions: { bodySizeLimit: "6mb" } },
  images: { remotePatterns: [{ protocol: "https", hostname: "iqufqtjotgpmhhtvlxwf.supabase.co", pathname: "/storage/v1/object/public/**" }] },
  async redirects() {
    if (!adminOrigin) return [];
    const url = new URL(adminOrigin);
    if ((url.protocol !== "https:" && !(url.protocol === "http:" && url.hostname === "localhost")) || url.pathname !== "/") throw new Error("NEXT_PUBLIC_ADMIN_URL must be an HTTPS origin (or localhost for local testing)");
    return [
      { source: "/:locale(en|ar)/admin/:path*", destination: `${adminOrigin}/:locale/admin/:path*`, permanent: false },
      { source: "/api/admin/:path*", destination: `${adminOrigin}/api/admin/:path*`, permanent: false },
    ];
  },
};
export default config;
