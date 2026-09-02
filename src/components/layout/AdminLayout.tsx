import { NavLink, Outlet, Link } from "react-router-dom"
import { useState } from "react"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  BarChart3,
  Tags,
  MapPin,
  FileSpreadsheet,
  History,
  Menu,
  X,
  LogOut,
  ShieldCheck,
} from "lucide-react"
import Logo from "../brand/Logo"
import TopUtilityBar from "./TopUtilityBar"
import { useAuth } from "../../context/AuthContext"

const nav = [
  { to: "/admin", label: "Dashboard Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/complaints", label: "Complaint Management", icon: FolderKanban },
  { to: "/admin/users", label: "User Management", icon: Users },
  { to: "/admin/surveys", label: "Survey Analytics", icon: BarChart3 },
  { to: "/admin/categories", label: "Category Management", icon: Tags },
  { to: "/admin/areas", label: "Area Management", icon: MapPin },
  { to: "/admin/reports", label: "Reports & Export", icon: FileSpreadsheet },
  { to: "/admin/logs", label: "Activity Logs", icon: History },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <TopUtilityBar />

      {/* Admin Header Bar */}
      <header className="border-b border-navy-dark bg-navy text-white shadow-sm">
        <div aria-hidden="true" className="flex h-1 w-full">
          <div className="flex-1 bg-saffron" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-govGreen" />
        </div>
        <div className="gov-container flex items-center gap-3 py-3">
          <button
            type="button"
            className="rounded-gov border border-white/20 bg-white/10 px-2.5 py-1.5 text-white hover:bg-white/20 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="admin-sidebar"
            aria-label="Toggle department navigation"
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
          <Link to="/" className="flex items-center gap-2.5" aria-label="NagrikSetu Home">
            <div className="flex shrink-0 items-center justify-center rounded border border-white/20 bg-white/10 p-1">
              <Logo size={32} />
            </div>
            <span className="text-lg font-extrabold tracking-tight">NagrikSetu</span>
            <span className="hidden items-center gap-1.5 rounded-gov border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-bold sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5 text-saffron" aria-hidden="true" />
              Administrative Console
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-3 text-xs">
            <span className="hidden font-medium text-white/90 sm:inline">
              <strong className="font-bold text-white">{user?.name}</strong> • Municipal Officer
            </span>
            <button
              onClick={() => signOut()}
              className="gov-btn-saffron gap-1.5 py-1.5 px-3 text-xs font-bold shadow-xs"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Mobile Backdrop Overlay */}
        {open ? (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        ) : null}

        {/* Admin Navigation Sidebar */}
        <aside
          id="admin-sidebar"
          className={`${
            open ? "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-elevated p-4 overflow-y-auto block" : "hidden"
          } shrink-0 border-r border-line bg-white shadow-xs lg:static lg:z-auto lg:block lg:w-64 lg:p-0`}
          aria-label="Department administrative navigation"
        >
          {open ? (
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-line lg:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-navy">Department Console</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 text-ink-muted hover:text-ink"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          ) : null}

          <div className="border-b border-line bg-surfaceAlt px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Department Operations
            </p>
          </div>
          <nav className="sticky top-0 p-2">
            <ul className="space-y-1">
              {nav.map((n) => {
                const IconComponent = n.icon
                return (
                  <li key={n.to}>
                    <NavLink
                      to={n.to}
                      end={n.end}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-gov px-3 py-2.5 text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-navy text-white shadow-xs font-bold border-l-4 border-saffron"
                            : "text-ink hover:bg-surfaceAlt hover:text-navy"
                        }`
                      }
                    >
                      <IconComponent className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{n.label}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Admin Content Area */}
        <main id="main" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
