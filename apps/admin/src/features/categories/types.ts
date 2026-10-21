import type { Database } from "@/types/database";

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type CategoryTranslationRow =
  Database["public"]["Tables"]["category_translations"]["Row"];

export type CategoryWithTranslations = CategoryRow & {
  category_translations: CategoryTranslationRow[];
  product_count?: number;
};

export type CategoryFormData = {
  id?: number;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  position: number;
  is_active: boolean;
};
