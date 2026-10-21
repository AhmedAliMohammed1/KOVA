import Link from "next/link";
import { headers } from "next/headers";
export default async function NotFound() {
  const ar=(await headers()).get("x-scrub-vibe-locale")==="ar";
  return <main className="page-shell grid min-h-screen place-items-center bg-[var(--surface-canvas)] text-center"><div><p className="eyebrow text-[var(--brand-700)]">KOVA / 404</p><h1 className="kova-editorial mt-5 text-5xl">{ar?"لم نجد هذه الصفحة.":"We couldn’t find that page."}</h1><Link href={ar?"/ar":"/en"} className="kova-button mt-8">{ar?"العودة للرئيسية":"Return home"}</Link></div></main>;
}
