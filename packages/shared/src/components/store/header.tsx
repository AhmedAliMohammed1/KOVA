"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, LayoutDashboard, LogOut, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { copy, type Locale } from "@/lib/i18n";
import { adminUrl } from "@/lib/application-urls";
import { useShop } from "./cart-provider";
import { LocaleSwitch } from "./locale-switch";
import { signOutAction } from "@/features/auth/actions";
import type { ViewerAccess } from "@/server/auth/roles";
export function Header({ locale, viewer }: { locale: Locale; viewer: ViewerAccess }) {
  const pathname = usePathname();
  const { cart, wishlist } = useShop();
  const ar = locale === "ar";
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const labels = { signIn: ar ? "تسجيل الدخول" : "Sign In", account: ar ? "حسابي" : "My account", signOut: ar ? "تسجيل الخروج" : "Sign Out", admin: ar ? "لوحة الإدارة" : "Admin Dashboard" };
  const links = [[ar ? "جميع المنتجات" : "Shop all", `/${locale}/shop`], [copy[locale].nav[1], `/${locale}/shop?category=women`], [copy[locale].nav[2], `/${locale}/shop?category=men`], [copy[locale].nav[3], `/${locale}/shop?q=lab+coat`], [ar ? "دليل المقاسات" : "Find your fit", `/${locale}/help/sizing`]];
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  const account = viewer.isAuthenticated ? labels.account : labels.signIn;
  return <>
    <header className="sticky top-0 z-40 bg-[var(--brand-950)] text-white">
      <div className="page-shell relative flex min-h-24 items-center justify-between gap-2 border-b border-white/15">
        <div className="flex items-center gap-2 sm:gap-5">
          <button ref={trigger} type="button" onClick={() => setOpen(true)} aria-label={ar ? "فتح القائمة الرئيسية" : "Open navigation menu"} aria-expanded={open} className="grid size-11 place-items-center lg:hidden"><Menu size={22} aria-hidden="true"/></button>
          <Link href={`/${locale}/shop#catalog-search`} aria-label={ar ? "بحث في المتجر" : "Search catalog"} className="hidden size-11 place-items-center sm:grid"><Search size={20} aria-hidden="true"/></Link>
          <p className="hidden text-[10px] uppercase tracking-[.16em] text-white/70 lg:block">{ar ? "مصمم لمن يهتمون" : "For those who care"}</p>
        </div>
        <Link href={`/${locale}`} aria-label={ar ? "كوفا سكراب الرئيسية" : "KOVA Scrubs home"} className="absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2"><Image src="/images/kova/official-logo.webp" width={56} height={76} alt="KOVA Scrubs" className="h-[76px] w-auto"/></Link>
        <div className="flex items-center gap-0 sm:gap-2">
          <LocaleSwitch locale={locale} className="me-3 hidden min-h-11 items-center text-xs sm:flex"/>
          <Link href={`/${locale}/account` as Route} aria-label={account} title={account} className="hidden size-11 place-items-center lg:grid"><UserRound size={20} aria-hidden="true"/></Link>
          {viewer.isAuthenticated && <form action={signOutAction} className="hidden lg:block"><input type="hidden" name="locale" value={locale}/><button type="submit" aria-label={labels.signOut} className="grid size-11 place-items-center"><LogOut size={18} aria-hidden="true"/></button></form>}
          <Link href={`/${locale}/wishlist`} aria-label={ar ? `المفضلة (${wishlist.length})` : `Wishlist (${wishlist.length})`} className="relative grid size-11 place-items-center"><Heart size={20} aria-hidden="true"/>{wishlist.length > 0 && <span className="counter">{wishlist.length}</span>}</Link>
          <Link href={`/${locale}/cart`} aria-label={ar ? `الحقيبة (${cart})` : `Bag (${cart})`} className="relative grid size-11 place-items-center"><ShoppingBag size={20} aria-hidden="true"/>{cart > 0 && <span className="counter">{cart}</span>}</Link>
        </div>
      </div>
      <nav aria-label={ar ? "التنقل الرئيسي" : "Primary navigation"} className="page-shell hidden min-h-12 items-center justify-center gap-9 text-xs lg:flex">{links.map(([label, href]) => <Link key={href} href={href as Route} className="flex min-h-12 items-center border-b-2 border-transparent hover:border-[var(--brand-highlight)]" aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}{viewer.canAccessAdmin && <a href={adminUrl(locale)} title={labels.admin} className="flex min-h-12 items-center gap-2 text-[var(--brand-highlight)]"><LayoutDashboard size={15} aria-hidden="true"/>{labels.admin}</a>}</nav>
    </header>
    <dialog ref={dialog} aria-label={ar ? "قائمة المتجر" : "Store navigation"} onCancel={() => setOpen(false)} onClose={() => { setOpen(false); trigger.current?.focus(); }} className="fixed inset-y-0 start-0 end-auto m-0 h-dvh max-h-none w-[min(90vw,380px)] border-0 bg-white p-0 text-[var(--text-strong)] backdrop:bg-black/50">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4"><span lang="en" dir="ltr" className="font-serif text-2xl">KOVA Scrubs</span><button type="button" onClick={() => setOpen(false)} aria-label={ar ? "إغلاق القائمة" : "Close menu"} className="grid size-11 place-items-center"><X size={22} aria-hidden="true"/></button></div>
      <nav className="grid px-6 py-4" aria-label={ar ? "تنقل الموبايل" : "Mobile navigation"}>
        {links.map(([label, href]) => <Link key={href} href={href as Route} onClick={() => setOpen(false)} className="border-b border-[var(--border-subtle)] py-5 text-lg">{label}</Link>)}
        <Link href={`/${locale}/account` as Route} onClick={() => setOpen(false)} className="py-5">{account}</Link>
        {viewer.isAuthenticated && <form action={signOutAction}><input type="hidden" name="locale" value={locale}/><button className="min-h-11" type="submit">{labels.signOut}</button></form>}
        {viewer.canAccessAdmin && <a href={adminUrl(locale)} className="min-h-11 py-3">{labels.admin}</a>}
        <Link href={`/${locale}/help/contact` as Route} onClick={() => setOpen(false)} className="py-4">{ar ? "المساعدة والتواصل" : "Help & contact"}</Link><LocaleSwitch locale={locale} className="mt-4 min-h-11 border border-[var(--border-subtle)] p-4 text-center"/>
      </nav>
    </dialog>
  </>;
}
