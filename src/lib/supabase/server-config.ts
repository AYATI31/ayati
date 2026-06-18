import "server-only";

export function getSupabaseServerConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  return {
    isConfigured: Boolean(url && secretKey),
    secretKey,
    url
  };
}

export function requireSupabaseServerConfig() {
  const config = getSupabaseServerConfig();

  if (!config.url || !config.secretKey) {
    throw new Error("Supabase server environment variables are not configured.");
  }

  return {
    secretKey: config.secretKey,
    url: config.url
  };
}
