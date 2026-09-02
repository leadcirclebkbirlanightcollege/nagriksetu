import { NavLink, Outlet, Link } from "react-router-dom"
import { useState } from "react"
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Search,
  Bell,
  User,
  MessageSquareQuote,
  Menu,
  X,
  LogOut,
  Shield,
} from "lucide-react"
import Logo from "../brand/Logo"
import TopUtilityBar from "./TopUtilityBar"
import { useAuth } from "../../context/AuthContext"
import { useLanguage } from "../../context/LanguageContext"

const nav = [
  { to: "/citizen", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/citizen/complaints", label: "My Complaints", icon: ClipboardList },
  { to: "/citizen/report", label: "Report New Issue", icon: PlusCircle },
  { to: "/citizen/status", label: "Complaint Status", icon: Search },
  { to: "/citizen/notifications", label: "Notifications", icon: Bell },
  { to: "/citizen/profile", label: "Profile", icon: User },
  { to: "/citizen/feedback", label: "Feedback", icon: MessageSquareQuote },
]

export default function CitizenLayout() {
  const { user, signOut } = useAuth()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <a href="#main" className="skip-link">
        {t("skipToContent") || "Skip to main content"}
      </a>
      <TopUtilityBar />

      {/* Citizen Portal Header */}
      <header className="border-b border-line bg-white shadow-xs">
        <div aria-hidden="true" className="flex h-1 w-full">
          <div className="flex-1 bg-saffron" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-govGreen" />
        </div>
        <div className="gov-container flex items-center gap-3 py-3">
          <button
            type="button"
            className="gov-btn-outline px-2.5 py-1.5 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="citizen-sidebar"
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
          <Link to="/" className="flex items-center gap-2.5" aria-label="NagrikSetu Home">
            <Logo size={34} />
            <span className="text-lg font-extrabold tracking-tight text-navy">{t("portalName")}</span>
            <span className="hidden items-center gap-1 rounded-gov border border-line bg-navy-tint px-2 py-0.5 text-xs font-bold text-navy sm:inline-flex">
              <Shield className="h-3 w-3 text-navy" aria-hidden="true" />
              Citizen Services
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-ink-muted sm:inline">
              Namaste, <strong className="text-navy font-bold">{user?.name}</strong>
            </span>
            <button
              onClick={() => signOut()}
              className="gov-btn-saffron gap-1.5 py-1.5 px-3 text-xs font-bold shadow-xs"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="gov-container flex flex-1 gap-6 py-6">
        {/* Mobile Backdrop Overlay */}
        {open ? (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        ) : null}

        {/* Citizen Sidebar Navigation */}
        <aside
          id="citizen-sidebar"
          className={`${
            open ? "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-elevated p-4 overflow-y-auto block" : "hidden"
          } shrink-0 lg:static lg:z-auto lg:block lg:w-64 lg:p-0 lg:bg-transparent lg:shadow-none`}
          aria-label="Citizen navigation menu"
        >
          {open ? (
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-line lg:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-navy">Citizen Menu</span>
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

          <nav className="gov-card sticky top-4 overflow-hidden shadow-sm">
            <div className="border-b border-navy-dark bg-navy px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                Citizen Portal Navigation
              </p>
            </div>
            <ul className="divide-y divide-lineSubtle p-1.5">
              {nav.map((n) => {
                const IconComponent = n.icon
                return (
                  <li key={n.to}>
                    <NavLink
                      to={n.to}
                      end={n.end}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-gov px-3.5 py-2.5 text-sm font-semibold transition-all ${
                          isActive
                            ? "border-l-4 border-saffron bg-navy-tint text-navy font-bold shadow-xs"
                            : "text-ink hover:bg-surface hover:text-navy"
                        }`
                      }
                    >
                      <IconComponent className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
                      <span>{n.label}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main id="main" className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
