import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { PUBLIC_STOREFRONT_TAG } from "@/lib/supabase/public-fetch";
export async function POST(request: Request) {
  const secret = process.env.STOREFRONT_REVALIDATION_SECRET;
  if (!secret) return Response.json({ error: "Not configured" }, { status: 503 });
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  revalidateTag(PUBLIC_STOREFRONT_TAG, { expire: 0 });
  revalidatePath("/[locale]", "layout");
  revalidatePath("/api/google/merchant-feed");
  revalidatePath("/sitemap.xml");
  return Response.json({ revalidated: true }, { headers: { "Cache-Control": "no-store" } });
}
