"use client";
import { useParams } from "next/navigation";
export default function Error({reset}:{reset:()=>void}) {
  const ar=useParams<{locale:string}>().locale==='ar';
  return <main className="page-shell py-16"><p className="eyebrow text-[var(--brand-700)]">KOVA / ADMIN</p><h1 className="kova-editorial mt-4 text-4xl">{ar?'تعذر تحميل هذه الصفحة':'This page could not be loaded'}</h1><p role="alert" className="mt-5 text-sm text-[var(--text-muted)]">{ar?'تحقق من اتصالك وحاول مرة أخرى. إذا كنت قد أرسلت تعديلاً، تحقق من السجل قبل تكراره.':'Check your connection and try again. If you submitted a change, check the record before repeating it.'}</p><button type="button" onClick={reset} className="kova-button mt-6">{ar?'حاول مرة أخرى':'Try again'}</button></main>;
}
