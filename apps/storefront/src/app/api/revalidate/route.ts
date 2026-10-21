import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
export async function POST(request: Request) {
  const secret = process.env.STOREFRONT_REVALIDATION_SECRET;
  if (!secret) return Response.json({ error: "Not configured" }, { status: 503 });
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  revalidatePath("/[locale]", "layout");
  revalidatePath("/api/google/merchant-feed");
  revalidatePath("/sitemap.xml");
  return Response.json({ revalidated: true }, { headers: { "Cache-Control": "no-store" } });
}
