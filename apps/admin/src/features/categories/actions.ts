"use server";

import { revalidatePath } from "@/lib/revalidate-storefront";
import { requireRoles } from "@/server/auth/roles";
import type { Locale } from "@/lib/i18n";
import {
  categoryFormSchema,
  updateCategorySchema,
  deleteCategorySchema,
} from "./schemas";

export type CategoryActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

function message(locale: Locale, en: string, ar: string) {
  return locale === "ar" ? ar : en;
}

function revalidateCategoryPaths(locale: Locale) {
  revalidatePath(`/${locale}/admin/categories`);
  revalidatePath(`/${locale}/admin`);
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/shop`);
  // Also invalidate alternate locale
  const otherLocale = locale === "ar" ? "en" : "ar";
  revalidatePath(`/${otherLocale}/admin/categories`);
  revalidatePath(`/${otherLocale}/admin`);
  revalidatePath(`/${otherLocale}`);
  revalidatePath(`/${otherLocale}/shop`);
}

export async function createCategoryAction(
  _state: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const raw = Object.fromEntries(formData);
  const locale: Locale = raw.locale === "ar" ? "ar" : "en";

  const parsed = categoryFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: message(
        locale,
        "Please check the highlighted category fields.",
        "يرجى مراجعة بيانات القسم المحددة.",
      ),
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { slug, name_en, name_ar, description_en, description_ar, position, is_active } =
    parsed.data;

  try {
    const { supabase } = await requireRoles([
      "product_manager",
      "admin",
      "super_admin",
    ]);

    // Check slug uniqueness
    const { data: existing, error: checkError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (checkError) {
      console.error("[category-action] Failed to check slug", checkError);
      return {
        status: "error",
        message: message(
          locale,
          "Database error checking category slug.",
          "خطأ في التحقق من معرف القسم.",
        ),
      };
    }

    if (existing) {
      return {
        status: "error",
        message: message(
          locale,
          `A category with slug "${slug}" already exists.`,
          `يوجد قسم آخر بنفس المعرف "${slug}".`,
        ),
        fieldErrors: { slug: [locale === "ar" ? "المعرف مستخدم بالفعل" : "Slug is already in use"] },
      };
    }

    // 1. Insert into categories
    const { data: newCategory, error: insertError } = await supabase
      .from("categories")
      .insert({
        slug,
        position,
        is_active,
      })
      .select("id")
      .single();

    if (insertError || !newCategory) {
      console.error("[category-action] Failed to insert category", insertError);
      return {
        status: "error",
        message: message(
          locale,
          insertError?.message || "Failed to create category.",
          "فشل في إنشاء القسم.",
        ),
      };
    }

    // 2. Insert translations for 'en' and 'ar'
    const translations = [
      {
        category_id: newCategory.id,
        locale: "en",
        name: name_en,
        description: description_en?.trim() || null,
      },
      {
        category_id: newCategory.id,
        locale: "ar",
        name: name_ar,
        description: description_ar?.trim() || null,
      },
    ];

    const { error: transError } = await supabase
      .from("category_translations")
      .insert(translations);

    if (transError) {
      console.error("[category-action] Failed to insert translations", transError);
      // Attempt cleanup of orphaned category
      await supabase.from("categories").delete().eq("id", newCategory.id);
      return {
        status: "error",
        message: message(
          locale,
          "Failed to save category translations.",
          "فشل في حفظ ترجمات القسم.",
        ),
      };
    }

    revalidateCategoryPaths(locale);

    return {
      status: "success",
      message: message(
        locale,
        `Category "${name_en}" created successfully.`,
        `تم إنشاء قسم "${name_ar}" بنجاح.`,
      ),
    };
  } catch (error) {
    console.error("[category-action] Unexpected error in createCategoryAction", error);
    return {
      status: "error",
      message: message(
        locale,
        "An unexpected error occurred while creating the category.",
        "حدث خطأ غير متوقع أثناء إنشاء القسم.",
      ),
    };
  }
}

export async function updateCategoryAction(
  _state: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const raw = Object.fromEntries(formData);
  const locale: Locale = raw.locale === "ar" ? "ar" : "en";

  const parsed = updateCategorySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: message(
        locale,
        "Please check the highlighted category fields.",
        "يرجى مراجعة بيانات القسم المحددة.",
      ),
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { id, slug, name_en, name_ar, description_en, description_ar, position, is_active } =
    parsed.data;

  try {
    const { supabase } = await requireRoles([
      "product_manager",
      "admin",
      "super_admin",
    ]);

    // Check slug uniqueness excluding self
    const { data: existing, error: checkError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .maybeSingle();

    if (checkError) {
      console.error("[category-action] Failed to check slug", checkError);
      return {
        status: "error",
        message: message(
          locale,
          "Database error checking category slug.",
          "خطأ في التحقق من معرف القسم.",
        ),
      };
    }

    if (existing) {
      return {
        status: "error",
        message: message(
          locale,
          `A category with slug "${slug}" already exists.`,
          `يوجد قسم آخر بنفس المعرف "${slug}".`,
        ),
        fieldErrors: { slug: [locale === "ar" ? "المعرف مستخدم بالفعل" : "Slug is already in use"] },
      };
    }

    // 1. Update categories row
    const { error: updateError } = await supabase
      .from("categories")
      .update({
        slug,
        position,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("[category-action] Failed to update category", updateError);
      return {
        status: "error",
        message: message(
          locale,
          updateError.message || "Failed to update category.",
          "فشل في تحديث بيانات القسم.",
        ),
      };
    }

    // 2. Upsert translations for en & ar
    const { error: enError } = await supabase
      .from("category_translations")
      .upsert(
        {
          category_id: id,
          locale: "en",
          name: name_en,
          description: description_en?.trim() || null,
        },
        { onConflict: "category_id,locale" },
      );

    const { error: arError } = await supabase
      .from("category_translations")
      .upsert(
        {
          category_id: id,
          locale: "ar",
          name: name_ar,
          description: description_ar?.trim() || null,
        },
        { onConflict: "category_id,locale" },
      );

    if (enError || arError) {
      console.error("[category-action] Translation upsert failed", { enError, arError });
      return {
        status: "error",
        message: message(
          locale,
          "Failed to update category translations.",
          "فشل في تحديث ترجمات القسم.",
        ),
      };
    }

    revalidateCategoryPaths(locale);

    return {
      status: "success",
      message: message(
        locale,
        `Category "${name_en}" updated successfully.`,
        `تم تحديث قسم "${name_ar}" بنجاح.`,
      ),
    };
  } catch (error) {
    console.error("[category-action] Unexpected error in updateCategoryAction", error);
    return {
      status: "error",
      message: message(
        locale,
        "An unexpected error occurred while updating the category.",
        "حدث خطأ غير متوقع أثناء تحديث القسم.",
      ),
    };
  }
}

export async function deleteCategoryAction(
  _state: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const raw = Object.fromEntries(formData);
  const locale: Locale = raw.locale === "ar" ? "ar" : "en";

  const parsed = deleteCategorySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: message(locale, "Invalid category ID.", "معرف القسم غير صحيح."),
    };
  }

  const { id } = parsed.data;

  try {
    const { supabase } = await requireRoles([
      "product_manager",
      "admin",
      "super_admin",
    ]);

    // Check if category has any products assigned
    const { count, error: countError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (countError) {
      console.error("[category-action] Failed to check product relations", countError);
      return {
        status: "error",
        message: message(
          locale,
          "Failed to verify category usage.",
          "فشل في التحقق من ارتباطات القسم.",
        ),
      };
    }

    if (count && count > 0) {
      return {
        status: "error",
        message: message(
          locale,
          `Cannot delete this category because ${count} product(s) are assigned to it. Please reassign or delete them first.`,
          `لا يمكن حذف هذا القسم لأنه مرتبط بعدد ${count} من المنتجات. يرجى نقلها أو حذفها أولاً.`,
        ),
      };
    }

    // Delete category
    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[category-action] Failed to delete category", deleteError);
      return {
        status: "error",
        message: message(
          locale,
          deleteError.message || "Failed to delete category.",
          "فشل في حذف القسم.",
        ),
      };
    }

    revalidateCategoryPaths(locale);

    return {
      status: "success",
      message: message(
        locale,
        "Category deleted successfully.",
        "تم حذف القسم بنجاح.",
      ),
    };
  } catch (error) {
    console.error("[category-action] Unexpected error in deleteCategoryAction", error);
    return {
      status: "error",
      message: message(
        locale,
        "An unexpected error occurred while deleting the category.",
        "حدث خطأ غير متوقع أثناء حذف القسم.",
      ),
    };
  }
}

export async function toggleCategoryActiveAction(
  id: number,
  currentActive: boolean,
  locale: Locale,
): Promise<CategoryActionState> {
  try {
    const { supabase } = await requireRoles([
      "product_manager",
      "admin",
      "super_admin",
    ]);

    const { error } = await supabase
      .from("categories")
      .update({
        is_active: !currentActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("[category-action] Failed to toggle active status", error);
      return {
        status: "error",
        message: message(
          locale,
          "Failed to update category status.",
          "فشل في تحديث حالة القسم.",
        ),
      };
    }

    revalidateCategoryPaths(locale);

    return {
      status: "success",
      message: message(
        locale,
        `Category marked as ${!currentActive ? "active" : "inactive"}.`,
        `تم تغيير حالة القسم إلى ${!currentActive ? "نشط" : "معطل"}.`,
      ),
    };
  } catch (error) {
    console.error("[category-action] Unexpected error in toggleCategoryActiveAction", error);
    return {
      status: "error",
      message: message(
        locale,
        "Failed to update category status.",
        "فشل في تحديث حالة القسم.",
      ),
    };
  }
}
