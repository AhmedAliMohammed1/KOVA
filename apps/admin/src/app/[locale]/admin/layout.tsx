import type { Route } from "next";
import Link from "next/link";
import {
  BadgePercent,
  FolderTree,
  ImageIcon,
  LayoutDashboard,
  MessageSquareText,
  Package,
  Ruler,
  ShoppingBag,
  ShieldCheck,
  TrendingUp,
  Truck,
} from "lucide-react";
import { notFound } from "next/navigation";
import { storefrontUrl } from "@/lib/application-urls";
import { requireRoles } from "@/server/auth/roles";
import { isLocale } from "@/lib/i18n";
import { signOutAction } from "@/features/auth/actions";
import { canManageUserRoles } from "@/server/auth/policy";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { roles } = await requireRoles(["support", "warehouse", "content_editor", "product_manager", "analyst", "admin", "super_admin"]);
  const elevated = roles.includes("admin") || roles.includes("super_admin");
  const ar = locale === "ar";
  const items = ([
    [LayoutDashboard, ar ? "الرئيسية" : "Overview", `/${locale}/admin`],
    [ShoppingBag, ar ? "الطلبات" : "Orders", `/${locale}/admin/orders`],
    [MessageSquareText, ar ? "التقييمات" : "Reviews", `/${locale}/admin/reviews`],
    [Package, ar ? "المنتجات" : "Products", `/${locale}/admin#products`],
    [FolderTree, ar ? "الأقسام" : "Categories", `/${locale}/admin/categories`],
    [Truck, ar ? "الشحن" : "Shipping", `/${locale}/admin/shipping`],
    [BadgePercent, ar ? "الخصومات" : "Discounts", `/${locale}/admin/discounts`],
    [
      TrendingUp,
      ar ? "النمو التجاري" : "Commercial",
      `/${locale}/admin/commercial`,
    ],
    [ImageIcon, ar ? "المحتوى" : "Content", `/${locale}/admin/banners`],
    [Ruler, ar ? "المقاسات" : "Sizes", `/${locale}/admin/sizes`],
    ...(canManageUserRoles(roles) ? [[ShieldCheck, ar ? "صلاحيات المستخدمين" : "User roles", `/${locale}/admin/users`] as const] : []),
  ] as const).filter((item) => elevated || item[2].endsWith("/commercial") || (item[2].endsWith("/orders") && roles.some(role => ["support", "warehouse"].includes(role))) || (item[2].endsWith("/reviews") && roles.some(role => ["content_editor", "product_manager"].includes(role))) || (item[2].endsWith("/categories") && roles.includes("product_manager")) || (item[2].includes("#products") && roles.includes("product_manager")));
  return (
    <div className="min-h-screen bg-[var(--surface-canvas)]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--brand-950)] text-white shadow-sm">
        <div className="mx-auto flex min-h-14 max-w-[1600px] items-center justify-between gap-4 px-4 md:px-8 lg:min-h-16 lg:justify-start lg:gap-5">
          <Link
            href={`/${locale}/admin${elevated ? "" : "/commercial"}` as Route}
            className="flex min-h-11 shrink-0 items-center text-sm font-black tracking-[-.04em] lg:border-e lg:border-white/15 lg:pe-5"
          >
            KOVA <span className="ms-1 font-light text-[var(--brand-highlight)]">SCRUBS</span>
            <span className="ms-2 text-[9px] font-semibold uppercase tracking-[.14em] text-white/50">
              Admin
            </span>
          </Link>
          <nav
            className="hidden min-h-16 min-w-0 flex-1 items-stretch overflow-x-auto lg:flex"
            aria-label={ar ? "تنقل لوحة الإدارة" : "Admin navigation"}
          >
            {items.map(([Icon, label, href]) => (
              <Link
                key={href}
                href={href as Route}
                className="flex min-w-max items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-[.1em] text-white/68 hover:bg-white/8 hover:text-white"
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href={storefrontUrl(locale) as Route}
            className="ms-auto inline-flex min-h-11 shrink-0 items-center px-2 text-[10px] font-bold uppercase tracking-[.1em] text-[var(--brand-highlight)] hover:text-white"
          >
            {ar ? "عرض المتجر" : "View store"}
          </Link>
          <form action={signOutAction} className="shrink-0"><input type="hidden" name="locale" value={locale}/><button type="submit" className="min-h-11 px-2 text-xs text-white/80 hover:text-white">{ar ? "خروج" : "Sign out"}</button></form>
        </div>
        <nav
          className="overflow-x-auto border-t border-white/10 lg:hidden"
          aria-label={
            ar ? "تنقل لوحة الإدارة للموبايل" : "Admin mobile navigation"
          }
        >
          <div className="mx-auto flex min-w-max items-stretch px-2">
            {items.map(([Icon, label, href]) => (
              <Link
                key={href}
                href={href as Route}
                className="flex min-h-12 min-w-max items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-[.08em] text-white/68 hover:bg-white/8 hover:text-white"
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}
