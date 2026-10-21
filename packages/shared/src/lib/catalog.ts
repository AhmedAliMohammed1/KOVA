import { DevelopmentCatalog } from "../features/catalog/development-catalog";
import type { CatalogRepository } from "../features/catalog/repository";
import { hasSupabaseEnvironment } from "./supabase/config";
import { createPublicClient } from "./supabase/public";
import { SupabaseCatalog } from "../server/catalog/supabase-catalog";
import { isLocalCatalogPreview } from "./catalog-preview";

export const catalog: CatalogRepository = hasSupabaseEnvironment() && !isLocalCatalogPreview()
  ? new SupabaseCatalog(createPublicClient)
  : new DevelopmentCatalog();
