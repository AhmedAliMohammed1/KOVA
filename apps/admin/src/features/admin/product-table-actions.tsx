"use client";

import { useTransition } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  Eye,
  Loader2,
  Pencil,
  RotateCcw,
} from "lucide-react";
import { storefrontUrl } from "@/lib/application-urls";
import type { Locale } from "@/lib/i18n";
import { setProductStatusAction } from "@/features/admin/actions";

export type ProductTableActionsProps = {
  productId: number;
  slug: string;
  title: string;
  status: "draft" | "active" | "scheduled" | "archived";
  locale: Locale;
};

export function ProductTableActions({
  productId,
  slug,
  status,
  locale,
}: ProductTableActionsProps) {
  const ar = locale === "ar";
  const router = useRouter();
  const [isPendingStatus, startStatusTransition] = useTransition();

  const handleStatusChange = (nextStatus: "draft" | "active" | "archived") => {
    startStatusTransition(async () => {
      const formData = new FormData();
      formData.set("locale", locale);
      formData.set("productId", String(productId));
      formData.set("status", nextStatus);
      await setProductStatusAction(formData);
      router.refresh();
    });
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Edit Button */}
        <Link
          href={`/${locale}/admin/products/${productId}/edit` as Route}
          className="inline-flex items-center gap-1.5 border border-[var(--brand-950)] bg-[var(--brand-950)] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-[var(--brand-700)]"
          title={ar ? "تعديل تفاصيل المنتج" : "Edit product details"}
        >
          <Pencil size={11} />
          <span>{ar ? "تعديل" : "Edit"}</span>
        </Link>

        {/* Status Actions */}
        {status !== "active" && (
          <button
            type="button"
            disabled={isPendingStatus}
            onClick={() => handleStatusChange("active")}
            className="inline-flex items-center gap-1 border border-[var(--brand-700)]/30 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50"
          >
            {isPendingStatus ? (
              <Loader2 size={11} className="animate-spin" />
            ) : null}
            <span>{ar ? "نشر" : "Publish"}</span>
          </button>
        )}

        {status === "active" && (
          <button
            type="button"
            disabled={isPendingStatus}
            onClick={() => handleStatusChange("draft")}
            className="inline-flex items-center gap-1 border border-neutral-300 bg-neutral-100 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-700 transition hover:bg-neutral-200 disabled:opacity-50"
          >
            {isPendingStatus ? (
              <Loader2 size={11} className="animate-spin" />
            ) : null}
            <span>{ar ? "إخفاء" : "Unpublish"}</span>
          </button>
        )}

        {status !== "archived" && (
          <button
            type="button"
            disabled={isPendingStatus}
            onClick={() => handleStatusChange("archived")}
            className="inline-flex items-center gap-1 border border-stone-300 bg-stone-100 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-600 transition hover:bg-stone-200 disabled:opacity-50"
            title={ar ? "أرشفة المنتج" : "Archive product"}
          >
            <Archive size={11} />
            <span>{ar ? "أرشفة" : "Archive"}</span>
          </button>
        )}

        {status === "archived" && (
          <button
            type="button"
            disabled={isPendingStatus}
            onClick={() => handleStatusChange("draft")}
            className="inline-flex items-center gap-1 border border-stone-300 bg-stone-100 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-700 transition hover:bg-stone-200 disabled:opacity-50"
            title={ar ? "استعادة كمسودة" : "Restore as draft"}
          >
            <RotateCcw size={11} />
            <span>{ar ? "استعادة" : "Restore"}</span>
          </button>
        )}

        {/* View in Store */}
        {status === "active" && (
          <Link
            href={storefrontUrl(locale, `/products/${slug}`) as Route}
            className="inline-flex items-center gap-1 border border-black/15 bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-700 transition hover:border-black/30 hover:bg-neutral-50"
            target="_blank"
            rel="noopener noreferrer"
            title={ar ? "معاينة في المتجر" : "View in store"}
          >
            <Eye size={11} />
            <span>{ar ? "عرض" : "View"}</span>
          </Link>
        )}

      </div>
    </>
  );
}
