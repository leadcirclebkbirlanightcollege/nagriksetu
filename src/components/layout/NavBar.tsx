import { NavLink } from "react-router-dom"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useLanguage } from "../../context/LanguageContext"

export default function NavBar() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  const links: { to: string; label: string; end?: boolean }[] = [
    { to: "/", label: t("home"), end: true },
    { to: "/report", label: t("reportIssue") },
    { to: "/track", label: t("trackComplaint") },
    { to: "/community", label: t("community") },
    { to: "/survey", label: t("survey") },
    { to: "/guidelines", label: t("guidelines") },
    { to: "/about", label: t("about") },
    { to: "/contact", label: t("contact") },
  ]

  return (
    <nav className="border-b border-[#082B4E] bg-navy text-white shadow-sm" aria-label="Primary">
      <div className="gov-container">
        <div className="flex items-center justify-between py-2 md:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">Navigation Menu</span>
          <button
            className="inline-flex items-center gap-2 rounded-gov border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="primary-menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span>{open ? "Close" : "Menu"}</span>
          </button>
        </div>
        <ul
          id="primary-menu"
          className={`${open ? "block divide-y divide-white/10 border-t border-white/10 pb-2" : "hidden"} md:flex md:flex-wrap md:divide-y-0 md:border-t-0 md:pb-0`}
        >
          {links.map((l) => (
            <li key={l.to} className="shrink-0">
              <NavLink
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block border-b-[3px] px-3.5 py-3 text-[13px] font-bold tracking-wide transition-all ${
                    isActive
                      ? "border-saffron bg-[#082B4E] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]"
                      : "border-transparent text-white/90 hover:bg-[#082B4E]/80 hover:text-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

