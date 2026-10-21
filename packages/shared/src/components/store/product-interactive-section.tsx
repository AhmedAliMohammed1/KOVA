'use client';

import { useState, type ReactNode } from 'react';
import type { Product } from '@/features/catalog/types';
import type { Locale } from '@/lib/i18n';
import type { SizeChartEntry } from '@/features/catalog/size-guide-types';
import { ProductGallery } from './product-gallery';
import { AddProduct } from './add-product';

export function ProductInteractiveSection({
  product,
  locale,
  sizeChartEntries,
  isProductOverride,
  headerContent,
  footerContent,
  initialColourCode,
  initialSize,
}: {
  product: Product;
  locale: Locale;
  sizeChartEntries?: SizeChartEntry[];
  isProductOverride?: boolean;
  headerContent: ReactNode;
  footerContent?: ReactNode;
  initialColourCode?: string;
  initialSize?: string;
}) {
  const initialColour =
    product.colors.find((colour) => colour.code === initialColourCode) ?? product.colors.find((colour) => colour.inStock) ?? product.colors[0];
  const [selectedColourCode, setSelectedColourCode] = useState(
    initialColour?.code ?? product.colorCode ?? '',
  );

  return (
    <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
      {/* Dynamic Gallery */}
      <div className="min-w-0 w-full">
        <ProductGallery
          product={product}
          selectedColourCode={selectedColourCode}
          locale={locale}
        />
      </div>

      {/* Purchase Details */}
      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start lg:py-2">
        {headerContent}

        <AddProduct
          product={product}
          locale={locale}
          initialSize={initialSize}
          sizeChartEntries={sizeChartEntries}
          isProductOverride={isProductOverride}
          selectedColourCode={selectedColourCode}
          onSelectColourCode={setSelectedColourCode}
        />

        {footerContent}
      </div>
    </div>
  );
}
