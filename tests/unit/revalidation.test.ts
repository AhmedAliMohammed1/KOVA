import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/revalidate/route";
const invalidate = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({ revalidatePath: invalidate }));
afterEach(() => { vi.unstubAllEnvs(); invalidate.mockClear(); });
describe("cross-application cache invalidation", () => {
  it("fails closed when a deployment has no secret", async () => {
    vi.stubEnv("STOREFRONT_REVALIDATION_SECRET", "");
    const response = await POST(new Request("https://store.test/api/revalidate", {method:"POST"}));
    expect(response.status).toBe(503);
    expect(invalidate).not.toHaveBeenCalled();
  });
  it("rejects missing, incorrect and length-matched unauthorized credentials", async () => {
    vi.stubEnv("STOREFRONT_REVALIDATION_SECRET", "kova-test-only-secret");
    for (const authorization of ["", "Bearer bad", "Bearer kova-test-only-secrex"]) {
      const response = await POST(new Request("https://store.test/api/revalidate", {method:"POST",headers:{authorization}}));
      expect(response.status).toBe(401);
    }
    expect(invalidate).not.toHaveBeenCalled();
  });
  it("invalidates only the fixed public scope for an authorized request", async () => {
    vi.stubEnv("STOREFRONT_REVALIDATION_SECRET", "kova-test-only-secret");
    const response = await POST(new Request("https://store.test/api/revalidate", {method:"POST",headers:{authorization:"Bearer kova-test-only-secret"},body:JSON.stringify({path:"/api/private"})}));
    expect(response.status).toBe(200);
    expect(invalidate.mock.calls).toEqual([["/[locale]","layout"],["/api/google/merchant-feed"],["/sitemap.xml"]]);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
