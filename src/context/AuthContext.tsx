import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { ReactNode } from "react"
import { apiGetMe, apiLogin, apiRegister, apiForgotPassword, apiResetPassword, clearToken, getToken } from "../lib/api"
import type { AppUser, UserRole } from "../types"

interface AuthContextValue {
  user: AppUser | null
  loading: boolean
  demoMode: boolean
  signIn: (email: string, password: string, role?: UserRole) => Promise<void>
  signUp: (name: string, email: string, password: string, phone?: string, ward?: string, address?: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const me = await apiGetMe()
      setUser(me)
    } catch (err) {
      console.warn("Session restore failed, clearing token", err)
      clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const signIn = useCallback(
    async (email: string, password: string, role?: UserRole) => {
      const res = await apiLogin(email, password, role)
      setUser(res.user)
    },
    [],
  )

  const signUp = useCallback(
    async (name: string, email: string, password: string, phone?: string, ward?: string, address?: string) => {
      const res = await apiRegister({ name, email, password, phone, ward, address })
      setUser(res.user)
    },
    [],
  )

  const forgotPassword = useCallback(async (email: string) => {
    await apiForgotPassword(email)
  }, [])

  const resetPassword = useCallback(async (password: string) => {
    if (!user?.email) throw new Error("No user email available for reset")
    await apiResetPassword(user.email, password)
  }, [user])

  const signOut = useCallback(async () => {
    clearToken()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        demoMode: false,
        signIn,
        signUp,
        forgotPassword,
        resetPassword,
        signOut,
        refreshUser,
      }}
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
