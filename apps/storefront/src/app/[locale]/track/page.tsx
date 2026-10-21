import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { TrackForm } from "@/features/support/track-form";
export const metadata={title:"Track your order",robots:{index:false,follow:false}};
export default async function Track({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params; if(!isLocale(locale)) notFound();
  return <main className="page-shell min-h-[60vh] py-16"><p className="eyebrow text-[var(--brand-700)]">KOVA / {locale==='ar'?'طلباتك':'YOUR ORDERS'}</p><h1 className="kova-editorial mt-4 text-5xl">{locale==='ar'?'تابع طلبك.':'Your order, at a glance.'}</h1><TrackForm locale={locale}/></main>;
}
