"use client";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import type { Locale } from "@/lib/i18n";
export function TrackForm({locale}: {locale:Locale}) {
  const router=useRouter(); const ar=locale==='ar';
  return <form className="mt-8 grid max-w-md gap-5" onSubmit={event=>{event.preventDefault(); const data=new FormData(event.currentTarget); const number=String(data.get('orderNumber')).trim().toUpperCase(); router.push(`/${locale}/track/${encodeURIComponent(number)}` as Route);}}><label className="grid gap-2 text-sm">{ar?'رقم الطلب':'Order number'}<input name="orderNumber" required autoComplete="off" maxLength={80} pattern="[A-Za-z0-9-]+" className="border border-[var(--border-subtle)] bg-white px-4 py-3" placeholder="SV-…" aria-describedby="tracking-help"/></label><p id="tracking-help" className="text-sm text-[var(--text-muted)]">{ar?'ستحتاج رقم الموبايل المسجل أو الدخول لحسابك للتحقق من الطلب.':'You will need your checkout phone number or account access to verify the order.'}</p><button type="submit" className="kova-button">{ar?'متابعة الطلب':'Find my order'}</button></form>;
}
