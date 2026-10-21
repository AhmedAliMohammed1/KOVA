import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgePercent,
  LayoutDashboard,
  Package,
  Ruler,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { isLocale } from "@/lib/i18n";
import { requireRoles } from "@/server/auth/roles";
import { getAllCategoriesWithCounts } from "@/features/categories/repository";
import { AdminCategoriesManager } from "@/features/categories/admin-categories-manager";

export const metadata: Metadata = {
  title: "Categories Management | KOVA Scrubs Admin",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { supabase } = await requireRoles([
    "product_manager",
    "admin",
    "super_admin",
  ]);

  const categories = await getAllCategoriesWithCounts(supabase);
  const ar = locale === "ar";

  return (
    <main className="min-h-screen bg-[var(--surface-canvas)]">
      {/* Admin Header */}
      <section className="border-b border-white/10 bg-[var(--brand-950)] text-white">
        <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-10 md:py-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-[var(--brand-highlight)]">
                KOVA SCRUBS · CATALOG TAXONOMY
              </p>
              <h1 className="mt-3 font-serif text-5xl md:text-7xl">
                {ar ? "إدارة الأقسام والتصنيفات" : "Category Management"}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
                {ar
                  ? "أنشئ وخصص أقسام المتجر الطبية، وتحكم في معرفاتها وترتيب ظهورها وحالة تفعيلها في واجهة المتجر واستمارات المنتجات."
                  : "Create and customize medical scrub catalog categories, configure bilingual naming, URL slugs, display ordering, and visibility across storefront and product editors."}
              </p>
            </div>

            {/* Cross-admin navigation links */}
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/${locale}/admin` as Route}
                className="border border-white/25 px-4 py-3 text-[10px] font-bold uppercase tracking-[.14em] hover:bg-white/10 transition"
              >
                <span className="flex items-center gap-1.5">
                  <LayoutDashboard size={13} />
                  {ar ? "الرئيسية" : "Overview"}
                </span>
              </Link>
              <Link
                href={`/${locale}/admin#products` as Route}
                className="border border-white/25 px-4 py-3 text-[10px] font-bold uppercase tracking-[.14em] hover:bg-white/10 transition"
              >
                <span className="flex items-center gap-1.5">
                  <Package size={13} />
                  {ar ? "المنتجات" : "Products"}
                </span>
              </Link>
              <Link
                href={`/${locale}/admin/discounts` as Route}
                className="border border-white/25 px-4 py-3 text-[10px] font-bold uppercase tracking-[.14em] hover:bg-white/10 transition"
              >
                <span className="flex items-center gap-1.5">
                  <BadgePercent size={13} />
                  {ar ? "الخصومات" : "Discounts"}
                </span>
              </Link>
              <Link
                href={`/${locale}/admin/sizes` as Route}
                className="border border-white/25 px-4 py-3 text-[10px] font-bold uppercase tracking-[.14em] hover:bg-white/10 transition"
              >
                <span className="flex items-center gap-1.5">
                  <Ruler size={13} />
                  {ar ? "المقاسات" : "Sizes"}
                </span>
              </Link>
              <Link
                href={`/${locale}/admin/shipping` as Route}
                className="border border-white/25 px-4 py-3 text-[10px] font-bold uppercase tracking-[.14em] hover:bg-white/10 transition"
              >
                <span className="flex items-center gap-1.5">
                  <Truck size={13} />
                  {ar ? "التوصيل" : "Delivery"}
                </span>
              </Link>
              <Link
                href={`/${locale}/admin/orders` as Route}
                className="border border-white/25 px-4 py-3 text-[10px] font-bold uppercase tracking-[.14em] hover:bg-white/10 transition"
              >
                <span className="flex items-center gap-1.5">
                  <ShoppingBag size={13} />
                  {ar ? "الطلبات" : "Orders"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Shell */}
      <div className="mx-auto max-w-[1600px] px-5 py-8 md:px-10 md:py-10">
        <AdminCategoriesManager initialCategories={categories} locale={locale} />
      </div>
    </main>
  );
}
