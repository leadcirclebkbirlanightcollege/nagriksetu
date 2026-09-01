import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { ReactNode } from "react"
import { supabase, hasSupabase } from "../lib/supabase"
import type { AppUser, UserRole } from "../types"

interface AuthContextValue {
  user: AppUser | null
  loading: boolean
  demoMode: boolean
  signIn: (email: string, password: string, role: UserRole) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const DEMO_KEY = "ns_demo_user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function bootstrap() {
      if (!hasSupabase || !supabase) {
        const stored = localStorage.getItem(DEMO_KEY)
        if (stored) setUser(JSON.parse(stored))
        setLoading(false)
        return
      }
      const { data } = await supabase.auth.getUser()
      if (active && data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()
        setUser({
          id: data.user.id,
          email: data.user.email ?? "",
          name: profile?.full_name ?? data.user.email ?? "Citizen",
          role: (profile?.role as UserRole) ?? "citizen",
          phone: profile?.phone ?? undefined,
        })
      }
      setLoading(false)
    }
    bootstrap()
    return () => {
      active = false
    }
  }, [])

  const signIn = useCallback(
    async (email: string, password: string, role: UserRole) => {
      if (!hasSupabase || !supabase) {
        const demo: AppUser = {
          id: "demo-" + role,
          email,
          name: role === "admin" ? "Department Officer" : "Demo Citizen",
          role,
        }
        localStorage.setItem(DEMO_KEY, JSON.stringify(demo))
        setUser(demo)
        return
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()
      setUser({
        id: data.user.id,
        email: data.user.email ?? email,
        name: profile?.full_name ?? email,
        role: (profile?.role as UserRole) ?? role,
        phone: profile?.phone ?? undefined,
      })
    },
    [],
  )

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (!hasSupabase || !supabase) {
      const demo: AppUser = { id: "demo-citizen", email, name, role: "citizen" }
      localStorage.setItem(DEMO_KEY, JSON.stringify(demo))
      setUser(demo)
      return
    }
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: name,
        role: "citizen",
      })
    }
  }, [])

  const forgotPassword = useCallback(async (email: string) => {
    if (!hasSupabase || !supabase) return
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    })
    if (error) throw error
  }, [])

  const resetPassword = useCallback(async (password: string) => {
    if (!hasSupabase || !supabase) return
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    if (hasSupabase && supabase) await supabase.auth.signOut()
    localStorage.removeItem(DEMO_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, loading, demoMode: !hasSupabase, signIn, signUp, forgotPassword, resetPassword, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
