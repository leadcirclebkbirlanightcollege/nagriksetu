// Typed, centralised access to Vite environment variables.
// Safe defaults keep the app running in demo mode when no .env is present.

function fallbackOrigin(): string {
  if (typeof window !== "undefined" && window.location) {
    return window.location.origin
  }
  return "http://localhost:5173"
}

export const env = {
  supabaseUrl: (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "",
  supabaseAnonKey:
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? "",
  siteUrl:
    (import.meta.env.VITE_SITE_URL as string | undefined) || fallbackOrigin(),
  mapDefaultLat: Number(import.meta.env.VITE_MAP_DEFAULT_LAT ?? 19.076),
  mapDefaultLng: Number(import.meta.env.VITE_MAP_DEFAULT_LNG ?? 72.8777),
  mapDefaultZoom: Number(import.meta.env.VITE_MAP_DEFAULT_ZOOM ?? 12),
  rateLimitMax: Number(import.meta.env.VITE_RATE_LIMIT_MAX ?? 5),
  rateLimitWindowMs: Number(import.meta.env.VITE_RATE_LIMIT_WINDOW_MS ?? 60000),
}

/** True when Supabase credentials are configured. */
export const hasSupabase = Boolean(env.supabaseUrl && env.supabaseAnonKey)
