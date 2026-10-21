"use client";

import { useState, useMemo } from "react";
import { BellRing, Check, Heart, Ruler, ShoppingBag } from "lucide-react";
import type { Product } from "@/features/catalog/types";
import type { Locale } from "@/lib/i18n";
import type {
  SizeCategory,
  SizeChartEntry,
} from "@/features/catalog/size-guide-types";
import { Button } from "@/components/ui/button";
import { useShop } from "./cart-provider";
import { SizeGuideDialog } from "./size-guide-dialog";
import { StockNotifyDialog } from "./stock-notify-dialog";
import { trackProductInteraction } from "@/lib/analytics";
import { formatMoney } from "@/lib/money";

export function AddProduct({
  product,
  locale,
  sizeChartEntries = [],
  isProductOverride = false,
  selectedColourCode: controlledColourCode,
  onSelectColourCode,
  initialSize,
}: {
  product: Product;
  locale: Locale;
  sizeChartEntries?: SizeChartEntry[];
  isProductOverride?: boolean;
  selectedColourCode?: string;
  onSelectColourCode?: (code: string) => void;
  initialSize?: string;
}) {
  const initialColour =
    product.colors.find((colour) => colour.code === controlledColourCode) ?? product.colors.find((colour) => colour.inStock) ?? product.colors[0];
  const [internalColourCode, setInternalColourCode] = useState(
    initialColour?.code ?? "",
  );
  const colourCode =
    controlledColourCode !== undefined
      ? controlledColourCode
      : internalColourCode;
  const setColourCode = (code: string) => {
    setInternalColourCode(code);
    onSelectColourCode?.(code);
  };
  const selectedColour =
    product.colors.find((colour) => colour.code === colourCode) ??
    initialColour;

  // All sizes configured for this colourway (or product fallback)
  const allSizes = useMemo(() => {
    if (selectedColour) {
      const variantSizes = Object.keys(selectedColour.allVariants);
      if (variantSizes.length > 0) return variantSizes;
      const stockSizes = Object.keys(selectedColour.stockBySize);
      if (stockSizes.length > 0) return stockSizes;
      if (selectedColour.sizes.length > 0) return selectedColour.sizes;
    }
    return product.sizes;
  }, [selectedColour, product.sizes]);

  const [selectedSize, setSelectedSize] = useState(() => {
    if (initialSize && initialColour && Object.hasOwn(initialColour.allVariants, initialSize)) return initialSize;
    return (
      initialColour?.sizes[0] ??
      (initialColour ? Object.keys(initialColour.allVariants)[0] : "") ??
      product.sizes[0] ??
      ""
    );
  });

  const size = allSizes.includes(selectedSize)
    ? selectedSize
    : (allSizes[0] ?? "");

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const wished = wishlist.includes(product.id);
  const ar = locale === "ar";
  function persistSelection(colour: string, nextSize: string) {
    const url = new URL(window.location.href);
    url.searchParams.set("colour", colour);
    if (nextSize) url.searchParams.set("size", nextSize);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    trackProductInteraction("select_item", product.id, colour, nextSize);
  }

  const isSizeInStock = (s: string) => {
    if (!selectedColour) return false;
    if (
      selectedColour.stockBySize &&
      typeof selectedColour.stockBySize[s] === "number"
    ) {
      return selectedColour.stockBySize[s] > 0;
    }
    return selectedColour.sizes.includes(s);
  };

  const isCurrentSelectionInStock = Boolean(
    selectedColour?.inStock && size && isSizeInStock(size),
  );

  const handleAddToCart = () => {
    if (!isCurrentSelectionInStock) return;
    setIsAdding(true);
    addToCart(product, { colourCode: selectedColour?.code, size });
    setTimeout(() => setIsAdding(false), 1200);
  };

  return (
    <div className="mt-8 border-t border-[var(--border-subtle)] pt-6">
      {/* Color Swatches */}
      <div>
        <div className="mb-3 flex items-center justify-between text-xs">
          <strong className="font-bold uppercase tracking-[.14em] text-[var(--text-strong)]">
            {ar ? "اللون المختار" : "Selected colour"}:{" "}
            <span className="font-normal text-[var(--brand-700)]">
              {selectedColour?.name[locale]}
            </span>
          </strong>
          <span className="text-xs text-[var(--text-muted)]">
            {product.availabilityPending ? product.colors.length : product.colors.filter((colour) => colour.inStock).length}{" "}
            {product.availabilityPending ? ar ? "ألوان للاستعراض" : "colours to explore" : ar ? "ألوان متوفرة" : "colours in stock"}
          </span>
        </div>

        <div
          className="mb-8 flex flex-wrap gap-3"
          role="radiogroup"
          aria-label={ar ? "اختر اللون" : "Choose colour"}
          onKeyDown={event => {
            if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
            const choices = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
            const index = choices.indexOf(document.activeElement as HTMLButtonElement);
            if (index < 0 || !choices.length) return;
            event.preventDefault();
            const forward = event.key === "ArrowDown" || event.key === (ar ? "ArrowLeft" : "ArrowRight");
            const next = event.key === "Home" ? 0 : event.key === "End" ? choices.length - 1 : (index + (forward ? 1 : -1) + choices.length) % choices.length;
            choices[next].click(); choices[next].focus();
          }}
        >
          {product.colors.map((colour) => {
            const isSelected = colour.code === selectedColour?.code;
            return (
              <button
                key={colour.code}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                aria-label={
                  colour.inStock || product.availabilityPending
                    ? colour.name[locale]
                    : `${colour.name[locale]} (${ar ? "نفد المخزون" : "Out of stock"})`
                }
                title={
                  colour.inStock || product.availabilityPending
                    ? colour.name[locale]
                    : `${colour.name[locale]} (${ar ? "نفد المخزون" : "Out of stock"})`
                }
                onClick={() => {
                  setColourCode(colour.code);
                  const newSizes =
                    Object.keys(colour.allVariants).length > 0
                      ? Object.keys(colour.allVariants)
                      : colour.sizes.length > 0
                        ? colour.sizes
                        : product.sizes;
                  if (!newSizes.includes(selectedSize)) {
                    setSelectedSize(newSizes[0] ?? "");
                  }
                  persistSelection(colour.code, newSizes.includes(selectedSize) ? selectedSize : newSizes[0] ?? "");
                }}
                className={`relative size-11 rounded-full border-2 border-white shadow-xs transition hover:scale-105 ${
                  isSelected
                    ? "ring-2 ring-[var(--brand-700)] ring-offset-2 ring-offset-white"
                    : "shadow-[0_0_0_1px_rgba(0,0,0,.15)]"
                }`}
                style={{ backgroundColor: colour.swatch }}
              >
                {!colour.inStock && !product.availabilityPending && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 m-auto h-[2px] w-[80%] -rotate-45 bg-black/50 shadow-2xs"
                  />
                )}
                {isSelected && (
                  <Check
                    className="absolute inset-0 m-auto drop-shadow-sm"
                    size={17}
                    strokeWidth={2.6}
                    color="#ffffff"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selection */}
      {!product.availabilityPending && (<div>
        <div className="mb-3 flex items-center justify-between text-xs">
          <strong className="font-bold uppercase tracking-[.14em] text-[var(--text-strong)]">
            {ar ? "المقاس" : "Size"}:{" "}
            <span className="font-normal text-[var(--brand-700)]">{size}</span>
            {!isCurrentSelectionInStock && size && (
              <span className="ms-2 rounded-xs border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                {ar ? "غير متوفر" : "Sold out"}
              </span>
            )}
          </strong>
          <button
            type="button"
            onClick={() => { setIsSizeGuideOpen(true); trackProductInteraction("view_size_guide", product.id); }}
            className="flex items-center gap-1.5 font-bold uppercase tracking-[.12em] text-[var(--brand-950)] underline underline-offset-4 transition hover:text-[var(--brand-700)]"
          >
            <Ruler size={14} aria-hidden="true" />
            {ar ? "دليل وحاسبة المقاسات" : "Interactive size guide"}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6">
          {allSizes.map((s) => {
            const isSelected = s === size;
            const inStock = isSizeInStock(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => { setSelectedSize(s); persistSelection(colourCode, s); }}
                aria-pressed={isSelected}
                aria-label={
                  inStock
                    ? s
                    : `${s} (${ar ? "نفد المخزون - اضغط للتنبيه" : "Out of stock - click to notify"})`
                }
                title={
                  inStock
                    ? undefined
                    : ar
                      ? "غير متوفر حالياً"
                      : "Currently out of stock"
                }
                className={`relative min-h-12 overflow-hidden rounded-xs border text-xs font-bold transition ${
                  isSelected
                    ? inStock
                      ? "border-[var(--brand-950)] bg-[var(--brand-950)] text-white shadow-xs"
                      : "border-[var(--brand-700)] bg-[var(--brand-surface)] text-[var(--brand-950)] ring-2 ring-[var(--brand-700)]/20 shadow-xs"
                    : inStock
                      ? "border-[var(--border-subtle)] bg-white text-[var(--text-strong)] hover:border-[var(--brand-700)] hover:bg-[var(--brand-surface)]"
                      : "border-dashed border-neutral-300 bg-neutral-50/60 text-neutral-400 hover:border-neutral-400 hover:text-neutral-700"
                }`}
              >
                {!inStock && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-2 top-1/2 h-[1px] -rotate-12 bg-neutral-400/50"
                  />
                )}
                <span className="relative z-10">{s}</span>
              </button>
            );
          })}
        </div>
      </div>)}

      {product.availabilityPending && <div className="mt-5 text-sm"><button type="button" onClick={() => setIsSizeGuideOpen(true)} className="kova-link inline-flex min-h-11 items-center gap-2"><Ruler size={16} aria-hidden="true"/>{ar ? "دليل وحاسبة المقاسات" : "Interactive size guide"}</button><p className="mt-2 text-xs text-[var(--text-muted)]">{ar ? "قياسات عامة للفئة؛ مقاسات هذا المنتج ومخزونه لم يتم تأكيدها بعد." : "General category measurements; this product’s sizes and stock are awaiting confirmation."}</p></div>}

      {/* Primary Action Buttons */}
      <div className="mt-8 space-y-3">
        {product.availabilityPending ? <div role="status" className="surface-card p-5 text-sm"><p>{ar ? "تفاصيل المقاسات والمخزون لم تُنشر بعد. الشراء غير متاح حتى تأكيدها." : "Sizes and stock have not been published yet. Ordering is unavailable until they are confirmed."}</p><p className="mt-3">{ar ? "مقدم الدفع عند الاستلام" : "COD deposit"}: <strong>{formatMoney(product.codDeposit, locale)}</strong></p><a href="https://wa.me/201096733209" target="_blank" rel="noreferrer" className="kova-link mt-4">{ar ? "اسأل عن التوفر" : "Ask about availability"}</a></div> : isCurrentSelectionInStock ? (
          <Button
            type="button"
            disabled={!size}
            onClick={handleAddToCart}
            className={`w-full text-xs tracking-[.14em] shadow-sm ${
              isAdding ? "bg-[#18794e] hover:bg-[#18794e]" : ""
            }`}
          >
            {isAdding ? (
              <span className="flex items-center gap-2">
                <Check size={18} strokeWidth={2.5} />
                {ar ? "تمت الإضافة للحقيبة بنجاح" : "Added to your bag"}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingBag size={18} strokeWidth={2} />
                {ar ? "إضافة إلى حقيبة التسوق" : "Add to shopping bag"}
              </span>
            )}
          </Button>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setIsNotifyDialogOpen(true)}
              className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xs bg-[var(--brand-950)] px-6 text-xs font-bold uppercase tracking-[.14em] text-white shadow-xs transition hover:bg-[var(--brand-700)] focus:ring-2 focus:ring-[var(--brand-700)]/30"
            >
              <BellRing size={17} className="text-emerald-300" />
              <span>
                {ar ? "أخبرني عند توفر هذا المقاس" : "Notify me when available"}
              </span>
            </button>
            <p className="text-center text-[11px] text-neutral-500">
              {ar
                ? "هذا المقاس أو اللون غير متوفر حالياً. اضغط أعلاه لتصلك رسالة فور توفره."
                : "This size or colour is currently out of stock. Tap above to get alerted the moment it arrives."}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={wished}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xs border border-[var(--border-subtle)] bg-white text-xs font-bold uppercase tracking-[.14em] text-[var(--text-strong)] transition hover:border-[var(--brand-700)] hover:bg-[var(--brand-surface)]"
        >
          <Heart
            size={18}
            strokeWidth={1.8}
            fill={wished ? "currentColor" : "none"}
            className={wished ? "text-[#a5472f]" : "text-[var(--text-strong)]"}
            aria-hidden="true"
          />
          {wished
            ? ar
              ? "محفوظ في قائمة الأمنيات"
              : "Saved in your wishlist"
            : ar
              ? "إضافة إلى قائمة الأمنيات"
              : "Save to wishlist"}
        </button>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideDialog
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        entries={sizeChartEntries}
        category={(product.category as SizeCategory) || "unisex"}
        productTitle={product.title[locale]}
        isProductOverride={isProductOverride}
        availableSizes={selectedColour?.sizes ?? product.sizes}
        locale={locale}
        currentSize={size}
        onSelectSize={product.availabilityPending ? undefined : (newSize) => setSelectedSize(newSize)}
      />

      {/* Stock Notification Modal */}
      {isNotifyDialogOpen && (
        <StockNotifyDialog
          key={`${selectedColour?.code}-${size}`}
          isOpen={isNotifyDialogOpen}
          onClose={() => setIsNotifyDialogOpen(false)}
          product={product}
          locale={locale}
          initialColourCode={selectedColour?.code}
          initialSize={size}
        />
      )}
    </div>
  );
}
