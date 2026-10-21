import "server-only";
import { revalidatePath as invalidateLocal } from "next/cache";
import { after } from "next/server";

// Only the admin app uses this adapter. Inventory and checkout never rely on this cache.
export function revalidatePath(path: string, type?: "page" | "layout") {
  invalidateLocal(path, type);
  if (path.includes("/admin") || path.includes("/account")) return;
  const origin = process.env.STOREFRONT_REVALIDATION_URL;
  const secret = process.env.STOREFRONT_REVALIDATION_SECRET;
  if (!origin || !secret) return;
  const url = new URL("/api/revalidate", origin);
  if (url.protocol !== "https:" && url.hostname !== "localhost") throw new Error("Revalidation requires HTTPS");
  after(async () => {
    try {
      const response = await fetch(url, { method: "POST", headers: { authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(8000), cache: "no-store" });
      if (!response.ok) console.error("[kova] Storefront revalidation failed", { status: response.status });
    } catch { console.error("[kova] Storefront revalidation unavailable; retry via the deployment runbook."); }
  });
}
