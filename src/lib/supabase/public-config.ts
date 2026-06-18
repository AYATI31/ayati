export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    isConfigured: Boolean(url && publishableKey),
    publishableKey,
    url
  };
}

export function requireSupabasePublicConfig() {
  const config = getSupabasePublicConfig();

  if (!config.url || !config.publishableKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return {
    publishableKey: config.publishableKey,
    url: config.url
  };
}
