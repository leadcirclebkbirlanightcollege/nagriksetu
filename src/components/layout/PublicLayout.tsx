import type { ReactNode } from "react"
import Header from "./Header"
import NavBar from "./NavBar"
import Footer from "./Footer"
import { useLanguage } from "../../context/LanguageContext"
import { useAuth } from "../../context/AuthContext"

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage()
  const { demoMode } = useAuth()
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a href="#main" className="skip-link">
        {t("skipToContent")}
      </a>
      <TopBar />
      <Header />
      <NavBar />
      {demoMode ? (
        <div className="bg-[#FFF3E0] text-center text-xs text-[#8A5200]">
          <div className="gov-container py-1.5">
            Demo mode — Supabase is not configured, so sample data is shown. Add your keys in
            <code className="mx-1 rounded bg-white px-1 py-0.5">.env</code> to enable the backend.
          </div>
        </div>
      ) : null}
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

// Lazy import avoided to keep layout self-contained.
import TopUtilityBar from "./TopUtilityBar"
function TopBar() {
  return <TopUtilityBar />
}
