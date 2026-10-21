import { afterEach, describe, expect, it, vi } from "vitest";
import { adminUrl, storefrontUrl } from "@/lib/application-urls";
afterEach(() => vi.unstubAllEnvs());
describe("independent application URLs", () => {
  it("uses configured origins for links without dropping the locale or admin path", () => {
    vi.stubEnv("NEXT_PUBLIC_ADMIN_URL", "https://admin.example.com/");
    vi.stubEnv("NEXT_PUBLIC_STOREFRONT_URL", "https://store.example.com");
    expect(adminUrl("ar","/orders")).toBe("https://admin.example.com/ar/admin/orders");
    expect(storefrontUrl("en")).toBe("https://store.example.com/en");
  });
  it("does not install cross-domain redirects before an origin is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADMIN_URL", ""); vi.resetModules();
    const {default:config}=await import("../../apps/storefront/next.config");
    expect(await config.redirects?.()).toEqual([]);
  });
  it("supports the documented localhost setup and preserves legacy page and API destinations", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADMIN_URL", "http://localhost:3001"); vi.resetModules();
    const {default:config}=await import("../../apps/storefront/next.config");
    const redirects=await config.redirects?.();
    expect(redirects).toEqual(expect.arrayContaining([expect.objectContaining({destination:"http://localhost:3001/:locale/admin/:path*",permanent:false}),expect.objectContaining({destination:"http://localhost:3001/api/admin/:path*",permanent:false})]));
  });
  it("rejects cleartext remote admin origins", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADMIN_URL", "http://admin.example.com"); vi.resetModules();
    const {default:config}=await import("../../apps/storefront/next.config");
    await expect(config.redirects?.()).rejects.toThrow("HTTPS origin");
  });
});
