import { describe, expect, it } from "vitest";
import {
  categoryFormSchema,
  updateCategorySchema,
  deleteCategorySchema,
} from "../../apps/admin/src/features/categories/schemas";
import {
  parseCatalogFilters,
} from "../../packages/shared/src/features/catalog/filters";

describe("Admin Category Schemas", () => {
  it("validates a well-formed category payload", () => {
    const valid = {
      slug: "lab-coats",
      name_en: "Lab Coats",
      name_ar: "بالطو طبي",
      description_en: "Premium medical lab coats",
      description_ar: "بالطو طبي عالي الجودة",
      position: 30,
      is_active: "true",
    };

    const result = categoryFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe("lab-coats");
      expect(result.data.name_en).toBe("Lab Coats");
      expect(result.data.name_ar).toBe("بالطو طبي");
      expect(result.data.position).toBe(30);
      expect(result.data.is_active).toBe(true);
    }
  });

  it("rejects invalid slugs with spaces, uppercase or special characters", () => {
    const invalidSlugs = ["Lab Coats", "lab_coats", "lab coats", "lab/coats", ""];
    for (const slug of invalidSlugs) {
      const res = categoryFormSchema.safeParse({
        slug,
        name_en: "Lab Coats",
        name_ar: "بالطو طبي",
      });
      expect(res.success).toBe(false);
    }
  });

  it("requires both English and Arabic names", () => {
    const missingEn = categoryFormSchema.safeParse({
      slug: "accessories",
      name_en: "",
      name_ar: "إكسسوارات",
    });
    expect(missingEn.success).toBe(false);

    const missingAr = categoryFormSchema.safeParse({
      slug: "accessories",
      name_en: "Accessories",
      name_ar: "",
    });
    expect(missingAr.success).toBe(false);
  });

  it("validates update schema requires positive integer ID", () => {
    const validUpdate = updateCategorySchema.safeParse({
      id: 5,
      slug: "unisex-scrubs",
      name_en: "Unisex Scrubs",
      name_ar: "سكراب للجميع",
      position: 10,
      is_active: true,
    });
    expect(validUpdate.success).toBe(true);

    const invalidUpdate = updateCategorySchema.safeParse({
      id: -1,
      slug: "unisex-scrubs",
      name_en: "Unisex Scrubs",
      name_ar: "سكراب للجميع",
    });
    expect(invalidUpdate.success).toBe(false);
  });

  it("validates delete schema requires positive integer ID", () => {
    expect(deleteCategorySchema.safeParse({ id: 12 }).success).toBe(true);
    expect(deleteCategorySchema.safeParse({ id: 0 }).success).toBe(false);
    expect(deleteCategorySchema.safeParse({ id: -4 }).success).toBe(false);
    expect(deleteCategorySchema.safeParse({ id: "abc" }).success).toBe(false);
  });
});

describe("Storefront Dynamic Category Filters", () => {
  it("parses custom category slugs from search params", () => {
    const filters = parseCatalogFilters(
      { category: "lab-coats" },
      new Set(["lab-coats"]),
    );
    expect(filters.category).toBe("lab-coats");
  });

  it("parses standard predefined categories", () => {
    expect(parseCatalogFilters({ category: "women" }).category).toBe("women");
    expect(parseCatalogFilters({ category: "men" }).category).toBe("men");
    expect(parseCatalogFilters({ category: "new" }).category).toBe("new");
  });

  it("ignores malicious or invalid category param strings", () => {
    const filters = parseCatalogFilters({ category: "DROP TABLE categories;--" });
    expect(filters.category).toBeUndefined();
  });
});
