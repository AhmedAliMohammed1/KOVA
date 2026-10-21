import type { Route } from "next";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnvironment } from "@/lib/supabase/config";
import { copy, type Locale } from "@/lib/i18n";
import { getActiveBanners } from "./repository";
import { getBannerTitle } from "./types";
import { isLocalCatalogPreview } from "@/lib/catalog-preview";

export async function AnnouncementBar({ locale }: { locale: Locale }) {
  let announcements: Awaited<ReturnType<typeof getActiveBanners>> = [];

  if (hasSupabaseEnvironment() && !isLocalCatalogPreview()) {
    try {
      const supabase = createPublicClient();
      announcements = await getActiveBanners(supabase, "announcement");
    } catch {
      // Silently fall back to static text
    }
  }

  // Fallback: render the existing static announcement
  if (!announcements.length) {
    return (
      <div className="bg-neutral-950 px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[.18em] text-white">
        {hasSupabaseEnvironment() && !isLocalCatalogPreview() ? copy[locale].freeShipping : locale === "ar" ? "معاينة تشكيلة كوفا · المقاسات والمخزون في انتظار التأكيد" : "KOVA collection preview · sizes & stock awaiting confirmation"}
      </div>
    );
  }

  // Single announcement
  if (announcements.length === 1) {
    const banner = announcements[0];
    const text = getBannerTitle(banner, locale);
    const content = (
      <span className="inline-block">{text}</span>
    );

    return (
      <div
        className="px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[.18em]"
        style={{
          backgroundColor: banner.bgColor,
          color: banner.textColor,
        }}
      >
        {banner.ctaUrl ? (
          <Link href={banner.ctaUrl as Route} className="underline-offset-2 hover:underline">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    );
  }

  return <div className="bg-[var(--brand-950)] px-4 py-2 text-center text-xs text-white"><details className="mx-auto max-w-3xl"><summary className="min-h-8 cursor-pointer">{getBannerTitle(announcements[0], locale)} · {locale === "ar" ? "المزيد" : "More updates"}</summary><ul className="grid gap-3 py-4">{announcements.slice(1).map(banner => <li key={banner.id}>{banner.ctaUrl ? <Link href={banner.ctaUrl as Route} className="underline underline-offset-4">{getBannerTitle(banner, locale)}</Link> : getBannerTitle(banner, locale)}</li>)}</ul></details></div>;
}
