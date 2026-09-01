import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
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
    <header className="border-b border-line bg-white">
      {/* Tricolour accent strip */}
      <div aria-hidden className="flex h-1">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-india-green" />
      </div>
      <div className="gov-container flex flex-wrap items-center gap-4 py-3">
        <Link to="/" className="flex items-center gap-3" aria-label="NagrikSetu home">
          <Logo size={54} />
          <span className="leading-tight">
            <span className="block text-xl font-extrabold tracking-tight text-navy">
              {t("portalName")}
            </span>
            <span className="block max-w-[22rem] text-[11px] font-medium uppercase tracking-wide text-muted">
              {t("tagline")}
            </span>
          </span>
        </Link>

        <form
          onSubmit={onSearch}
          role="search"
          className="order-3 flex w-full items-stretch md:order-2 md:ml-auto md:w-auto md:flex-1 md:max-w-md"
        >
          <label htmlFor="site-search" className="sr-only">
            {t("searchPlaceholder")}
          </label>
          <input
            id="site-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="gov-input rounded-r-none"
          />
          <button type="submit" className="gov-btn-primary rounded-l-none" aria-label="Search">
            🔍
          </button>
        </form>

        <div className="order-2 flex items-center gap-2 md:order-3">
          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/citizen"}
                className="gov-btn-outline"
              >
                {user.name.split(" ")[0]}
              </Link>
              <button onClick={() => signOut()} className="gov-btn-saffron">
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="gov-btn-outline">
                {t("citizenLogin")}
              </Link>
              <Link to="/admin/login" className="gov-btn-primary">
                {t("adminLogin")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
