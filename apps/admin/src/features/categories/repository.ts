import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { CategoryWithTranslations } from "./types";

export async function getAllCategoriesWithCounts(
  supabase: SupabaseClient<Database>,
): Promise<CategoryWithTranslations[]> {
  const { data: categories, error } = await supabase
    .from("categories")
    .select(`
      id,
      slug,
      parent_id,
      position,
      is_active,
      created_at,
      updated_at,
      category_translations(
        category_id,
        locale,
        name,
        description,
        seo_title,
        seo_description
      )
    `)
    .order("position", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("[categories-repo] Failed to fetch categories", error);
    throw new Error(`Failed to load categories: ${error.message}`);
  }

  // Count active/total products assigned to each category
  const { data: productsData, error: countError } = await supabase
    .from("products")
    .select("category_id");

  const productCounts = new Map<number, number>();
  if (!countError && productsData) {
    for (const p of productsData) {
      if (p.category_id !== null) {
        productCounts.set(
          p.category_id,
          (productCounts.get(p.category_id) ?? 0) + 1,
        );
      }
    }
  }

  return ((categories as CategoryWithTranslations[]) ?? []).map((cat) => ({
    ...cat,
    product_count: productCounts.get(cat.id) ?? 0,
  }));
}
