import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchPublicData, publicFetchOptions } from "../../packages/shared/src/lib/supabase/public-fetch";
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
describe("public storefront transport", () => {
  it("caches only allowlisted public GETs for a bounded interval", () => {
    expect(publicFetchOptions("https://project.supabase.co/rest/v1/products?status=eq.active")).toMatchObject({cache:"force-cache",next:{revalidate:60,tags:["kova-public-storefront"]}});
    for (const path of ["orders", "profiles", "inventory", "rpc/admin_delete_product"]) {
      expect(publicFetchOptions(`https://project.supabase.co/rest/v1/${path}`)).toEqual({cache:"no-store"});
    }
    expect(publicFetchOptions("https://project.supabase.co/rest/v1/products",{method:"POST"})).toEqual({cache:"no-store"});
    expect(publicFetchOptions("https://project.supabase.co/auth/v1/user")).toEqual({cache:"no-store"});
  });
  it("preserves response bodies while supplying public cache options", async () => {
    const stub=vi.fn(async()=>Response.json([{id:2}]));vi.stubGlobal("fetch",stub);
    const result=await fetchPublicData("https://project.supabase.co/rest/v1/products");
    expect(await result.json()).toEqual([{id:2}]);
    expect(stub.mock.calls[0]).toMatchObject([expect.anything(),{cache:"force-cache",signal:expect.any(AbortSignal)}]);
  });
  it("converts an expired request into AbortError so PostgREST cannot retry it indefinitely", async () => {
    const signal=AbortSignal.abort(new DOMException("deadline","TimeoutError"));
    vi.spyOn(AbortSignal,"timeout").mockReturnValueOnce(signal);
    vi.stubGlobal("fetch",vi.fn(async()=>{throw signal.reason;}));
    await expect(fetchPublicData("https://project.supabase.co/rest/v1/products")).rejects.toMatchObject({name:"AbortError"});
    vi.restoreAllMocks();
  });
});
