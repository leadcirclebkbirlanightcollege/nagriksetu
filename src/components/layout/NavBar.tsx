import { NavLink } from "react-router-dom"
import { useState } from "react"
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
    <nav className="bg-navy text-white" aria-label="Primary">
      <div className="gov-container">
        <button
          className="gov-btn w-full justify-between text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="primary-menu"
        >
          <span>☰ Menu</span>
        </button>
        <ul
          id="primary-menu"
          className={`${open ? "block" : "hidden"} md:flex md:flex-wrap`}
        >
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block border-b-2 px-4 py-3 text-sm font-medium transition-colors md:border-b-4 ${
                    isActive
                      ? "border-saffron bg-navy-light text-white"
                      : "border-transparent text-white/90 hover:bg-navy-light hover:text-white"
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
