import { describe, expect, it } from "vitest";
import { DevelopmentCatalog } from "../../packages/shared/src/features/catalog/development-catalog";
describe("KOVA catalog contract",()=>{
 const catalog=new DevelopmentCatalog();
 it("contains only the two owner-approved new KOVA products",async()=>{
 const products=await catalog.featured();expect(products.map(p=>p.slug)).toEqual(["kova-womens-scrub-set","kova-mens-scrub-set"]);
 expect(products.map(p=>p.price)).toEqual([85000,85000]);expect(products.map(p=>p.codDeposit)).toEqual([20000,20000]);
 expect(products[0].colors.map(c=>c.code)).toEqual(["grey","blue","burgundy"]);expect(products[1].colors.map(c=>c.code)).toEqual(["black"]);
 });
 it("does not invent inventory or purchasable variants",async()=>{for(const p of await catalog.featured()){expect(p.inStock).toBe(false);expect(p.availabilityPending).toBe(true);expect(p.sizes).toEqual([]);expect(p.colors.every(c=>Object.keys(c.allVariants).length===0)).toBe(true);}});
 it("excludes retired Scrub Vibe slugs",async()=>{expect(await catalog.bySlug("female-design-2-scrub-set")).toBeNull();});
 it("uses all 63 garment photos in the correct color galleries",async()=>{const products=await catalog.featured();expect(products.map(p=>p.images?.length)).toEqual([50,13]);expect(products.flatMap(p=>p.images??[]).every(i=>i.colourCode&&i.src.startsWith('/images/kova/'))).toBe(true);});
});
