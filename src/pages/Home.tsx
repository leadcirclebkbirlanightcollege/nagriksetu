import { Link } from "react-router-dom"
import { useState } from "react"
import {
  FileEdit,
  Search,
  BarChart3,
  Building2,
  Vote,
  FileDown,
  BookOpen,
  Trash2,
  Route,
  Droplets,
  Lightbulb,
  Waves,
  Trees,
  CheckCircle2,
  Clock,
  Activity,
  Phone,
  ChevronRight,
  Plus,
  Minus,
  Recycle,
  Droplet,
  Camera,
  FileText,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import SectionHeading from "../components/ui/SectionHeading"
import StatCard from "../components/ui/StatCard"
import StatusBadge from "../components/ui/StatusBadge"
import { useLanguage } from "../context/LanguageContext"
import { useAnalytics } from "../hooks/useAnalytics"

const quickServices = [
  { icon: FileEdit, label: "Report Civic Issue", to: "/report", desc: "Raise a new complaint" },
  { icon: Search, label: "Track Complaint", to: "/track", desc: "Check complaint status" },
  { icon: Building2, label: "View Community Issues", to: "/community", desc: "Public issue dashboard" },
  { icon: Vote, label: "Survey Participation", to: "/survey", desc: "Share your civic priorities" },
  { icon: FileDown, label: "Download Reports", to: "/community", desc: "Civic data & reports" },
  { icon: BookOpen, label: "Citizen Guidelines", to: "/guidelines", desc: "How to use the portal" },
]

const popularServices = [
  { icon: Trash2, label: "Garbage Collection", to: "/report" },
  { icon: Route, label: "Road & Pothole Repair", to: "/report" },
  { icon: Droplets, label: "Water Supply / Leakage", to: "/report" },
  { icon: Lightbulb, label: "Street Light Repair", to: "/report" },
  { icon: Waves, label: "Drainage & Sewage", to: "/report" },
  { icon: Trees, label: "Parks & Public Spaces", to: "/report" },
]

const emergencyContacts = [
  { label: "National Emergency", number: "112" },
  { label: "Police", number: "100" },
  { label: "Fire", number: "101" },
  { label: "Ambulance", number: "108" },
  { label: "Municipal Control Room", number: "1916" },
  { label: "Women Helpline", number: "1091" },
  { label: "Disaster Management", number: "1078" },
  { label: "Electricity Complaint", number: "1912" },
]

const defaultFaqItems = [
  {
    q: "How do I report a civic issue on NagrikSetu?",
    a: "Click on 'Report Civic Issue', select the appropriate category (e.g. Garbage, Road Damage, Street Lights), enter the location, provide a brief description and optionally attach photo evidence.",
  },
  {
    q: "Do I need to create an account to report an issue?",
    a: "No. You can report anonymously or enter your contact number. However, registering an account allows you to track all your complaints in one place.",
  },
  {
    q: "How can I track the resolution progress of my complaint?",
    a: "Enter your unique Complaint ID (e.g. NS-2026-000412) or 10-digit mobile number in the 'Track Complaint' section to see the step-by-step progress timeline.",
  },
  {
    q: "What is the expected resolution timeframe?",
    a: "Urgent issues like hazardous road potholes and electrical hazards are attended within 24 to 48 hours. Routine sanitation and street lighting issues are resolved within 2 to 4 business days.",
  },
]

export default function Home() {
  const { t } = useLanguage()
  const { data: stats } = useAnalytics()

  return (
    <>
      {/* Official Government Hero Banner */}
      <section className="border-b border-line bg-gradient-to-b from-[#F1F5F9] via-[#F8FAFC] to-white">
        <div className="gov-container grid items-center gap-8 py-10 sm:py-12 md:grid-cols-[1.35fr_1fr] lg:gap-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-gov border border-line bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy shadow-xs">
              <span className="h-2 w-2 rounded-full bg-saffron" aria-hidden="true" />
              <span>Official Citizen Service Gateway</span>
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-navy">
              {t("heroTitle")}
            </h1>
            <p className="mt-3.5 max-w-2xl text-sm sm:text-base leading-relaxed text-ink-muted">
              {t("heroBody")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/report" className="gov-btn-saffron text-sm font-bold shadow-sm">
                <FileEdit className="h-4 w-4" aria-hidden="true" />
                <span>{t("reportIssue")}</span>
              </Link>
              <Link to="/track" className="gov-btn-primary text-sm font-bold shadow-sm">
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>{t("trackComplaint")}</span>
              </Link>
              <Link to="/community" className="gov-btn-outline text-sm font-bold shadow-xs">
                <BarChart3 className="h-4 w-4 text-navy" aria-hidden="true" />
                <span>{t("community")}</span>
              </Link>
            </div>
          </div>

          {/* Grievance Workflow Card */}
          <div className="gov-card border-t-4 border-t-saffron p-6 shadow-sm">
            <h2 className="text-base font-bold text-navy flex items-center gap-2 border-b border-lineSubtle pb-3">
              <ShieldCheck className="h-5 w-5 text-saffron" aria-hidden="true" />
              <span>How it works</span>
            </h2>
            <ol className="mt-4 space-y-4 text-xs sm:text-sm">
              {[
                ["1", "Report", "Describe the civic issue with photos & location."],
                ["2", "Route", "Complaint is routed to the right municipal department."],
                ["3", "Resolve", "Track progress through each status until closure."],
              ].map(([n, title, body]) => (
                <li key={n} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-extrabold text-white shadow-xs">
                    {n}
                  </span>
                  <div className="pt-0.5">
                    <strong className="font-bold text-navy">{title}.</strong>{" "}
                    <span className="text-ink-muted">{body}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Quick Access Digital Services */}
      <section className="gov-container py-10 sm:py-12">
        <SectionHeading title={t("quickAccess")} subtitle="Frequently used citizen services" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {quickServices.map((s) => {
            const IconComponent = s.icon
            return (
              <Link
                key={s.label}
                to={s.to}
                className="gov-card group flex flex-col items-center gap-2 p-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-navy hover:shadow-cardHover"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-gov border border-lineSubtle bg-surface text-navy transition-colors group-hover:border-navy group-hover:bg-navy-tint">
                  <IconComponent className="h-5 w-5 text-navy" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold text-navy leading-snug">{s.label}</span>
                <span className="text-[11px] text-ink-light leading-tight">{s.desc}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Live Civic Performance Statistics */}
      <section className="border-y border-line bg-surfaceAlt py-10 sm:py-12">
        <div className="gov-container">
          <SectionHeading title={t("statistics")} subtitle="Live civic-service performance across the city" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard
              label="Total Reported Issues"
              value={(stats?.total ?? 0).toLocaleString("en-IN")}
              accent="navy"
              icon={<FileText className="h-5 w-5 text-navy" />}
            />
            <StatCard
              label="Resolved Issues"
              value={(stats?.resolved ?? 0).toLocaleString("en-IN")}
              accent="green"
              icon={<CheckCircle2 className="h-5 w-5 text-govGreen" />}
            />
            <StatCard
              label="Pending Issues"
              value={(stats?.pending ?? 0).toLocaleString("en-IN")}
              accent="saffron"
              icon={<Clock className="h-5 w-5 text-saffron" />}
            />
            <StatCard
              label="Avg. Resolution Time"
              value={`${stats?.avgResolutionDays ?? 3.2} days`}
              accent="navy"
              icon={<Activity className="h-5 w-5 text-navy" />}
            />
          </div>
        </div>
      </section>

      {/* Popular Services & Latest Grievance Updates */}
      <section className="gov-container grid gap-8 py-10 sm:py-12 lg:grid-cols-2">
        {/* Popular Civic Categories */}
        <div>
          <SectionHeading title={t("popularServices")} />
          <ul className="gov-card divide-y divide-lineSubtle overflow-hidden">
            {popularServices.map((s) => {
              const IconComponent = s.icon
              return (
                <li key={s.label}>
                  <Link
                    to={s.to}
                    className="flex items-center gap-3.5 px-4 py-3 transition-colors hover:bg-surface"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-lineSubtle bg-surfaceAlt text-navy">
                      <IconComponent className="h-4 w-4 text-navy" aria-hidden="true" />
                    </div>
                    <span className="font-semibold text-sm text-ink">{s.label}</span>
                    <ChevronRight className="ml-auto h-4 w-4 text-ink-light" aria-hidden="true" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Latest Grievance Dispatches */}
        <div>
          <SectionHeading title={t("latestUpdates")} />
          <ul className="space-y-3">
            {(stats?.recent?.slice(0, 3) || []).map((u) => (
              <li key={u.id} className="gov-card p-4 transition-all hover:border-line">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-navy">{u.id}</span>
                  <span className="rounded border border-line bg-surfaceAlt px-2 py-0.5 text-[11px] font-bold text-navy">
                    {u.category}
                  </span>
                  <time className="ml-auto text-xs text-ink-light" dateTime={u.createdAt}>
                    {new Date(u.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="mt-2 text-sm font-bold text-navy">{u.title}</h3>
                <div className="mt-2 flex items-center justify-between gap-2 border-t border-lineSubtle pt-2 text-xs">
                  <span className="text-ink-muted">{u.area}</span>
                  <StatusBadge status={u.status} size="sm" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Awareness / Citizen Charter */}
      <section className="bg-navy text-white">
        <div className="gov-container grid gap-6 py-10 sm:py-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">{t("awareness")}</h2>
            <p className="mt-2.5 text-xs leading-relaxed text-[#CBD5E1]">
              Your participation keeps the city clean, safe and functional. Know your civic rights and responsibilities.
            </p>
          </div>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-3 md:col-span-2">
            {[
              [Recycle, "Segregate Waste", "Separate wet and dry waste for faster collection."],
              [Droplet, "Save Water", "Report leakages early to prevent water loss."],
              [Camera, "Report with Photos", "Clear photos help departments resolve faster."],
            ].map(([IconComponent, title, body]) => {
              const Icon = IconComponent as typeof Recycle
              return (
                <div key={title as string} className="rounded-gov border border-white/15 bg-[#082B4E] p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded border border-white/20 bg-white/10 text-white">
                    <Icon className="h-4 w-4 text-saffron" aria-hidden="true" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-white">{title as string}</h3>
                  <p className="mt-1 text-xs text-[#CBD5E1] leading-relaxed">{body as string}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="gov-container py-10 sm:py-12">
        <SectionHeading title={t("faq")} subtitle="Answers to common questions about using NagrikSetu" />
        <Faq />
      </section>

      {/* 24x7 Civic Emergency Contacts */}
      <section className="border-t border-line bg-surfaceAlt py-10 sm:py-12">
        <div className="gov-container">
          <SectionHeading title={t("emergency")} subtitle="Save these numbers for urgent situations" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {emergencyContacts.map((c) => (
              <a
                key={c.number}
                href={`tel:${c.number}`}
                className="gov-card group flex items-center justify-between p-3.5 transition-all hover:border-navy hover:shadow-cardHover"
              >
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-saffron shrink-0" aria-hidden="true" />
                  <span className="text-xs font-semibold text-ink">{c.label}</span>
                </div>
                <span className="rounded-gov bg-govGreen px-2.5 py-0.5 text-xs font-extrabold text-white shadow-xs">
                  {c.number}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="gov-card divide-y divide-lineSubtle overflow-hidden">
      {defaultFaqItems.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface focus:outline-none focus-visible:bg-surface"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="text-sm font-bold text-navy">{item.q}</span>
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-line bg-white text-navy"
                >
                  {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </button>
            </h3>
            {isOpen ? (
              <div className="border-t border-lineSubtle bg-surface px-5 py-3.5 animate-in fade-in duration-150">
                <p className="text-xs text-ink leading-relaxed">{item.a}</p>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
