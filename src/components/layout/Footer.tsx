import { Link } from "react-router-dom"
import { PhoneCall } from "lucide-react"
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
    <footer className="mt-14 border-t-4 border-saffron bg-[#051C33] text-white">
      <div className="gov-container grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex shrink-0 items-center justify-center rounded border border-white/20 bg-white/10 p-1.5">
              <Logo size={40} />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white">{t("portalName")}</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#CBD5E1]">{t("tagline")}</p>
          <div className="mt-4 rounded-gov border border-white/10 bg-white/5 p-3 text-[11px] text-[#94A3B8]">
            <p className="flex items-center gap-1.5 font-bold text-white/90">
              <PhoneCall className="h-3.5 w-3.5 text-saffron" aria-hidden="true" />
              <span>24×7 Citizen Helpline</span>
            </p>
            <p className="mt-0.5 text-xs font-bold text-saffron">Toll-Free: 1800-XXX-XXXX</p>
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.heading}>
            <h3 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-[#FFB366]">
              {col.heading}
            </h3>
            <ul className="space-y-2 text-xs">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[#CBD5E1] transition-colors hover:text-white hover:underline underline-offset-2"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 bg-[#031324]">
        <div className="gov-container flex flex-col items-center justify-between gap-2 py-4 text-xs text-[#94A3B8] md:flex-row">
          <p>© {new Date().getFullYear()} NagrikSetu. A citizen civic-services demonstration portal.</p>
          <p className="text-center md:text-right">
            This is an academic/field-project portal. Not affiliated with any government body.
          </p>
        </div>
      </div>
    </footer>
  )
}
