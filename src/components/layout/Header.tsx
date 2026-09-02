import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Search, User, ShieldCheck, LogOut, X } from "lucide-react"
import Logo from "../brand/Logo"
import { useLanguage } from "../../context/LanguageContext"
import { useAuth } from "../../context/AuthContext"

export default function Header() {
  const { t } = useLanguage()
  const { user, signOut } = useAuth()
  const [query, setQuery] = useState("")
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const navigate = useNavigate()

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      navigate(`/track?q=${encodeURIComponent(q)}`)
      setMobileSearchOpen(false)
    }
  }

  return (
    <header className="border-b border-line bg-white">
      {/* National tricolour accent strip */}
      <div aria-hidden="true" className="flex h-1.5 w-full">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-govGreen" />
      </div>

      <div className="gov-container py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Official Emblem & Portal Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-95 shrink-0"
            aria-label="NagrikSetu home"
          >
            <div className="flex shrink-0 items-center justify-center rounded-gov border border-lineSubtle bg-surface p-1.5 shadow-xs">
              <Logo size={44} />
            </div>
            <div className="leading-tight">
              <span className="block text-xl sm:text-2xl font-extrabold tracking-tight text-navy">
                {t("portalName")}
              </span>
              <span className="block max-w-[16rem] sm:max-w-sm text-[11px] font-semibold uppercase tracking-wider text-ink-muted truncate">
                {t("tagline")}
              </span>
            </div>
          </Link>

          {/* Desktop / Tablet Search Bar */}
          <form
            onSubmit={onSearch}
            role="search"
            className="hidden md:flex flex-1 max-w-md lg:max-w-lg items-stretch mx-4"
          >
            <label htmlFor="site-search" className="sr-only">
              {t("searchPlaceholder")}
            </label>
            <div className="relative flex w-full items-stretch">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light"
                aria-hidden="true"
              />
              <input
                id="site-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="gov-input rounded-r-none border-r-0 pl-10 pr-3 text-xs sm:text-sm focus:z-10"
              />
              <button
                type="submit"
                className="gov-btn-primary rounded-l-none px-4 py-2 font-bold"
                aria-label="Submit search"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </form>

          {/* Account Controls & Mobile Search Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile search toggle button */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="gov-btn-outline p-2 md:hidden"
              aria-expanded={mobileSearchOpen}
              aria-label={mobileSearchOpen ? "Close search bar" : "Open search bar"}
            >
              {mobileSearchOpen ? (
                <X className="h-4 w-4 text-navy" aria-hidden="true" />
              ) : (
                <Search className="h-4 w-4 text-navy" aria-hidden="true" />
              )}
            </button>

            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/citizen"}
                  className="gov-btn-outline gap-1.5 py-1.5 px-3 text-xs font-bold"
                >
                  <User className="h-3.5 w-3.5 text-navy" aria-hidden="true" />
                  <span className="max-w-[90px] sm:max-w-[120px] truncate">{user.name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="gov-btn-saffron gap-1.5 py-1.5 px-3 text-xs font-bold"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">{t("logout")}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="gov-btn-outline gap-1.5 py-1.5 px-3 text-xs font-bold"
                >
                  <User className="h-3.5 w-3.5 text-navy" aria-hidden="true" />
                  <span>{t("citizenLogin")}</span>
                </Link>
                <Link
                  to="/admin/login"
                  className="gov-btn-primary gap-1.5 py-1.5 px-3 text-xs font-bold hidden sm:inline-flex"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                  <span>{t("adminLogin")}</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Collapsible Mobile Search Bar - does NOT push entire layout */}
        {mobileSearchOpen ? (
          <form
            onSubmit={onSearch}
            role="search"
            className="mt-3 flex md:hidden items-stretch w-full animate-in slide-in-from-top-2 duration-150"
          >
            <label htmlFor="site-search-mobile" className="sr-only">
              {t("searchPlaceholder")}
            </label>
            <div className="relative flex w-full items-stretch">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light"
                aria-hidden="true"
              />
              <input
                id="site-search-mobile"
                type="search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="gov-input rounded-r-none border-r-0 pl-10 pr-3 text-xs"
              />
              <button
                type="submit"
                className="gov-btn-primary rounded-l-none px-4 font-bold"
                aria-label="Submit search"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </header>
  )
}
