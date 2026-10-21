import { afterEach, describe, expect, it, vi } from "vitest";
import { trackStoreEvent } from "@/lib/analytics";
vi.mock("@/lib/supabase/config", () => ({ hasSupabaseEnvironment: () => false }));
afterEach(() => { localStorage.clear(); vi.unstubAllGlobals(); });
describe("purchase reporting", () => {
  it("reports a completed order once across repeat renders and subsequent calls", () => {
    const gtag = vi.fn();
    Object.assign(window, { gtag });
    trackStoreEvent("purchase", { metadata: { orderNumber: "SV-TEST-1", value: 85000 } });
    trackStoreEvent("purchase", { metadata: { orderNumber: "SV-TEST-1", value: 85000 } });
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "purchase", expect.objectContaining({ transaction_id: "SV-TEST-1", value: 850 }));
    trackStoreEvent("purchase", { metadata: { orderNumber: "SV-TEST-2", value: 85000 } });
    expect(gtag).toHaveBeenCalledTimes(2);
    delete (window as Window & { gtag?: unknown }).gtag;
  });
  it("requires a transaction identifier before reporting a purchase", () => {
    const gtag = vi.fn(); Object.assign(window, { gtag });
    trackStoreEvent("purchase", { metadata: { value: 85000 } });
    expect(gtag).not.toHaveBeenCalled();
    delete (window as Window & { gtag?: unknown }).gtag;
  });
});
