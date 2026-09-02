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
    <nav className="border-b border-navy-dark bg-navy text-white shadow-sm" aria-label="Primary navigation">
      <div className="gov-container">
        {/* Mobile menu trigger row */}
        <div className="flex items-center justify-between py-2 md:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-white/90">
            Citizen Navigation
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-gov border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="primary-nav-links"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
            <span>{open ? "Close" : "Menu"}</span>
          </button>
        </div>

        {/* Navigation links list */}
        <ul
          id="primary-nav-links"
          className={`${
            open ? "block divide-y divide-white/10 border-t border-white/10 pb-2 animate-in slide-in-from-top-2 duration-150" : "hidden"
          } md:flex md:flex-wrap md:divide-y-0 md:border-t-0 md:pb-0`}
        >
          {links.map((l) => (
            <li key={l.to} className="shrink-0">
              <NavLink
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block border-b-4 px-3.5 py-2.5 text-xs sm:text-[13px] font-bold tracking-wide transition-all ${
                    isActive
                      ? "border-saffron bg-navy-dark text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                      : "border-transparent text-white/90 hover:bg-navy-dark/70 hover:text-white"
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
