"use client";

import { useState, useTransition } from "react";
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { CategoryWithTranslations } from "./types";
import { CategoryFormModal } from "./category-form-modal";
import { DeleteCategoryModal } from "./delete-category-modal";
import { toggleCategoryActiveAction } from "./actions";

interface AdminCategoriesManagerProps {
  initialCategories: CategoryWithTranslations[];
  locale: Locale;
}

export function AdminCategoriesManager({
  initialCategories,
  locale,
}: AdminCategoriesManagerProps) {
  const ar = locale === "ar";
  const [categories, setCategories] = useState<CategoryWithTranslations[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithTranslations | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryWithTranslations | null>(null);

  const [isPending, startTransition] = useTransition();

  // Filtered categories
  const filteredCategories = categories.filter((cat) => {
    const enName = cat.category_translations?.find((t) => t.locale === "en")?.name ?? "";
    const arName = cat.category_translations?.find((t) => t.locale === "ar")?.name ?? "";
    const matchesSearch =
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      arName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? cat.is_active
          : !cat.is_active;

    return matchesSearch && matchesStatus;
  });

  const totalCategories = categories.length;
  const activeCount = categories.filter((c) => c.is_active).length;
  const inactiveCount = totalCategories - activeCount;
  const totalAssignedProducts = categories.reduce((sum, c) => sum + (c.product_count ?? 0), 0);

  const handleToggleActive = (cat: CategoryWithTranslations) => {
    startTransition(async () => {
      // Optimistic update
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, is_active: !c.is_active } : c)),
      );

      const res = await toggleCategoryActiveAction(cat.id, cat.is_active, locale);
      if (res.status === "error") {
        // Rollback
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, is_active: cat.is_active } : c)),
        );
        setFeedback({ type: "error", text: res.message || "Failed to toggle status." });
      } else {
        setFeedback({ type: "success", text: res.message || "Status updated." });
      }
    });
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryWithTranslations) => {
    setEditingCategory(cat);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (cat: CategoryWithTranslations) => {
    setDeletingCategory(cat);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center justify-between rounded-xs border p-4 text-xs font-semibold animate-in fade-in duration-150 ${
            feedback.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border-red-300 bg-red-50 text-red-900"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-neutral-500 hover:text-neutral-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xs border border-[var(--border-subtle)] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-[.14em]">
              {ar ? "إجمالي الأقسام" : "Total Categories"}
            </span>
            <FolderTree size={16} className="text-[var(--brand-700)]" />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-[var(--brand-950)]">
            {totalCategories}
          </p>
        </div>

        <div className="rounded-xs border border-[var(--border-subtle)] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-[.14em]">
              {ar ? "الأقسام النشطة" : "Active On Store"}
            </span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-emerald-700">
            {activeCount}
          </p>
        </div>

        <div className="rounded-xs border border-[var(--border-subtle)] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-[.14em]">
              {ar ? "الأقسام المعطلة" : "Inactive Categories"}
            </span>
            <XCircle size={16} className="text-neutral-400" />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-neutral-600">
            {inactiveCount}
          </p>
        </div>

        <div className="rounded-xs border border-[var(--border-subtle)] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-[.14em]">
              {ar ? "المنتجات المصنفة" : "Classified Products"}
            </span>
            <Package size={16} className="text-[var(--brand-700)]" />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-[var(--brand-950)]">
            {totalAssignedProducts}
          </p>
        </div>
      </div>

      {/* Control Bar: Search + Filters + Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border-subtle)] pb-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search
              size={15}
              className="absolute top-1/2 -translate-y-1/2 start-3.5 text-neutral-400 pointer-events-none"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ar ? "بحث بالاسم أو المعرف..." : "Search by name or slug..."}
              className="h-10 w-full rounded-xs border border-[var(--border-control)] bg-white pe-3.5 ps-9 text-xs text-[var(--text-strong)] outline-hidden transition focus:border-[var(--brand-700)] focus:ring-2 focus:ring-[var(--brand-700)]/20"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center rounded-xs border border-[var(--border-subtle)] bg-white p-0.5 text-xs font-semibold">
            {(["all", "active", "inactive"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`rounded-xs px-3 py-1.5 transition ${
                  statusFilter === filter
                    ? "bg-[var(--brand-950)] text-white shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-strong)]"
                }`}
              >
                {filter === "all"
                  ? ar
                    ? "الكل"
                    : "All"
                  : filter === "active"
                    ? ar
                      ? "النشطة"
                      : "Active"
                    : ar
                      ? "المعطلة"
                      : "Inactive"}
              </button>
            ))}
          </div>
        </div>

        {/* Add Category Action */}
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xs bg-[var(--brand-950)] px-4 py-2.5 text-xs font-bold uppercase tracking-[.12em] text-white hover:bg-[var(--brand-800)] transition focus:ring-2 focus:ring-[var(--brand-700)] shadow-xs"
        >
          <Plus size={16} />
          {ar ? "إضافة قسم جديد" : "Add Category"}
        </button>
      </div>

      {/* Categories Table */}
      <div className="rounded-xs border border-[var(--border-subtle)] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] text-[10px] font-bold uppercase tracking-[.14em] text-[var(--text-muted)]">
                <th className="px-4 py-3.5 text-start w-16">{ar ? "الترتيب" : "Pos"}</th>
                <th className="px-4 py-3.5 text-start">{ar ? "الاسم" : "Name"}</th>
                <th className="px-4 py-3.5 text-start">{ar ? "المعرّف (Slug)" : "Slug"}</th>
                <th className="px-4 py-3.5 text-center">{ar ? "المنتجات" : "Products"}</th>
                <th className="px-4 py-3.5 text-center">{ar ? "الحالة" : "Status"}</th>
                <th className="px-4 py-3.5 text-end">{ar ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-neutral-500">
                    <Layers size={32} className="mx-auto text-neutral-300 mb-2" />
                    <p className="font-semibold text-sm">
                      {ar ? "لم يتم العثور على أي أقسام." : "No categories found."}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {searchQuery
                        ? ar
                          ? "جرّب تغيير عبارة البحث."
                          : "Try adjusting your search criteria."
                        : ar
                          ? "ابدأ بإنشاء أول قسم جديد بالضغط على الزر أعلاه."
                          : "Start by creating a new category with the button above."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  const enName =
                    cat.category_translations?.find((t) => t.locale === "en")?.name ?? "—";
                  const arName =
                    cat.category_translations?.find((t) => t.locale === "ar")?.name ?? "—";
                  const primaryName = ar ? arName : enName;
                  const secondaryName = ar ? enName : arName;

                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-neutral-50/70 transition-colors"
                    >
                      {/* Position */}
                      <td className="px-4 py-4 font-mono text-[11px] text-neutral-500">
                        #{cat.position}
                      </td>

                      {/* Name */}
                      <td className="px-4 py-4">
                        <div className="font-bold text-sm text-[var(--brand-950)]">
                          {primaryName}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                          {secondaryName}
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-4 py-4 font-mono text-xs">
                        <code className="rounded-xs bg-neutral-100 px-2 py-0.5 text-neutral-700">
                          {cat.slug}
                        </code>
                      </td>

                      {/* Products Count */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">
                          <Package size={12} />
                          {cat.product_count ?? 0}
                        </span>
                      </td>

                      {/* Active Toggle */}
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(cat)}
                          disabled={isPending}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                            cat.is_active
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                          }`}
                          title={
                            cat.is_active
                              ? ar
                                ? "انقر للتعطيل"
                                : "Click to deactivate"
                              : ar
                                ? "انقر للتفعيل"
                                : "Click to activate"
                          }
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              cat.is_active ? "bg-emerald-600" : "bg-neutral-400"
                            }`}
                          />
                          {cat.is_active
                            ? ar
                              ? "نشط"
                              : "Active"
                            : ar
                              ? "معطل"
                              : "Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-end">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(cat)}
                            className="rounded-xs p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-[var(--brand-700)] transition"
                            title={ar ? "تعديل" : "Edit"}
                            aria-label={`${ar ? "تعديل" : "Edit"} ${primaryName}`}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(cat)}
                            className="rounded-xs p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition"
                            title={ar ? "حذف" : "Delete"}
                            aria-label={`${ar ? "حذف" : "Delete"} ${primaryName}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CategoryFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        category={editingCategory}
        locale={locale}
        onSuccess={() => {
          setFeedback({
            type: "success",
            text: editingCategory
              ? ar
                ? "تم تحديث القسم بنجاح."
                : "Category updated successfully."
              : ar
                ? "تم إنشاء القسم بنجاح."
                : "Category created successfully.",
          });
        }}
      />

      <DeleteCategoryModal
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        category={deletingCategory}
        locale={locale}
        onSuccess={() => {
          if (deletingCategory) {
            setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
          }
          setFeedback({
            type: "success",
            text: ar ? "تم حذف القسم بنجاح." : "Category deleted successfully.",
          });
        }}
      />
    </div>
  );
}
