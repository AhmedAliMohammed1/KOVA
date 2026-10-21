import { kovaCatalog } from "./kova-catalog";
import type { CatalogRepository } from "./repository";

export class DevelopmentCatalog implements CatalogRepository {
  async featured() {
    return kovaCatalog;
  }

  async bySlug(slug: string) {
    return kovaCatalog.find((product) => product.slug === slug) ?? null;
  }
}
