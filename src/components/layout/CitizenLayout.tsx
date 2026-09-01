import { NavLink, Outlet, Link } from "react-router-dom"
import { useState } from "react"
import Logo from "../brand/Logo"
import TopUtilityBar from "./TopUtilityBar"
import { useAuth } from "../../context/AuthContext"
import { useLanguage } from "../../context/LanguageContext"

const nav = [
  { to: "/citizen", label: "Dashboard", icon: "🏠", end: true },
  { to: "/citizen/complaints", label: "My Complaints", icon: "📋" },
  { to: "/citizen/report", label: "Report New Issue", icon: "➕" },
  { to: "/citizen/status", label: "Complaint Status", icon: "🔍" },
  { to: "/citizen/notifications", label: "Notifications", icon: "🔔" },
  { to: "/citizen/profile", label: "Profile", icon: "👤" },
  { to: "/citizen/feedback", label: "Feedback", icon: "💬" },
]

export default function CitizenLayout() {
  const { user, signOut } = useAuth()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <a href="#main" className="skip-link">
        {t("skipToContent")}
      </a>
      <TopUtilityBar />
      {/* Top navigation bar */}
      <header className="border-b border-line bg-white">
        <div aria-hidden className="flex h-1">
          <div className="flex-1 bg-saffron" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-india-green" />
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5">
          <button
            className="gov-btn-outline px-3 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="citizen-sidebar"
          >
            ☰
          </button>
          <Link to="/" className="flex items-center gap-2">
            <Logo size={40} />
            <span className="text-lg font-bold text-navy">{t("portalName")}</span>
            <span className="hidden rounded bg-surfaceAlt px-2 py-0.5 text-xs font-semibold text-navy sm:inline">
              Citizen Portal
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">
              Welcome, <span className="font-semibold text-ink">{user?.name}</span>
            </span>
            <button onClick={() => signOut()} className="gov-btn-saffron">
              {t("logout")}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-gov flex-1 gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside
          id="citizen-sidebar"
          className={`${open ? "block" : "hidden"} w-full shrink-0 lg:block lg:w-64`}
          aria-label="Citizen navigation"
        >
          <nav className="gov-card sticky top-4 overflow-hidden">
            <p className="border-b border-line bg-navy px-4 py-2.5 text-sm font-bold text-white">
              Citizen Dashboard
            </p>
            <ul className="p-2">
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    end={n.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-gov px-3 py-2.5 text-sm font-medium ${
                        isActive
                          ? "bg-surfaceAlt text-navy border-l-4 border-saffron"
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

        {/* Content */}
        <main id="main" className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
