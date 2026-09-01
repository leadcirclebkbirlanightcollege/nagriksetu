import { Link } from "react-router-dom"
import Logo from "../brand/Logo"
import { useLanguage } from "../../context/LanguageContext"

export default function Footer() {
  const { t } = useLanguage()
  const cols: { heading: string; links: { label: string; to: string }[] }[] = [
    {
      heading: "Services",
      links: [
        { label: "Report Civic Issue", to: "/report" },
        { label: "Track Complaint", to: "/track" },
        { label: "Community Dashboard", to: "/community" },
        { label: "Survey Participation", to: "/survey" },
      ],
    },
    {
      heading: "Information",
      links: [
        { label: "Citizen Guidelines", to: "/guidelines" },
        { label: "About NagrikSetu", to: "/about" },
        { label: "FAQ", to: "/#faq" },
        { label: "Contact Us", to: "/contact" },
      ],
    },
    {
      heading: "Portal",
      links: [
        { label: "Citizen Login", to: "/login" },
        { label: "Admin Login", to: "/admin/login" },
        { label: "Accessibility", to: "/guidelines" },
        { label: "Privacy Policy", to: "/about" },
      ],
    },
  ]

  return (
    <footer className="mt-12 border-t-4 border-saffron bg-navy-dark text-white">
      <div className="gov-container grid gap-8 py-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Logo size={40} />
            <span className="text-lg font-bold">{t("portalName")}</span>
          </div>
          <p className="mt-3 text-sm text-white/70">{t("tagline")}</p>
        </div>
        {cols.map((col) => (
          <div key={col.heading}>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-saffron">
              {col.heading}
            </h3>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-white/80 hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/15">
        <div className="gov-container flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/70 md:flex-row">
          <p>© {new Date().getFullYear()} NagrikSetu. A citizen civic-services demonstration portal.</p>
          <p>
            This is an academic/field-project portal. Not affiliated with any government body.
          </p>
        </div>
      </div>
    </footer>
  )
}
