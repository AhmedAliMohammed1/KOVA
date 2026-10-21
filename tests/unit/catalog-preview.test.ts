import { afterEach, describe, expect, it, vi } from "vitest";
import { isLocalCatalogPreview } from "../../packages/shared/src/lib/catalog-preview";

afterEach(() => vi.unstubAllEnvs());
describe("local draft catalog preview", () => {
  it("requires explicit opt-in and a local application origin", () => {
    vi.stubEnv("VERCEL", "");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3200");
    vi.stubEnv("KOVA_LOCAL_CATALOG_PREVIEW", "false");
    expect(isLocalCatalogPreview()).toBe(false);
    vi.stubEnv("KOVA_LOCAL_CATALOG_PREVIEW", "true");
    expect(isLocalCatalogPreview()).toBe(true);
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.com");
    expect(isLocalCatalogPreview()).toBe(false);
  });
  it("cannot expose the preview on Vercel even with a localhost origin", () => {
    vi.stubEnv("KOVA_LOCAL_CATALOG_PREVIEW", "true");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3200");
    vi.stubEnv("VERCEL", "1");
    expect(isLocalCatalogPreview()).toBe(false);
  });
});
