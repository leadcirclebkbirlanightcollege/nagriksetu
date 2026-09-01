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
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <a href="#main" className="skip-link">Skip to main content</a>
      <TopUtilityBar />
      <header className="border-b border-[#082B4E] bg-navy text-white shadow-sm">
        <div className="gov-container flex items-center gap-3 py-3">
          <button
            className="rounded-gov border border-white/30 bg-white/10 px-2.5 py-1.5 text-white hover:bg-white/20 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="admin-sidebar"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex shrink-0 items-center justify-center rounded border border-white/20 bg-white/10 p-1">
              <Logo size={32} />
            </div>
            <span className="text-lg font-extrabold tracking-tight">NagrikSetu</span>
            <span className="hidden items-center gap-1 rounded border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-bold sm:inline-flex">
              <ShieldCheck className="h-3 w-3 text-saffron" />
              Admin Console
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-3 text-xs">
            <span className="hidden font-medium text-white/90 sm:inline">
              <span className="font-bold text-white">{user?.name}</span> • Dept. Officer
            </span>
            <button onClick={() => signOut()} className="gov-btn-saffron gap-1.5 py-1.5 text-xs font-bold">
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          id="admin-sidebar"
          className={`${open ? "block" : "hidden"} w-full shrink-0 border-r border-[#CBD5E1] bg-white shadow-sm lg:block lg:w-64`}
          aria-label="Admin navigation"
        >
          <div className="border-b border-[#E2E8F0] bg-[#F1F5F9] px-4 py-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
              Department Navigation
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
                            ? "bg-navy text-white shadow-xs font-bold"
                            : "text-[#334155] hover:bg-[#F1F5F9] hover:text-navy"
                        }`
                      }
                    >
                      <IconComponent className="h-4 w-4 shrink-0" />
                      {n.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>
        <main id="main" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

