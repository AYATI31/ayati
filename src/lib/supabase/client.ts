"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";
import { requireSupabasePublicConfig } from "@/lib/supabase/public-config";

export function createSupabaseBrowserClient() {
  const { publishableKey, url } = requireSupabasePublicConfig();

  return createBrowserClient<Database>(url, publishableKey);
}
