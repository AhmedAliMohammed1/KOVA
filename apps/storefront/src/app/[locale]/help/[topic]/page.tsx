import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { supportTopics, type SupportTopic } from "@/features/support/content";
type Props = { params: Promise<{ locale: string; topic: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const {locale,topic} = await params;
  if (!isLocale(locale) || !(topic in supportTopics)) return {};
  const content = supportTopics[topic as SupportTopic][locale];
  return {title: content.title,description: content.intro, alternates: {canonical:`/${locale}/help/${topic}`,languages:{en:`/en/help/${topic}`,ar:`/ar/help/${topic}`}}};
}
export default async function HelpPage({ params }: Props) {
  const {locale,topic} = await params;
  if (!isLocale(locale) || !(topic in supportTopics)) notFound();
  const ar=locale === "ar";
  const t = supportTopics[topic as SupportTopic][locale];
  return <main className="page-shell py-12 md:py-20"><p className="eyebrow text-[var(--brand-700)]">{ar ? "كوفا / المساعدة" : "KOVA / CUSTOMER CARE"}</p><div className="mt-6 grid gap-10 lg:grid-cols-[240px_1fr]"><nav aria-label={ar ? "مواضيع المساعدة" : "Help topics"} className="flex flex-wrap gap-3 self-start lg:grid">{Object.keys(supportTopics).map(key=><Link key={key} href={`/${locale}/help/${key}` as Route} aria-current={topic===key ? "page":undefined} className={`min-h-11 border-s-2 px-4 py-3 text-sm capitalize ${topic===key?'border-[var(--brand-700)] bg-[var(--brand-100)]':'border-[var(--border-subtle)]'}`}>{({contact:ar?'تواصل':'Contact',sizing:ar?'المقاسات':'Sizing',shipping:ar?'الشحن والدفع':'Delivery & payment',returns:ar?'الإرجاع':'Returns',privacy:ar?'الخصوصية':'Privacy',terms:ar?'الشروط':'Terms'} as Record<string,string>)[key]}</Link>)}</nav><article className="kova-policy"><h1 className="kova-editorial text-4xl md:text-5xl">{t.title}</h1><p className="mt-6 text-base">{t.intro}</p>{t.sections.map(([title,body])=><section key={title}><h2>{title}</h2><p>{body}</p></section>)}<div className="mt-10 flex flex-wrap gap-4"><a href="https://wa.me/201096733209" target="_blank" rel="noreferrer" className="kova-button">{ar?'تحدث معنا على واتساب':'Chat on WhatsApp'}</a><Link href={`/${locale}/shop`} className="kova-link">{ar?'العودة للمتجر':'Back to shop'}</Link></div></article></div></main>;
}
