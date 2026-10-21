import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnvironment } from "@/lib/supabase/config";
import type {
  SizeCategory,
  SizeChartEntry,
  SizeChartRow,
} from "./size-guide-types";
import {
  DEFAULT_SIZE_CHART_ENTRIES,
  mapRowToSizeChartEntry,
} from "./size-guide";

export type ProductSizeChartResult = {
  entries: SizeChartEntry[];
  isProductOverride: boolean;
};

export async function getSizeChartForProduct({
  productId,
  category,
}: {
  productId?: number | null;
  category: SizeCategory;
}): Promise<ProductSizeChartResult> {
  try {
    if (!hasSupabaseEnvironment()) return { entries: DEFAULT_SIZE_CHART_ENTRIES.filter(e => e.category === category), isProductOverride: false };
    const supabase = createPublicClient();

    // 1. If productId is provided, check for product-specific custom measurements
    if (productId && productId > 0) {
      const { data: productEntries, error: pError } = await supabase
        .from("size_chart_entries")
        .select("*")
        .eq("product_id", productId)
        .order("sort_order", { ascending: true });

      if (!pError && productEntries && productEntries.length > 0) {
        return {
          entries: (productEntries as unknown as SizeChartRow[]).map(
            mapRowToSizeChartEntry,
          ),
          isProductOverride: true,
        };
      }
    }

    // 2. Fall back to standard category defaults (product_id is null)
    const { data: categoryEntries, error: cError } = await supabase
      .from("size_chart_entries")
      .select("*")
      .is("product_id", null)
      .eq("category", category)
      .order("sort_order", { ascending: true });

    if (!cError && categoryEntries && categoryEntries.length > 0) {
      return {
        entries: (categoryEntries as unknown as SizeChartRow[]).map(
          mapRowToSizeChartEntry,
        ),
        isProductOverride: false,
      };
    }
  } catch (error) {
    console.warn(
      "[size-guide] Failed to fetch size chart from database, using defaults:",
      error,
    );
  }

  // 3. Fall back to in-memory defaults
  const fallback = DEFAULT_SIZE_CHART_ENTRIES.filter(
    (e) => e.category === category,
  );
  return {
    entries: fallback,
    isProductOverride: false,
  };
}
