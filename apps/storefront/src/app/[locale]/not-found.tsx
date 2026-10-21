"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
export default function NotFound() {
  const {locale}=useParams<{locale:string}>(); const ar=locale==='ar'; const lang=ar?'ar':'en';
  return <main className="page-shell grid min-h-[65vh] place-items-center py-16 text-center"><div className="max-w-lg"><p className="eyebrow text-[var(--brand-700)]">KOVA / 404</p><h1 className="kova-editorial mt-4 text-5xl">{ar?'لم نجد هذه الصفحة.':'We couldn’t find that page.'}</h1><p className="mt-5 text-sm leading-7 text-[var(--text-muted)]">{ar?'قد يكون الرابط قد تغير أو المنتج غير متاح. اكتشف التشكيلة أو تواصل معنا للمساعدة.':'The link may have changed or the product may be unavailable. Explore the collection or contact us for help.'}</p><Link href={`/${lang}/shop`} className="kova-button mt-8">{ar?'اكتشف التشكيلة':'Explore the collection'}</Link></div></main>;
}
