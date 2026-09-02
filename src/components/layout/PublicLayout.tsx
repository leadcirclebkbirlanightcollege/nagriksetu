import type { ReactNode } from "react"
import { AlertCircle } from "lucide-react"
import TopUtilityBar from "./TopUtilityBar"
import Header from "./Header"
import NavBar from "./NavBar"
import Footer from "./Footer"
import { useLanguage } from "../../context/LanguageContext"
import { useAuth } from "../../context/AuthContext"

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage()
  const { demoMode } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <a href="#main" className="skip-link">
        {t("skipToContent") || "Skip to main content"}
      </a>
      <TopUtilityBar />
      <Header />
      <NavBar />
      {demoMode ? (
        <div className="border-b border-[#FED7AA] bg-[#FFF7ED] text-xs text-[#9A3412]" role="status">
          <div className="gov-container flex items-center justify-center gap-2 py-1.5 font-medium">
            <AlertCircle className="h-3.5 w-3.5 text-saffron shrink-0" aria-hidden="true" />
            <span>
              Demo mode — Sample data active. Configure credentials in{" "}
              <code className="rounded bg-white border border-[#FED7AA] px-1.5 py-0.5 font-mono text-[11px]">.env</code>{" "}
              for live cloud persistence.
            </span>
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
