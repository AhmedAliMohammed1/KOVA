import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  typedRoutes: false,
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@kova/shared"],
  turbopack: { root: path.resolve(import.meta.dirname, "../..") },
  outputFileTracingRoot: path.resolve(import.meta.dirname, "../.."),
  experimental: { optimizePackageImports: ["lucide-react"], serverActions: { bodySizeLimit: "6mb" } },
  images: { remotePatterns: [{ protocol: "https", hostname: "khccehpehasicomumani.supabase.co", pathname: "/storage/v1/object/public/**" }, { protocol: "https", hostname: "iqufqtjotgpmhhtvlxwf.supabase.co", pathname: "/storage/v1/object/public/**" }] },
  async headers() { return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }]; },
};
export default config;
