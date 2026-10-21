"use client";

import { useActionState, useEffect, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { CategoryWithTranslations } from "./types";
import {
  createCategoryAction,
  updateCategoryAction,
  type CategoryActionState,
} from "./actions";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryWithTranslations | null;
  locale: Locale;
  onSuccess: () => void;
}

const initialState: CategoryActionState = {
  status: "idle",
};

export function CategoryFormModal({
  isOpen,
  onClose,
  category,
  locale,
  onSuccess,
}: CategoryFormModalProps) {
  const ar = locale === "ar";
  const isEditing = Boolean(category);
  const actionToUse = isEditing ? updateCategoryAction : createCategoryAction;

  const [state, formAction, isPending] = useActionState(actionToUse, initialState);
  const modalRef = useRef<HTMLDivElement>(null);
  const slugInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isPending) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, onClose]);

  // Focus management on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        slugInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle successful submit
  useEffect(() => {
    if (state.status === "success") {
      onSuccess();
      onClose();
    }
  }, [state.status, onSuccess, onClose]);

  if (!isOpen) return null;

  const enTranslation = category?.category_translations?.find(
    (t) => t.locale === "en",
  );
  const arTranslation = category?.category_translations?.find(
    (t) => t.locale === "ar",
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xs border border-[var(--border-subtle)] bg-white p-6 shadow-xl sm:p-8"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h2
              id="category-modal-title"
              className="font-serif text-2xl md:text-3xl text-[var(--brand-950)]"
            >
              {isEditing
                ? ar
                  ? "تعديل القسم"
                  : "Edit category"
                : ar
                  ? "إضافة قسم جديد"
                  : "Add new category"}
            </h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {ar
                ? "أدخل تفاصيل القسم باللغتين العربية والإنجليزية."
                : "Enter category specifications in both English and Arabic."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xs p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
            aria-label={ar ? "إغلاق" : "Close"}
          >
            <X size={20} />
          </button>
        </div>

        {/* Global Error Message */}
        {state.status === "error" && state.message && (
          <div className="mt-4 rounded-xs border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-800">
            {state.message}
          </div>
        )}

        <form action={formAction} className="mt-6 space-y-5">
          <input type="hidden" name="locale" value={locale} />
          {isEditing && category && (
            <input type="hidden" name="id" value={category.id} />
          )}

          {/* Slug */}
          <div>
            <label
              htmlFor="category-slug"
              className="block text-[11px] font-bold uppercase tracking-[.14em] text-[var(--text-strong)]"
            >
              {ar ? "المعرّف (Slug)" : "URL Slug"}
              <span className="text-red-500 ms-1">*</span>
            </label>
            <input
              ref={slugInputRef}
              id="category-slug"
              name="slug"
              type="text"
              required
              defaultValue={category?.slug ?? ""}
              placeholder="e.g. scrub-sets, lab-coats, accessories"
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              className="mt-2 block w-full rounded-xs border border-[var(--border-control)] bg-white px-3.5 py-2.5 text-xs text-[var(--text-strong)] outline-hidden transition focus:border-[var(--brand-700)] focus:ring-2 focus:ring-[var(--brand-700)]/20"
            />
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">
              {ar
                ? "أحرف إنجليزية صغيرة وأرقام وشرطات فقط بدون مسافات."
                : "Lowercase letters, numbers, and hyphens only (e.g. lab-coats)."}
            </p>
            {state.fieldErrors?.slug && (
              <p className="mt-1 text-xs font-semibold text-red-600">
                {state.fieldErrors.slug[0]}
              </p>
            )}
          </div>

          {/* Bilingual Names */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category-name-en"
                className="block text-[11px] font-bold uppercase tracking-[.14em] text-[var(--text-strong)]"
              >
                {ar ? "الاسم بالإنجليزية" : "English Name"}
                <span className="text-red-500 ms-1">*</span>
              </label>
              <input
                id="category-name-en"
                name="name_en"
                type="text"
                required
                defaultValue={enTranslation?.name ?? ""}
                placeholder="e.g. Medical Scrubs"
                className="mt-2 block w-full rounded-xs border border-[var(--border-control)] bg-white px-3.5 py-2.5 text-xs text-[var(--text-strong)] outline-hidden transition focus:border-[var(--brand-700)] focus:ring-2 focus:ring-[var(--brand-700)]/20"
              />
              {state.fieldErrors?.name_en && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {state.fieldErrors.name_en[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category-name-ar"
                className="block text-[11px] font-bold uppercase tracking-[.14em] text-[var(--text-strong)]"
              >
                {ar ? "الاسم بالعربية" : "Arabic Name"}
                <span className="text-red-500 ms-1">*</span>
              </label>
              <input
                id="category-name-ar"
                name="name_ar"
                type="text"
                required
                dir="rtl"
                defaultValue={arTranslation?.name ?? ""}
                placeholder="مثال: سكراب طبي"
                className="mt-2 block w-full rounded-xs border border-[var(--border-control)] bg-white px-3.5 py-2.5 text-xs text-[var(--text-strong)] outline-hidden transition focus:border-[var(--brand-700)] focus:ring-2 focus:ring-[var(--brand-700)]/20"
              />
              {state.fieldErrors?.name_ar && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {state.fieldErrors.name_ar[0]}
                </p>
              )}
            </div>
          </div>

          {/* Bilingual Descriptions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category-desc-en"
                className="block text-[11px] font-bold uppercase tracking-[.14em] text-[var(--text-strong)]"
              >
                {ar ? "الوصف بالإنجليزية (اختياري)" : "English Description"}
              </label>
              <textarea
                id="category-desc-en"
                name="description_en"
                rows={3}
                defaultValue={enTranslation?.description ?? ""}
                placeholder="Optional category summary..."
                className="mt-2 block w-full rounded-xs border border-[var(--border-control)] bg-white px-3.5 py-2 text-xs text-[var(--text-strong)] outline-hidden transition focus:border-[var(--brand-700)] focus:ring-2 focus:ring-[var(--brand-700)]/20"
              />
            </div>

            <div>
              <label
                htmlFor="category-desc-ar"
                className="block text-[11px] font-bold uppercase tracking-[.14em] text-[var(--text-strong)]"
              >
                {ar ? "الوصف بالعربية (اختياري)" : "Arabic Description"}
              </label>
              <textarea
                id="category-desc-ar"
                name="description_ar"
                rows={3}
                dir="rtl"
                defaultValue={arTranslation?.description ?? ""}
                placeholder="نبذة اختيارية عن القسم..."
                className="mt-2 block w-full rounded-xs border border-[var(--border-control)] bg-white px-3.5 py-2 text-xs text-[var(--text-strong)] outline-hidden transition focus:border-[var(--brand-700)] focus:ring-2 focus:ring-[var(--brand-700)]/20"
              />
            </div>
          </div>

          {/* Position & Active Status */}
          <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-[var(--border-subtle)]">
            <div>
              <label
                htmlFor="category-position"
                className="block text-[11px] font-bold uppercase tracking-[.14em] text-[var(--text-strong)]"
              >
                {ar ? "ترتيب الظهور" : "Display Position"}
              </label>
              <input
                id="category-position"
                name="position"
                type="number"
                min={0}
                defaultValue={category?.position ?? 0}
                className="mt-2 block w-full rounded-xs border border-[var(--border-control)] bg-white px-3.5 py-2.5 text-xs text-[var(--text-strong)] outline-hidden transition focus:border-[var(--brand-700)] focus:ring-2 focus:ring-[var(--brand-700)]/20"
              />
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                {ar ? "الأرقام الأصغر تظهر أولاً." : "Lower numbers appear first."}
              </p>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={category ? category.is_active : true}
                  className="size-4.5 rounded-xs border-[var(--border-control)] text-[var(--brand-700)] focus:ring-[var(--brand-700)]"
                />
                <span className="text-xs font-semibold text-[var(--text-strong)]">
                  {ar ? "تفعيل القسم في المتجر" : "Active on storefront"}
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xs border border-[var(--border-control)] px-4 py-2.5 text-xs font-bold uppercase tracking-[.1em] text-[var(--text-strong)] hover:bg-neutral-50 transition"
            >
              {ar ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xs bg-[var(--brand-950)] px-5 py-2.5 text-xs font-bold uppercase tracking-[.14em] text-white hover:bg-[var(--brand-800)] transition focus:ring-2 focus:ring-[var(--brand-700)] focus:ring-offset-2 disabled:opacity-50"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isEditing
                ? ar
                  ? "حفظ التعديلات"
                  : "Save Changes"
                : ar
                  ? "إنشاء القسم"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
