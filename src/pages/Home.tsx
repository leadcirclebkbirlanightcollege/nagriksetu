import { Link } from "react-router-dom"
import SectionHeading from "../components/ui/SectionHeading"
import StatCard from "../components/ui/StatCard"
import { useLanguage } from "../context/LanguageContext"
import { faqItems, mockUpdates, communityTotals } from "../data/mockData"
import { useState } from "react"

const quickServices = [
  { icon: "📝", label: "Report Civic Issue", to: "/report", desc: "Raise a new complaint" },
  { icon: "🔍", label: "Track Complaint", to: "/track", desc: "Check complaint status" },
  { icon: "🏘️", label: "View Community Issues", to: "/community", desc: "Public issue dashboard" },
  { icon: "🗳️", label: "Survey Participation", to: "/survey", desc: "Share your civic priorities" },
  { icon: "📄", label: "Download Reports", to: "/community", desc: "Civic data & reports" },
  { icon: "📘", label: "Citizen Guidelines", to: "/guidelines", desc: "How to use the portal" },
]

const popularServices = [
  { icon: "🗑️", label: "Garbage Collection", to: "/report" },
  { icon: "🛣️", label: "Road & Pothole Repair", to: "/report" },
  { icon: "💧", label: "Water Supply / Leakage", to: "/report" },
  { icon: "💡", label: "Street Light Repair", to: "/report" },
  { icon: "🌿", label: "Drainage & Sewage", to: "/report" },
  { icon: "🏞️", label: "Parks & Public Spaces", to: "/report" },
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

export default function Home() {
  const { t } = useLanguage()
  return (
    <>
      {/* Hero banner */}
      <section className="border-b border-line bg-surface">
        <div className="gov-container grid items-center gap-8 py-10 md:grid-cols-[1.4fr_1fr] md:py-14">
          <div>
            <span className="inline-block rounded bg-navy px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Citizen Service Portal
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-ink/80">{t("heroBody")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/report" className="gov-btn-saffron text-base">
                📝 {t("reportIssue")}
              </Link>
              <Link to="/track" className="gov-btn-primary text-base">
                🔍 {t("trackComplaint")}
              </Link>
              <Link to="/community" className="gov-btn-outline text-base">
                📊 {t("community")}
              </Link>
            </div>
          </div>
          <div className="gov-card border-t-4 border-t-saffron p-6">
            <h2 className="text-base font-bold text-navy">How it works</h2>
            <ol className="mt-3 space-y-3 text-sm">
              {[
                ["1", "Report", "Describe the civic issue with photos & location."],
                ["2", "Route", "Complaint is routed to the right municipal department."],
                ["3", "Resolve", "Track progress through each status until closure."],
              ].map(([n, title, body]) => (
                <li key={n} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                    {n}
                  </span>
                  <span>
                    <strong className="text-navy">{title}.</strong> <span className="text-ink/80">{body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Quick Access Services */}
      <section className="gov-container py-10">
        <SectionHeading title={t("quickAccess")} subtitle="Frequently used citizen services" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {quickServices.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className="gov-card group flex flex-col items-center gap-2 p-4 text-center hover:border-navy"
            >
              <span aria-hidden className="text-3xl">{s.icon}</span>
              <span className="text-sm font-semibold text-navy">{s.label}</span>
              <span className="text-xs text-muted">{s.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-surface py-10">
        <div className="gov-container">
          <SectionHeading title={t("statistics")} subtitle="Live civic-service performance across the city" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total Reported Issues" value={communityTotals.total.toLocaleString("en-IN")} accent="navy" icon="📌" />
            <StatCard label="Resolved Issues" value={communityTotals.resolved.toLocaleString("en-IN")} accent="green" icon="✅" />
            <StatCard label="Pending Issues" value={communityTotals.pending.toLocaleString("en-IN")} accent="saffron" icon="⏳" />
            <StatCard label="Avg. Resolution Time" value={`${communityTotals.avgDays} days`} accent="navy" icon="⚡" />
          </div>
        </div>
      </section>

      {/* Popular services + Latest updates */}
      <section className="gov-container grid gap-8 py-10 lg:grid-cols-2">
        <div>
          <SectionHeading title={t("popularServices")} />
          <ul className="gov-card divide-y divide-line">
            {popularServices.map((s) => (
              <li key={s.label}>
                <Link to={s.to} className="flex items-center gap-3 px-4 py-3 hover:bg-surface">
                  <span aria-hidden className="text-xl">{s.icon}</span>
                  <span className="font-medium text-ink">{s.label}</span>
                  <span aria-hidden className="ml-auto text-navy">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHeading title={t("latestUpdates")} />
          <ul className="space-y-3">
            {mockUpdates.map((u) => (
              <li key={u.id} className="gov-card p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-surfaceAlt px-2 py-0.5 text-xs font-semibold text-navy">{u.tag}</span>
                  <time className="text-xs text-muted" dateTime={u.date}>
                    {new Date(u.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </time>
                </div>
                <h3 className="mt-2 text-base font-semibold text-navy">{u.title}</h3>
                <p className="mt-1 text-sm text-ink/80">{u.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Awareness / Citizen charter */}
      <section className="bg-navy text-white">
        <div className="gov-container grid gap-6 py-10 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold">{t("awareness")}</h2>
            <p className="mt-2 text-sm text-white/80">
              Your participation keeps the city clean, safe and functional. Know your civic rights and responsibilities.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 md:col-span-2">
            {[
              ["♻️", "Segregate Waste", "Separate wet and dry waste for faster collection."],
              ["💧", "Save Water", "Report leakages early to prevent water loss."],
              ["📸", "Report with Photos", "Clear photos help departments resolve faster."],
            ].map(([icon, title, body]) => (
              <div key={title} className="rounded-gov border border-white/15 bg-navy-light p-4">
                <div aria-hidden className="text-2xl">{icon}</div>
                <h3 className="mt-2 font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm text-white/80">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="gov-container py-10">
        <SectionHeading title={t("faq")} subtitle="Answers to common questions about using NagrikSetu" />
        <Faq />
      </section>

      {/* Emergency contacts */}
      <section className="bg-surface py-10">
        <div className="gov-container">
          <SectionHeading title={t("emergency")} subtitle="Save these numbers for urgent situations" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {emergencyContacts.map((c) => (
              <a
                key={c.number}
                href={`tel:${c.number}`}
                className="gov-card flex items-center justify-between p-4 hover:border-india-green"
              >
                <span className="text-sm font-medium text-ink">{c.label}</span>
                <span className="rounded bg-india-green px-2.5 py-1 text-sm font-bold text-white">{c.number}</span>
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
    <div className="gov-card divide-y divide-line">
      {faqItems.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q}>
            <h3>
              <button
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="font-semibold text-navy">{item.q}</span>
                <span aria-hidden className="text-xl text-navy">{isOpen ? "−" : "+"}</span>
              </button>
            </h3>
            {isOpen ? <p className="px-4 pb-4 text-sm text-ink/80">{item.a}</p> : null}
          </div>
        )
      })}
    </div>
  )
}
