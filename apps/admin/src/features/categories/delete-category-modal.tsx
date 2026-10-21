"use client";

import { useActionState, useEffect } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { CategoryWithTranslations } from "./types";
import { deleteCategoryAction, type CategoryActionState } from "./actions";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryWithTranslations | null;
  locale: Locale;
  onSuccess: () => void;
}

const initialState: CategoryActionState = {
  status: "idle",
};

export function DeleteCategoryModal({
  isOpen,
  onClose,
  category,
  locale,
  onSuccess,
}: DeleteCategoryModalProps) {
  const ar = locale === "ar";
  const [state, formAction, isPending] = useActionState(
    deleteCategoryAction,
    initialState,
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isPending) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, onClose]);

  useEffect(() => {
    if (state.status === "success") {
      onSuccess();
      onClose();
    }
  }, [state.status, onSuccess, onClose]);

  if (!isOpen || !category) return null;

  const currentTranslation = category.category_translations?.find(
    (t) => t.locale === locale,
  );
  const categoryName =
    currentTranslation?.name ??
    category.category_translations?.[0]?.name ??
    category.slug;

  const hasProducts = Boolean(category.product_count && category.product_count > 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-category-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md rounded-xs border border-red-200 bg-white p-6 shadow-xl sm:p-7">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={20} />
            </span>
            <h2
              id="delete-category-title"
              className="font-serif text-xl font-bold text-[var(--brand-950)]"
            >
              {ar ? "حذف القسم" : "Delete category"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xs p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {state.status === "error" && state.message && (
          <div className="mt-4 rounded-xs border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800">
            {state.message}
          </div>
        )}

        <div className="mt-4 space-y-3 text-xs leading-5 text-[var(--text-muted)]">
          <p>
            {ar ? (
              <>
                هل أنت متأكد من رغبتك في حذف قسم{" "}
                <strong className="text-[var(--text-strong)]">{categoryName}</strong>؟
              </>
            ) : (
              <>
                Are you sure you want to delete the category{" "}
                <strong className="text-[var(--text-strong)]">{categoryName}</strong>?
              </>
            )}
          </p>

          {hasProducts && (
            <div className="rounded-xs border border-amber-300 bg-amber-50 p-3 text-amber-900 font-medium">
              {ar
                ? `تنبيه: يوجد ${category.product_count} منتج مرتبط بهذا القسم. لن يتمكن النظام من حذفه حتى تقوم بإعادة تعيين أو حذف تلك المنتجات أولاً.`
                : `Warning: This category currently has ${category.product_count} product(s) assigned. The system blocks deletion until those products are reassigned or removed.`}
            </div>
          )}
        </div>

        <form action={formAction} className="mt-6 flex items-center justify-end gap-3">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="id" value={category.id} />

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xs border border-[var(--border-control)] px-4 py-2 text-xs font-bold uppercase tracking-[.1em] text-[var(--text-strong)] hover:bg-neutral-50 transition"
          >
            {ar ? "إلغاء" : "Cancel"}
          </button>
          <button
            type="submit"
            disabled={isPending || hasProducts}
            className="inline-flex items-center gap-2 rounded-xs bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-[.1em] text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            {isPending && <Loader2 size={13} className="animate-spin" />}
            {ar ? "تأكيد الحذف" : "Confirm Delete"}
          </button>
        </form>
      </div>
    </div>
  );
}
