"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { CmsBanner } from "./types";
import {
  getBannerTitle,
  getBannerSubtitle,
  getBannerBody,
  getBannerCtaText,
  getBannerSecondaryCtaText,
  getBannerImageUrl,
} from "./types";

interface HeroCarouselProps {
  banners: CmsBanner[];
  locale: Locale;
}

export function HeroCarousel({ banners, locale }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = banners.length;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (total > 1 && autoPlay && !paused && !reducedMotion) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % total);
      }, 6000);
    }
  }, [autoPlay, paused, reducedMotion, total]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const goTo = (index: number) => {
    setCurrent(index);
    resetTimer();
  };

  const banner = banners[current];
  if (!banner) return null;

  const title = getBannerTitle(banner, locale);
  const subtitle = getBannerSubtitle(banner, locale);
  const body = getBannerBody(banner, locale);
  const ctaText = getBannerCtaText(banner, locale);
  const secondaryCtaText = getBannerSecondaryCtaText(banner, locale);
  const imageUrl = getBannerImageUrl(banner.imagePath);

  return (
    <section
      className="relative min-h-[620px] overflow-hidden md:min-h-[760px]"
      style={{ backgroundColor: banner.bgColor }}
      aria-roledescription="carousel"
      aria-label={locale === "ar" ? "عروض كوفا سكراب" : "KOVA Scrubs highlights"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
    >
      {/* Background image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          fill
          preload
          sizes="100vw"
          className="object-cover object-[55%_58%] md:object-[60%_55%]"
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l"
        style={{
          backgroundImage: `linear-gradient(to right, ${banner.bgColor}${Math.round(banner.overlayOpacity * 2.55)
            .toString(16)
            .padStart(2, "0")}, ${banner.bgColor}88, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[620px] max-w-[1440px] items-center px-5 py-20 md:min-h-[760px] md:px-12">
        <div className="max-w-2xl" style={{ color: banner.textColor }}>
          {subtitle && (
            <p className="eyebrow mb-7" style={{ color: banner.textColor }}>
              {subtitle}
            </p>
          )}
          <h1 className="hero-title max-w-xl text-balance">{title}</h1>
          {body && (
            <p className="mt-7 max-w-md text-sm leading-6 md:text-base">
              {body}
            </p>
          )}
          {(ctaText || secondaryCtaText) && (
            <div className="mt-9 flex flex-wrap gap-3">
              {ctaText && banner.ctaUrl && (
                <Link
                  href={banner.ctaUrl as Route}
                  className="px-6 py-4 text-[11px] font-bold uppercase tracking-[.14em]"
                  style={{
                    backgroundColor: banner.textColor,
                    color: banner.bgColor,
                  }}
                >
                  {ctaText}
                </Link>
              )}
              {secondaryCtaText && banner.secondaryCtaUrl && (
                <Link
                  href={banner.secondaryCtaUrl as Route}
                  className="border px-6 py-4 text-[11px] font-bold uppercase tracking-[.14em]"
                  style={{ borderColor: banner.textColor }}
                >
                  {secondaryCtaText}
                </Link>
              )}
            </div>
          )}
        </div>

        <ArrowDown
          className="absolute bottom-7 start-1/2"
          style={{ color: banner.textColor }}
          size={20}
          aria-hidden="true"
        />
      </div>

      {/* Carousel dots */}
      {total > 1 && (
        <div className="absolute bottom-4 start-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-xs bg-[var(--brand-950)] px-2 text-white rtl:translate-x-1/2">
          <button type="button" onClick={() => setAutoPlay(value => !value)} aria-pressed={autoPlay} className="min-h-11 px-3 text-xs">{locale === "ar" ? autoPlay ? "إيقاف العرض" : "تشغيل العرض" : autoPlay ? "Pause slideshow" : "Start slideshow"}</button>
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={locale === "ar" ? `الشريحة ${i + 1}` : `Slide ${i + 1}`}
              aria-pressed={i === current}
              className="grid size-11 place-items-center"
            ><span aria-hidden="true" className={`h-2 rounded-full ${i === current ? "w-6 bg-white" : "w-2 bg-white/60"}`}/></button>
          ))}
        </div>
      )}
    </section>
  );
}
