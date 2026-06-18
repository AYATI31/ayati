import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { requireSupabaseServerConfig } from "@/lib/supabase/server-config";

export function createSupabaseAdminClient() {
  const { secretKey, url } = requireSupabaseServerConfig();

  return createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
