import { afterEach, describe, expect, it, vi } from "vitest";
import { shopStorageKey } from "../../packages/shared/src/lib/shop-storage";
import { isRetiredCatalogId } from "../../packages/shared/src/features/catalog/retired-catalog";
afterEach(() => vi.unstubAllEnvs());
describe("database-specific shopping state", () => {
  it("preserves the original storage and isolates the new database", () => {
    expect(shopStorageKey("https://iqufqtjotgpmhhtvlxwf.supabase.co")).toBe("scrub-vibe-shop");
    expect(shopStorageKey("https://khccehpehasicomumani.supabase.co")).toBe("kova-shop-khccehpehasicomumani");
  });
  it("does not retire a new product because its numeric ID matches an old product", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://iqufqtjotgpmhhtvlxwf.supabase.co");
    expect(isRetiredCatalogId("6")).toBe(true);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://khccehpehasicomumani.supabase.co");
    expect(isRetiredCatalogId("6")).toBe(false);
  });
});
