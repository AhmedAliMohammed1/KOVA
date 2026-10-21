import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductCard } from "../../packages/shared/src/components/store/product-card";
import { kovaCatalog } from "../../packages/shared/src/features/catalog/kova-catalog";

vi.mock("@/components/store/cart-provider", () => ({useShop:()=>({wishlist:[],toggleWishlist:vi.fn()})}));
afterEach(cleanup);

describe("product card colour selection", () => {
  it.each([['en','Blue'],['ar','أزرق']] as const)("previews and carries the selected colour into every product link in %s", (locale,label) => {
    const product=kovaCatalog[0];
    const {container}=render(<ProductCard product={product} locale={locale}/>);
    fireEvent.click(screen.getByRole('button',{name:label,exact:true}));
    expect(screen.getByRole('button',{name:label,exact:true})).toHaveAttribute('aria-pressed','true');
    const blue=product.images!.find(image=>image.colourCode==='blue')!;
    expect(screen.getByRole('img')).toHaveAttribute('alt',blue.alt[locale]);
    for(const link of container.querySelectorAll('a')) {
      const url=new URL(link.getAttribute('href')!, 'https://example.com');
      expect(url.pathname).toBe(`/${locale}/products/${product.slug}`);
      expect(url.searchParams.get('colour')).toBe('blue');
    }
    expect(screen.getAllByRole('button',{pressed:true})).toHaveLength(1);
  });
});
