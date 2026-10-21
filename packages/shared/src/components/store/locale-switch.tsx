"use client";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import type { Locale } from "@/lib/i18n";
export function LocaleSwitch({ locale, className = "" }: { locale: Locale; className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const other = locale === "en" ? "ar" : "en";
  const href = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`);
  return <a href={href} lang={other} hrefLang={other} className={className} onClick={event => {
    event.preventDefault();
    router.push(`${href}${window.location.search}${window.location.hash}` as Route);
  }}>{other === "ar" ? "العربية" : "English"}</a>;
}
