import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRoles } from "@/server/auth/roles";
import type { SizeCategory, SizeChartEntry, SizeChartRow } from "@/features/catalog/size-guide-types";
import { mapRowToSizeChartEntry, DEFAULT_SIZE_CHART_ENTRIES } from "@/features/catalog/size-guide";
export type AdminSizeChartOverview = {
  categoryDefaults: Record<SizeCategory, SizeChartEntry[]>;
  productOverrides: {
    productId: number;
    productSlug: string;
    productTitleEn: string;
    productTitleAr: string;
    category: SizeCategory;
    entries: SizeChartEntry[];
  }[];
  allProducts: {
    id: number;
    slug: string;
    gender: string | null;
    titleEn: string;
    titleAr: string;
    hasOverride: boolean;
  }[];
};

export async function getAdminSizeChartOverview(): Promise<AdminSizeChartOverview> {
  await requireRoles(["product_manager", "admin", "super_admin"]);
  const admin = createAdminClient();

  const [entriesResult, productsResult] = await Promise.all([
    admin
      .from("size_chart_entries")
      .select("*")
      .order("category")
      .order("sort_order"),
    admin
      .from("products")
      .select("id, slug, gender, product_translations(locale, title)")
      .eq("status", "active")
      .order("id"),
  ]);

  const rawEntries = (entriesResult.data ?? []) as unknown as SizeChartRow[];
  const allEntries = rawEntries.map(mapRowToSizeChartEntry);

  const categoryDefaults: Record<SizeCategory, SizeChartEntry[]> = {
    women: allEntries.filter((e) => e.productId === null && e.category === "women"),
    men: allEntries.filter((e) => e.productId === null && e.category === "men"),
    unisex: allEntries.filter((e) => e.productId === null && e.category === "unisex"),
  };

  // If DB category entries were empty for some reason, fill from default
  for (const cat of ["women", "men", "unisex"] as SizeCategory[]) {
    if (categoryDefaults[cat].length === 0) {
      categoryDefaults[cat] = DEFAULT_SIZE_CHART_ENTRIES.filter(
        (e) => e.category === cat,
      );
    }
  }

  type ProductRow = {
    id: number;
    slug: string;
    gender: string | null;
    product_translations: { locale: string; title: string }[];
  };
  const products = (productsResult.data ?? []) as unknown as ProductRow[];

  const productOverridesMap = new Map<number, SizeChartEntry[]>();
  for (const entry of allEntries) {
    if (entry.productId !== null) {
      const existing = productOverridesMap.get(entry.productId) ?? [];
      existing.push(entry);
      productOverridesMap.set(entry.productId, existing);
    }
  }

  const productOverrides: AdminSizeChartOverview["productOverrides"] = [];
  const allProductsList: AdminSizeChartOverview["allProducts"] = [];

  for (const p of products) {
    const titleEn =
      p.product_translations.find((t) => t.locale === "en")?.title ?? p.slug;
    const titleAr =
      p.product_translations.find((t) => t.locale === "ar")?.title ?? titleEn;
    const hasOverride = productOverridesMap.has(p.id);

    allProductsList.push({
      id: p.id,
      slug: p.slug,
      gender: p.gender,
      titleEn,
      titleAr,
      hasOverride,
    });

    if (hasOverride) {
      const entries = productOverridesMap.get(p.id)!;
      productOverrides.push({
        productId: p.id,
        productSlug: p.slug,
        productTitleEn: titleEn,
        productTitleAr: titleAr,
        category: (p.gender as SizeCategory) || "unisex",
        entries: entries.sort((a, b) => a.sortOrder - b.sortOrder),
      });
    }
  }

  return {
    categoryDefaults,
    productOverrides,
    allProducts: allProductsList,
  };
}
