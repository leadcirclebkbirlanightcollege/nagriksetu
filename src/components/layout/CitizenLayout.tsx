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
  LogOut,
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
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <a href="#main" className="skip-link">
        {t("skipToContent")}
      </a>
      <TopUtilityBar />
      {/* Top navigation bar */}
      <header className="border-b border-[#D8DEE6] bg-white">
        <div aria-hidden className="flex h-1 w-full">
          <div className="flex-1 bg-[#E65100]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>
        <div className="gov-container flex items-center gap-3 py-3">
          <button
            className="gov-btn-outline px-2.5 py-1.5 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="citizen-sidebar"
            aria-label="Toggle menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <Logo size={36} />
            <span className="text-lg font-bold text-navy">{t("portalName")}</span>
            <span className="hidden rounded border border-[#BFDBFE] bg-[#EFF6FF] px-2 py-0.5 text-xs font-bold text-[#1E40AF] sm:inline">
              Citizen Portal
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-[#475569] sm:inline">
              Welcome, <span className="font-bold text-navy">{user?.name}</span>
            </span>
            <button onClick={() => signOut()} className="gov-btn-saffron gap-1.5 py-1.5 text-xs font-bold">
              <LogOut className="h-3.5 w-3.5" />
              {t("logout")}
            </button>
          </div>
        </div>
      </header>

      <div className="gov-container flex flex-1 gap-6 py-6">
        {/* Sidebar */}
        <aside
          id="citizen-sidebar"
          className={`${open ? "block" : "hidden"} w-full shrink-0 lg:block lg:w-64`}
          aria-label="Citizen navigation"
        >
          <nav className="gov-card sticky top-4 overflow-hidden shadow-sm">
            <div className="border-b border-[#082B4E] bg-navy px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                Citizen Dashboard
              </p>
            </div>
            <ul className="divide-y divide-[#F1F5F9] p-1.5">
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
                            ? "border-l-[3px] border-saffron bg-[#EFF6FF] text-navy font-bold shadow-xs"
                            : "text-[#334155] hover:bg-[#F8FAFC] hover:text-navy"
                        }`
                      }
                    >
                      <IconComponent className="h-4 w-4 shrink-0 text-[#0B3C6D]" />
                      {n.label}
                    </NavLink>
                  </li>
                )
              })}
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

