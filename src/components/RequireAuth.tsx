import { Navigate, useLocation } from "react-router-dom"
import type { ReactNode } from "react"
import { useAuth } from "../context/AuthContext"
import type { UserRole } from "../types"

export default function RequireAuth({
  children,
  role,
}: {
  children: ReactNode
  role: UserRole
}) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="gov-container py-20 text-center text-muted">Loading…</div>
    )
  }
  if (!user) {
    const to = role === "admin" ? "/admin/login" : "/login"
    return <Navigate to={to} state={{ from: location }} replace />
  }
  if (user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/citizen"} replace />
  }
  return <>{children}</>
}
