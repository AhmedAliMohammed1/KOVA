import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { mapBannerRow, type BannerType, type CmsBanner } from "./types";

type Client = SupabaseClient<Database>;

// ─── Public queries (storefront) ────────────────────────────────────────────

export async function getActiveBanners(
  supabase: Client,
  type?: BannerType,
): Promise<CmsBanner[]> {
  let query = supabase
    .from("cms_banners")
    .select("*")
    .eq("is_active", true)
    .or("starts_at.is.null,starts_at.lte.now()")
    .or("ends_at.is.null,ends_at.gt.now()")
    .order("position", { ascending: true });

  if (type) query = query.eq("type", type);

  const { data, error } = await query;
  if (error) {
    console.error("[cms/repository] getActiveBanners error:", error.message);
    return [];
  }
  return (data ?? []).map((row) =>
    mapBannerRow(row as unknown as Record<string, unknown>),
  );
}
