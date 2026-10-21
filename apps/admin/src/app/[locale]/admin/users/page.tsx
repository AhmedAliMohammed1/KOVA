import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Search, ShieldCheck, Users } from "lucide-react";
import { isLocale } from "@/lib/i18n";
import { requireRoles } from "@/server/auth/roles";
import { directorySchema } from "@/features/admin/user-roles/model";
import { UserRoleManager } from "@/features/admin/user-roles/user-role-manager";

export const metadata: Metadata = {
  title: "User roles | KOVA Admin",
  robots: { index: false, follow: false },
};

export default async function UserRolesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { supabase, userId } = await requireRoles(["super_admin"]);
  const search = await searchParams;
  const query =
    typeof search.q === "string" ? search.q.trim().slice(0, 120) : "";
  const page = Math.min(
    100000,
    Math.max(1, Number.parseInt(search.page ?? "1", 10) || 1),
  );
  const { data, error } = await supabase.rpc("super_admin_list_users", {
    p_query: query,
    p_page: page,
  });
  if (error) throw new Error("User access directory could not be loaded.");
  const directory = directorySchema.parse(data);
  const pages = Math.max(1, Math.ceil(directory.total / 20));
  const ar = locale === "ar";
  const href = (next: number) =>
    `/${locale}/admin/users?${new URLSearchParams({ q: query, page: String(next) })}`;

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-12">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-5 border-b border-[var(--border-subtle)] pb-8">
        <div>
          <p className="eyebrow text-[var(--brand-700)]">
            {ar ? "كوفا / إدارة الوصول" : "KOVA / ACCESS MANAGEMENT"}
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">
            {ar ? "المستخدمون والصلاحيات" : "Users & roles"}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-[var(--text-muted)]">
            {ar
              ? "امنح كل فرد الصلاحيات المناسبة لدوره. إدارة الصلاحيات متاحة للمدير العام فقط."
              : "Give each person the access their work needs. Only super admins can manage user roles."}
          </p>
        </div>
        <span className="inline-flex min-h-11 items-center gap-2 border border-[var(--brand-700)] bg-[var(--brand-surface)] px-4 py-2 text-sm font-semibold text-[var(--brand-700)]">
          <ShieldCheck size={18} aria-hidden="true" />
          {ar ? "المدير العام فقط" : "Super admin only"}
        </span>
      </header>
      <section
        aria-label={ar ? "البحث في المستخدمين" : "Find users"}
        className="mb-7 border border-[var(--border-subtle)] bg-white p-5 md:p-6"
      >
        <form
          action={`/${locale}/admin/users`}
          method="get"
          className="flex flex-wrap items-end gap-3"
        >
          <div className="min-w-0 flex-1 basis-64">
            <label
              htmlFor="user-search"
              className="mb-2 block text-sm font-semibold"
            >
              {ar
                ? "ابحث بالاسم أو البريد الإلكتروني"
                : "Search by name or email"}
            </label>
            <input
              id="user-search"
              type="search"
              name="q"
              maxLength={120}
              defaultValue={query}
              placeholder={
                ar
                  ? "اسم المستخدم أو البريد الإلكتروني"
                  : "Name or email address"
              }
              className="w-full border bg-white px-4 py-3"
            />
          </div>
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--brand-950)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-800)]"
            type="submit"
          >
            <Search size={18} aria-hidden="true" />
            {ar ? "بحث" : "Search"}
          </button>
          {query && (
            <Link
              href={`/${locale}/admin/users`}
              className="inline-flex min-h-12 items-center px-3 text-sm underline underline-offset-4"
            >
              {ar ? "مسح البحث" : "Clear search"}
            </Link>
          )}
        </form>
      </section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--text-muted)]">
        <p className="flex items-center gap-2">
          <Users size={17} aria-hidden="true" />
          {ar ? `${directory.total} مستخدم` : `${directory.total} users`}
        </p>
        <p>{ar ? `صفحة ${page} من ${pages}` : `Page ${page} of ${pages}`}</p>
      </div>
      {directory.users.length ? (
        <UserRoleManager
          users={directory.users}
          viewerId={userId}
          locale={locale}
        />
      ) : (
        <div className="border border-[var(--border-subtle)] bg-white px-6 py-12 text-center">
          <h2 className="font-serif text-2xl">
            {ar ? "لا توجد نتائج" : "No users found"}
          </h2>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            {ar
              ? "جرّب اسماً آخر أو البريد الإلكتروني الكامل."
              : "Try another name or the full email address."}
          </p>
        </div>
      )}
      <nav
        aria-label={ar ? "صفحات المستخدمين" : "User directory pages"}
        className="mt-7 flex flex-wrap justify-between gap-3"
      >
        {page > 1 ? (
          <Link
            href={href(page - 1)}
            className="inline-flex min-h-11 items-center border border-[var(--border-control)] bg-white px-5 text-sm"
          >
            {ar ? "السابق" : "Previous"}
          </Link>
        ) : (
          <span />
        )}
        {page < pages && (
          <Link
            href={href(page + 1)}
            className="inline-flex min-h-11 items-center border border-[var(--border-control)] bg-white px-5 text-sm"
          >
            {ar ? "التالي" : "Next"}
          </Link>
        )}
      </nav>
    </main>
  );
}
