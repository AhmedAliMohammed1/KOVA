"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, ArrowUpRight, Star } from "lucide-react";
import type { Product } from "@/features/catalog/types";
import { discountPercent, formatMoney } from "@/lib/money";
import type { Locale } from "@/lib/i18n";
import { useShop } from "./cart-provider";

export function ProductCard({
  product,
  locale,
  priority = false,
}: {
  product: Product;
  locale: Locale;
  priority?: boolean;
}) {
  const { toggleWishlist, wishlist } = useShop();
  const wished = wishlist.includes(product.id);
  const discount = discountPercent(product.price, product.compareAt);
  const ar = locale === "ar";
  const [selectedColourCode, setSelectedColourCode] = useState(product.colorCode ?? product.colors[0]?.code ?? "");
  const selectedColour = product.colors.find(colour => colour.code === selectedColourCode) ?? product.colors[0];
  const selectedImage = product.images?.find(image => image.colourCode?.toLowerCase() === selectedColour?.code.toLowerCase()) ?? product.image;
  const productHref = `/${locale}/products/${product.slug}${selectedColour ? `?colour=${encodeURIComponent(selectedColour.code)}` : ""}`;

  return (
    <article className="group flex flex-col justify-between overflow-hidden">
      <div>
        {/* Media Frame */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xs border border-[var(--border-subtle)] bg-[#ebe9e4]">
          <Link
            href={productHref}
            tabIndex={-1}
            className="relative block size-full"
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt[locale]}
              fill
              preload={priority}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
            />
          </Link>

          {/* Status Badge */}
          <div className="absolute start-2.5 top-2.5 z-10 flex flex-col gap-1 sm:start-3 sm:top-3">
            {product.badge === "sale" && discount ? (
              <span className="rounded-xs bg-[#a5472f] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.14em] text-white shadow-xs sm:text-[10px]">
                -{discount}%
              </span>
            ) : product.badge === "low" ? (
              <span className="rounded-xs bg-[var(--brand-surface)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.14em] text-[var(--brand-950)] shadow-xs sm:text-[10px]">
                {ar ? "كمية محدودة" : "Low stock"}
              </span>
            ) : (
              <span className="rounded-xs bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.14em] text-[var(--brand-950)] shadow-xs sm:text-[10px]">
                KOVA
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className={`absolute end-2.5 top-2.5 z-10 grid size-11 place-items-center rounded-full bg-white/95 shadow-xs transition hover:scale-105 sm:end-3 sm:top-3 ${
              wished
                ? "text-[#a5472f]"
                : "text-[var(--text-strong)] hover:text-[var(--brand-950)]"
            }`}
            aria-label={
              wished
                ? ar
                  ? "إزالة من قائمة الأمنيات"
                  : "Remove from wishlist"
                : ar
                  ? "إضافة إلى قائمة الأمنيات"
                  : "Add to wishlist"
            }
          >
            <Heart
              size={18}
              strokeWidth={1.8}
              fill={wished ? "currentColor" : "none"}
              aria-hidden="true"
            />
          </button>

          <Link href={productHref} className="absolute inset-x-2 bottom-2 flex min-h-11 items-center justify-between border border-[var(--border-subtle)] bg-white/95 px-3 text-[10px] font-bold text-[var(--brand-950)] hover:bg-[var(--brand-100)]" aria-label={`${product.availabilityPending ? ar ? 'استعرض الألوان' : 'Explore colours' : ar ? 'اختر مقاسك' : 'Choose your size'}: ${product.title[locale]}`}>
            {product.availabilityPending ? ar ? 'استعرض الألوان' : 'Explore colours' : ar ? 'اختر مقاسك' : 'Choose your size'}<ArrowUpRight size={15} aria-hidden="true"/>
          </Link>
        </div>

        {/* Product Meta */}
        <div className="pt-3.5 sm:pt-4">
          <Link
            href={productHref}
            className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--text-strong)] transition-colors hover:text-[var(--brand-700)]"
          >
            {product.title[locale]}
          </Link>

          {product.rating && product.rating.count > 0 && (
            <Link
              href={`${productHref}#reviews`}
              aria-label={
                ar
                  ? `${product.rating.average} من 5، ${product.rating.count} تقييم`
                  : `${product.rating.average} out of 5, ${product.rating.count} reviews`
              }
              className="mt-2 flex min-h-6 w-fit items-center gap-1.5 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--brand-700)]"
            >
              <Star size={13} fill="currentColor" className="text-[#bd6b2c]" aria-hidden="true" />
              <span>{product.rating.average.toFixed(1)}</span>
              <span className="text-black/35">({product.rating.count})</span>
            </Link>
          )}

          {/* Color swatches */}
          <div
            className="mt-2 flex flex-wrap items-center gap-1"
            role="group"
            aria-label={`${product.colors.length} ${ar ? "ألوان" : "colours"}`}
          >
            {product.colors.slice(0, 5).map((colour) => (
              <button
                key={colour.code}
                type="button"
                aria-label={colour.name[locale]}
                aria-pressed={selectedColour?.code === colour.code}
                onClick={() => setSelectedColourCode(colour.code)}
                className="grid size-11 shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-700)]"
                title={colour.name[locale]}
              >
                <span aria-hidden="true" className={`size-5 rounded-full border border-black/20 shadow-2xs ${selectedColour?.code === colour.code ? "ring-2 ring-[var(--brand-700)] ring-offset-2" : ""}`} style={{backgroundColor:colour.swatch}} />
              </button>
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] font-semibold text-[var(--text-muted)]">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing and size info */}
      <div className="mt-2 pt-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <strong className="text-sm font-bold text-[var(--text-strong)] sm:text-base">
            {formatMoney(product.price, locale)}
          </strong>
          {product.compareAt && (
            <span className="text-xs text-[var(--text-muted)] line-through">
              {formatMoney(product.compareAt, locale)}
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-xs text-[var(--text-muted)]">
          {product.availabilityPending ? ar ? "المقاسات والتوفر في انتظار التأكيد" : "Sizes & availability pending" : <>{product.sizes.length} {ar ? "مقاسات متاحة" : "sizes available"}</>}
        </p>
      </div>
    </article>
  );
}
