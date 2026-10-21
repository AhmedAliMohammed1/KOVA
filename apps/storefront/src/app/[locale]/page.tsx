import Image from "next/image";
import Link from "next/link";
import type { Metadata, Route } from "next";
import { ArrowUpRight, ArrowRight, Ruler, Truck, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/product-card";
import { HeroCarousel } from "@/features/cms/hero-carousel";
import { PromoSection } from "@/features/cms/promo-section";
import { getActiveBanners } from "@/features/cms/repository";
import { catalog } from "@/lib/catalog";
import { isLocale } from "@/lib/i18n";
import { hasSupabaseEnvironment } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: locale === "ar" ? "كوفا سكراب · لكل شيفت" : "KOVA Scrubs · Made for long shifts", alternates: { canonical: `/${locale}`, languages: { en: "/en", ar: "/ar" } } };
}
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ar = locale === "ar";
  const [products, banners] = await Promise.all([catalog.featured(), loadBanners()]);
  return <main>
    {banners.heroes.length ? <HeroCarousel banners={banners.heroes} locale={locale}/> : <section className="kova-hero">
      <div className="kova-hero-copy">
        <p className="eyebrow mb-7 text-[var(--brand-highlight)]">{ar ? "كوفا سكراب / ملابس طبية" : "KOVA SCRUBS / MEDICAL APPAREL"}</p>
        <h1 className="hero-title max-w-xl">{ar ? <>لمن يهتمون.<br/><span className="italic text-[var(--brand-highlight)]">في كل شيفت.</span></> : <>For those<br/>who care.<br/><span className="italic text-[var(--brand-highlight)]">Every shift.</span></>}</h1>
        <p className="mt-7 max-w-sm text-sm leading-7 text-white/75">{ar ? "إطلالة احترافية تبدأ براحتك. اكتشف السكراب واختر المقاس واللون المناسبين ليومك." : "A considered approach to your everyday uniform. Explore medical apparel and find the fit that feels like you."}</p>
        <div className="mt-8 flex flex-wrap items-center gap-6"><Link href={`/${locale}/shop`} className="kova-button">{ar ? "اكتشف التشكيلة" : "Explore the collection"}<ArrowUpRight size={17} className="rtl:-scale-x-100" aria-hidden="true"/></Link><Link href={`/${locale}/help/sizing` as Route} className="kova-link text-white">{ar ? "اعرف مقاسك" : "Find your fit"}</Link></div>
        <div className="kova-hero-number"><span className="text-[var(--brand-highlight)]">01 /</span><p>{ar ? "راحة. مقاس. تفاصيل تستحق الاهتمام." : "Comfort. Fit. The details that matter."}</p></div>
      </div>
      <div className="kova-hero-media"><Image src="/images/kova/studio-14.webp" alt={ar ? "طقم سكراب رمادي بقصة واسعة، صورة أمامية" : "Front view of a grey V-neck scrub set with wide-leg trousers"} fill preload sizes="(min-width:768px) 50vw,100vw" className="object-cover object-top"/><div className="absolute bottom-5 start-5 end-5 flex items-center justify-between border border-white/50 bg-white/95 px-5 py-4 text-[var(--brand-950)]"><span className="text-xs">{ar ? "تفاصيل أقرب. اختيار أوضح." : "A closer look. A considered choice."}</span><ArrowUpRight size={18} aria-hidden="true"/></div></div>
    </section>}
    <section className="border-b border-[var(--border-subtle)] bg-white"><div className="page-shell grid gap-3 py-5 text-xs sm:grid-cols-3">{[[Ruler, ar ? "دليل مقاسات قبل اختيارك" : "Size guidance before you choose"],[Truck, ar ? "تكلفة الشحن واضحة عند الدفع" : "Delivery costs shown at checkout"],[CreditCard, ar ? "فودافون كاش · إنستاباي · دفع بمقدم" : "Vodafone Cash · InstaPay · COD deposit"]].map(([Icon,text]) => { const C = Icon as typeof Ruler; return <div key={String(text)} className="flex min-h-10 items-center justify-center gap-3"><C size={18} strokeWidth={1.5} className="text-[var(--brand-700)]" aria-hidden="true"/><span>{String(text)}</span></div>; })}</div></section>
    <section className="page-shell kova-section"><div className="mb-9 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow text-[var(--brand-700)]">{ar ? "ملابسك اليومية، بعناية" : "YOUR EVERYDAY, CONSIDERED"}</p><h2 className="kova-editorial mt-3 text-4xl md:text-5xl">{ar ? "اختر ما يناسب شيفتك." : "Meet your next uniform."}</h2></div><Link href={`/${locale}/shop`} className="kova-link">{ar ? "تسوق التشكيلة" : "Shop the collection"}<ArrowUpRight size={17} aria-hidden="true"/></Link></div><div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-7 lg:grid-cols-4">{products.slice(0,4).map(p => <ProductCard key={p.id} product={p} locale={locale}/>)}</div>{!products.length && <p className="surface-card p-8">{ar ? "لا توجد منتجات متاحة الآن. تواصل معنا للمساعدة." : "No products are available right now. Contact us for help."}</p>}</section>
    <section className="page-shell pb-14"><div className="grid gap-5 md:grid-cols-2">{[{src:"/images/kova/studio-10.webp", label:ar ? "السكراب الحريمي" : "The women's edit", href:`/${locale}/shop?category=women`, alt:ar ? "طقم سكراب رمادي، صورة كاملة" : "Full-length view of a grey scrub set"},{src:"/images/kova/studio-55.webp", label:ar ? "السكراب الرجالي" : "The men's edit", href:`/${locale}/shop?category=men`, alt:ar ? "طقم سكراب أسود على عارض، صورة كاملة" : "Full-length view of a black scrub set worn by a male model"}].map(item => <Link key={item.src} href={item.href as Route} className="group relative block aspect-[5/4] overflow-hidden bg-[#e8ecef]"><Image src={item.src} alt={item.alt} fill sizes="(min-width:768px) 50vw,100vw" className="object-cover object-[50%_35%] transition-transform duration-300 group-hover:scale-[1.02]"/><div className="absolute bottom-4 start-4 end-4 flex items-center justify-between bg-white px-5 py-5"><span className="font-serif text-2xl">{item.label}</span><ArrowUpRight size={20} aria-hidden="true"/></div></Link>)}</div></section>
    {banners.promos.length > 0 && <PromoSection banners={banners.promos} locale={locale}/>}
    <section id="quality" className="bg-[var(--brand-950)] text-white"><div className="page-shell grid gap-12 py-16 md:grid-cols-[1.1fr_1fr] md:py-24"><div><p className="eyebrow text-[var(--brand-highlight)]">{ar ? "معيار كوفا" : "THE KOVA APPROACH"}</p><h2 className="kova-editorial mt-5 text-4xl md:text-6xl">{ar ? "اهتمام بكل تفصيلة. ولكل من يهتم." : <>Care in the details.<br/>For those who care.</>}</h2><Link href={`/${locale}/help/sizing` as Route} className="kova-link mt-7 text-[var(--brand-highlight)]">{ar ? "ابدأ بالمقاس المناسب" : "Start with the right fit"}<ArrowRight size={16} className="rtl:rotate-180" aria-hidden="true"/></Link></div><div className="grid gap-7">{(ar ? [["01","اختيارك يبدأ بالمقاس","راجع دليل المقاسات وتوفر الألوان قبل الإضافة للحقيبة."],["02","تفاصيل طلبك واضحة","راجع تكلفة الشحن والمقدم المطلوب والإجمالي قبل التأكيد."],["03","معك بعد الشراء","تابع طلبك وإثبات الدفع وطلبات الاستبدال من حسابك."]] : [["01","Find your fit","Check size guidance and colour availability before adding to your bag."],["02","Know your total","Review delivery, any required deposit, and your complete total before confirming."],["03","Stay in the loop","Track your order, payment proof and return requests from your account."]]).map(([n,title,body]) => <div key={n} className="flex gap-6 border-b border-white/20 pb-7"><span className="text-xs text-[var(--brand-highlight)]">{n}</span><div><h3 className="font-serif text-2xl">{title}</h3><p className="mt-2 max-w-sm text-sm leading-7 text-white/70">{body}</p></div></div>)}</div></div></section>
    <section className="page-shell kova-section flex flex-wrap items-center justify-between gap-6"><div><p className="eyebrow text-[var(--brand-700)]">{ar ? "نحن هنا للمساعدة" : "A LITTLE GUIDANCE?"}</p><h2 className="kova-editorial mt-3 text-3xl md:text-4xl">{ar ? "لنجد ما يناسبك." : "Let's find your everyday fit."}</h2></div><Link href={`/${locale}/help/contact` as Route} className="kova-button">{ar ? "تواصل معنا" : "Talk to us"}<ArrowUpRight size={17} aria-hidden="true"/></Link></section>
  </main>;
}
async function loadBanners() {
  if (!hasSupabaseEnvironment()) return { heroes: [], promos: [] };
  try { const client = createPublicClient(); const [heroes,promos] = await Promise.all([getActiveBanners(client,"hero"),getActiveBanners(client,"promo")]); return {heroes,promos}; } catch { return { heroes: [], promos: [] }; }
}
