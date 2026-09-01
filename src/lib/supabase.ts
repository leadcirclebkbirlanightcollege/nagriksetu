import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"
import { env, hasSupabase } from "./env"

/**
 * Supabase is optional in development. When credentials are missing the app
 * runs in "demo mode" using the bundled mock data so the UI is always usable.
 */
export { hasSupabase }

export const supabase: SupabaseClient<Database> | null = hasSupabase
  ? createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

/**
 * Returns the Supabase client or throws if it is not configured. Use this in
 * service/repository code paths that require the backend.
 */
export function requireSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable the backend.",
    )
  }
  return supabase
}

if (!hasSupabase) {
  // eslint-disable-next-line no-console
  console.warn(
    "[NagrikSetu] Supabase credentials not found — running in demo mode with mock data. " +
      "Copy .env.example to .env and add your project keys to enable the backend.",
  )
}
