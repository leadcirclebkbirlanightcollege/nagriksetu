import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Search, User, ShieldCheck, LogOut } from "lucide-react"
import Logo from "../brand/Logo"
import { useLanguage } from "../../context/LanguageContext"
import { useAuth } from "../../context/AuthContext"

export default function Header() {
  const { t } = useLanguage()
  const { user, signOut } = useAuth()
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) navigate(`/track?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="border-b border-[#D8DEE6] bg-white">
      {/* Tricolour accent strip */}
      <div aria-hidden className="flex h-1.5 w-full">
        <div className="flex-1 bg-[#E65100]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>
      <div className="gov-container flex flex-wrap items-center justify-between gap-4 py-3.5">
        <Link to="/" className="flex items-center gap-3.5 transition-opacity hover:opacity-95" aria-label="NagrikSetu home">
          <div className="flex shrink-0 items-center justify-center rounded border border-[#E2E8F0] bg-[#F8FAFC] p-1 shadow-sm">
            <Logo size={46} />
          </div>
          <span className="leading-tight">
            <span className="block text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
              {t("portalName")}
            </span>
            <span className="block max-w-[24rem] text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
              {t("tagline")}
            </span>
          </span>
        </Link>

        <form
          onSubmit={onSearch}
          role="search"
          className="order-3 flex w-full items-stretch md:order-2 md:w-auto md:flex-1 md:max-w-md lg:max-w-lg"
        >
          <label htmlFor="site-search" className="sr-only">
            {t("searchPlaceholder")}
          </label>
          <div className="relative flex w-full items-stretch">
            <input
              id="site-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="gov-input rounded-r-none border-r-0 pl-9 pr-3 text-sm focus:z-10"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" aria-hidden />
            <button type="submit" className="gov-btn-primary rounded-l-none px-4" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="order-2 flex items-center gap-2.5 md:order-3">
          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/citizen"}
                className="gov-btn-outline gap-1.5 py-1.5 text-xs font-bold"
              >
                <User className="h-3.5 w-3.5" />
                {user.name.split(" ")[0]}
              </Link>
              <button onClick={() => signOut()} className="gov-btn-saffron gap-1.5 py-1.5 text-xs font-bold">
                <LogOut className="h-3.5 w-3.5" />
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="gov-btn-outline gap-1.5 py-1.5 text-xs font-bold">
                <User className="h-3.5 w-3.5" />
                {t("citizenLogin")}
              </Link>
              <Link to="/admin/login" className="gov-btn-primary gap-1.5 py-1.5 text-xs font-bold">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t("adminLogin")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

