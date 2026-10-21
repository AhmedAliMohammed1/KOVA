import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseEnvironment } from "./config";
import { fetchPublicData } from "./public-fetch";

export function createPublicClient() {
  const { url, publishableKey } = getSupabaseEnvironment();

  return createClient<Database>(url, publishableKey, {
    global: { fetch: fetchPublicData },
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
