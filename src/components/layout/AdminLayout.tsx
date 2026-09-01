import { NavLink, Outlet, Link } from "react-router-dom"
import { useState } from "react"
import Logo from "../brand/Logo"
import TopUtilityBar from "./TopUtilityBar"
import { useAuth } from "../../context/AuthContext"

const nav = [
  { to: "/admin", label: "Dashboard Overview", icon: "📊", end: true },
  { to: "/admin/complaints", label: "Complaint Management", icon: "🗂️" },
  { to: "/admin/users", label: "User Management", icon: "👥" },
  { to: "/admin/surveys", label: "Survey Analytics", icon: "📈" },
  { to: "/admin/categories", label: "Category Management", icon: "🏷️" },
  { to: "/admin/areas", label: "Area Management", icon: "🗺️" },
  { to: "/admin/reports", label: "Reports & Export", icon: "📄" },
  { to: "/admin/logs", label: "Activity Logs", icon: "🧾" },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <a href="#main" className="skip-link">Skip to main content</a>
      <TopUtilityBar />
      <header className="border-b border-line bg-navy text-white">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <button
            className="rounded-gov border border-white/30 px-3 py-1.5 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="admin-sidebar"
          >
            ☰
          </button>
          <Link to="/" className="flex items-center gap-2">
            <Logo size={38} />
            <span className="text-lg font-bold">NagrikSetu</span>
            <span className="hidden rounded bg-white/15 px-2 py-0.5 text-xs font-semibold sm:inline">
              Admin Console
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="hidden sm:inline">{user?.name} • Dept. Officer</span>
            <button onClick={() => signOut()} className="gov-btn-saffron">Logout</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          id="admin-sidebar"
          className={`${open ? "block" : "hidden"} w-full shrink-0 border-r border-line bg-white lg:block lg:w-64`}
          aria-label="Admin navigation"
        >
          <nav className="sticky top-0 p-3">
            <ul className="space-y-1">
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    end={n.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-gov px-3 py-2.5 text-sm font-medium ${
                        isActive
                          ? "bg-navy text-white"
                          : "text-ink hover:bg-surface"
                      }`
                    }
                  >
                    <span aria-hidden>{n.icon}</span>
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main id="main" className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
