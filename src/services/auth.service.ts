// Authentication service wrapping Supabase Auth + profiles.
import { requireSupabase } from "../lib/supabase"
import { env } from "../lib/env"
import { profilesRepository } from "../repositories/profiles.repository"
import { toUser } from "../lib/mappers"
import type { AppUser } from "../types"

export interface RegisterArgs {
  name: string
  email: string
  password: string
  phone?: string
}

export const authService = {
  async register(args: RegisterArgs): Promise<{ needsVerification: boolean }> {
    const db = requireSupabase()
    const meta: Record<string, string> = { full_name: args.name }
    if (args.phone) meta.phone = args.phone
    const { data, error } = await db.auth.signUp({
      email: args.email,
      password: args.password,
      options: {
        data: meta,
        emailRedirectTo: env.siteUrl + "/auth/callback",
      },
    })
    if (error) throw new Error(error.message)
    return { needsVerification: !data.session }
  },

  async login(email: string, password: string): Promise<AppUser> {
    const db = requireSupabase()
    const { data, error } = await db.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    const profile = await profilesRepository.get(data.user.id)
    if (profile) return profile
    return toUser({
      id: data.user.id,
      full_name: data.user.user_metadata?.full_name ?? null,
      email: data.user.email ?? null,
      phone: null,
      role: "citizen",
      gender: null,
      age: null,
      ward_id: null,
      area_id: null,
      avatar_url: null,
      language: "en",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  },

  async logout(): Promise<void> {
    await requireSupabase().auth.signOut()
  },

  async forgotPassword(email: string): Promise<void> {
    const db = requireSupabase()
    const { error } = await db.auth.resetPasswordForEmail(email, {
      redirectTo: env.siteUrl + "/reset-password",
    })
    if (error) throw new Error(error.message)
  },

  async resetPassword(newPassword: string): Promise<void> {
    const db = requireSupabase()
    const { error } = await db.auth.updateUser({ password: newPassword })
    if (error) throw new Error(error.message)
  },

  async resendVerification(email: string): Promise<void> {
    const db = requireSupabase()
    const { error } = await db.auth.resend({ type: "signup", email })
    if (error) throw new Error(error.message)
  },

  /** Current session user resolved to a full profile, or null. */
  async currentUser(): Promise<AppUser | null> {
    const db = requireSupabase()
    const { data } = await db.auth.getUser()
    if (!data.user) return null
    const profile = await profilesRepository.get(data.user.id)
    return profile
  },
}
