import { Link } from "react-router-dom"
import { useState } from "react"
import {
  Check,
  X,
  Accessibility,
  Target,
  Users,
  Search,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  Send,
  Home,
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
} from "lucide-react"
import SectionHeading from "../components/ui/SectionHeading"
import Breadcrumb from "../components/ui/Breadcrumb"

export function Guidelines() {
  const steps = [
    ["Register or log in", "Create a citizen account or continue anonymously for basic reporting."],
    ["Describe the issue", "Add a clear title, category, description, area and landmark."],
    ["Attach evidence", "Upload photos and capture your GPS location for accuracy."],
    ["Submit & note your ID", "You will receive a Complaint ID (e.g. NS-2026-000412)."],
    ["Track resolution", "Follow the status timeline until the issue is closed."],
  ]
  const dos = [
    "Report genuine civic issues in public spaces.",
    "Provide accurate location and clear photos.",
    "Use one complaint per distinct issue.",
    "Check existing complaints before reporting duplicates.",
  ]
  const donts = [
    "Do not submit false or spam complaints.",
    "Do not include personal or offensive content.",
    "Do not report private disputes or emergencies here — call 112.",
  ]

  return (
    <div className="gov-container py-6 sm:py-8">
      <Breadcrumb items={[{ label: "Citizen Guidelines" }]} />

      <SectionHeading title="Citizen Guidelines" subtitle="How to use NagrikSetu responsibly and effectively" />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="gov-card border-t-4 border-t-navy p-6 sm:p-8 shadow-card">
          <h2 className="text-lg font-bold text-navy border-b border-lineSubtle pb-3 flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-navy" aria-hidden="true" />
            <span>Reporting an issue — step by step</span>
          </h2>
          <ol className="mt-5 space-y-4">
            {steps.map(([t, d], i) => (
              <li key={t} className="flex items-start gap-3.5 rounded-gov border border-line bg-surface p-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-extrabold text-white shadow-xs">
                  {i + 1}
                </span>
                <div>
                  <strong className="block text-sm font-bold text-navy">{t}.</strong>
                  <span className="text-xs text-ink-muted leading-relaxed mt-0.5 block">{d}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-5">
          {/* Do's card */}
          <div className="gov-card border-l-4 border-l-govGreen p-5 shadow-card">
            <h3 className="font-bold text-govGreen flex items-center gap-2 text-base">
              <Check className="h-5 w-5" aria-hidden="true" />
              <span>Do</span>
            </h3>
            <ul className="mt-3 space-y-2.5 text-xs text-ink leading-relaxed">
              {dos.map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-govGreen shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts card */}
          <div className="gov-card border-l-4 border-l-govRed p-5 shadow-card">
            <h3 className="font-bold text-govRed flex items-center gap-2 text-base">
              <X className="h-5 w-5" aria-hidden="true" />
              <span>Don't</span>
            </h3>
            <ul className="mt-3 space-y-2.5 text-xs text-ink leading-relaxed">
              {donts.map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <X className="h-4 w-4 text-govRed shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Accessibility Info */}
          <div className="gov-card border-t-4 border-t-navy p-5 shadow-card bg-surface">
            <h3 className="font-bold text-navy flex items-center gap-2 text-sm">
              <Accessibility className="h-4 w-4 text-navy" aria-hidden="true" />
              <span>Accessibility Features</span>
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              Use the A / A+ / A++ controls and Contrast toggle in the top utility bar to adjust text sizes and color contrast, switch between English and Hindi, and navigate fully using keyboard tab sequence.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function About() {
  return (
    <div className="gov-container py-6 sm:py-8">
      <Breadcrumb items={[{ label: "About NagrikSetu" }]} />

      <SectionHeading title="About NagrikSetu" subtitle="A citizen bridge to responsive local governance" />

      <div className="gov-card border-t-4 border-t-navy p-6 sm:p-8 shadow-card">
        <p className="text-sm leading-relaxed text-ink">
          <strong className="text-navy font-bold">NagrikSetu</strong> (“Citizen Bridge”) is a digital civic issue
          reporting and community problem monitoring portal. It connects citizens with municipal
          departments so local problems — garbage, road damage, water supply, drainage, street lights
          and more — can be reported, routed, tracked and resolved transparently.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            [<Target className="h-5 w-5 text-navy" aria-hidden="true" />, "Mission", "Make civic issue resolution fast, transparent and accountable."],
            [<Users className="h-5 w-5 text-saffron" aria-hidden="true" />, "Community", "Empower citizens to participate in improving their neighbourhoods."],
            [<Search className="h-5 w-5 text-govGreen" aria-hidden="true" />, "Transparency", "Public dashboards show real resolution performance."],
          ].map(([icon, t, d]) => (
            <div key={t as string} className="rounded-gov border border-line bg-surface p-4 shadow-xs">
              <div className="mb-2">{icon}</div>
              <h3 className="font-bold text-navy text-sm">{t as string}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">{d as string}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-gov border border-line bg-surfaceAlt p-4 text-xs text-ink-muted leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 shrink-0 text-navy mt-0.5" aria-hidden="true" />
          <span>
            Disclaimer: This is an academic / field-project demonstration portal. It is not an official
            government website and is not affiliated with any government body. Branding and emblem are
            original and do not reproduce official government identity elements.
          </span>
        </div>
      </div>
    </div>
  )
}

export function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="gov-container py-6 sm:py-8">
      <Breadcrumb items={[{ label: "Contact Us" }]} />

      <SectionHeading title="Contact Us" subtitle="Reach the municipal control room and citizen support desk" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="gov-card border-t-4 border-t-navy p-6 sm:p-8 shadow-card">
          <h2 className="text-lg font-bold text-navy border-b border-lineSubtle pb-3">
            Municipal Support Directory
          </h2>

          <ul className="mt-5 space-y-4 text-xs sm:text-sm">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-navy shrink-0" aria-hidden="true" />
              <div>
                <span className="font-bold text-navy">Control Room:</span>{" "}
                <span className="text-ink font-semibold">1916</span>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-govGreen shrink-0" aria-hidden="true" />
              <div>
                <span className="font-bold text-navy">Citizen Helpline:</span>{" "}
                <span className="text-ink font-semibold">1800-000-000 (Toll Free)</span>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-navy shrink-0" aria-hidden="true" />
              <div>
                <span className="font-bold text-navy">Official Email:</span>{" "}
                <span className="text-ink font-semibold">support@nagriksetu.example</span>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-saffron shrink-0" aria-hidden="true" />
              <div>
                <span className="font-bold text-navy">Office Hours:</span>{" "}
                <span className="text-ink">Mon–Sat, 10:00 – 18:00 IST</span>
              </div>
            </li>
          </ul>

          <div className="mt-6 flex items-start gap-2.5 rounded-gov border border-[#FED7AA] bg-[#FFF7ED] p-3.5 text-xs text-[#9A3412]">
            <AlertTriangle className="h-4 w-4 shrink-0 text-saffron mt-0.5" aria-hidden="true" />
            <p>
              For life-threatening emergencies (fire, medical, police) always dial <strong>112</strong> immediately.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="gov-card border-t-4 border-t-govGreen p-8 text-center shadow-card flex flex-col items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-govGreen mb-3" aria-hidden="true" />
            <h2 className="text-lg font-bold text-navy">Message Received</h2>
            <p className="mt-1.5 text-xs text-ink-muted max-w-sm">
              Thank you — your inquiry has been recorded by the municipal support cell (demonstration mode).
            </p>
            <button
              type="button"
              className="gov-btn-outline mt-5 text-xs font-bold"
              onClick={() => setSubmitted(false)}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className="gov-card border-t-4 border-t-navy p-6 sm:p-8 shadow-card" onSubmit={onSubmit}>
            <h2 className="text-lg font-bold text-navy border-b border-lineSubtle pb-3">
              Send an Official Message
            </h2>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="c-name" className="gov-label">
                  Citizen Name
                </label>
                <input id="c-name" className="gov-input" required placeholder="Enter full name" />
              </div>
              <div>
                <label htmlFor="c-email" className="gov-label">
                  Email Address
                </label>
                <input id="c-email" type="email" className="gov-input" required placeholder="citizen@example.com" />
              </div>
              <div>
                <label htmlFor="c-msg" className="gov-label">
                  Message / Inquiry
                </label>
                <textarea id="c-msg" rows={4} className="gov-input" required placeholder="State your inquiry or feedback clearly…" />
              </div>
              <button type="submit" className="gov-btn-primary gap-2 font-bold w-full sm:w-auto shadow-sm">
                <Send className="h-4 w-4" aria-hidden="true" />
                <span>Submit Message</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="gov-container py-16 sm:py-24 text-center">
      <p className="text-6xl sm:text-7xl font-extrabold tracking-tight text-navy">404</p>
      <h1 className="mt-3 text-2xl font-bold text-navy">Page Not Found</h1>
      <p className="mt-2 text-sm text-ink-muted max-w-md mx-auto">
        The requested digital service page could not be located. It may have been relocated or updated.
      </p>
      <Link to="/" className="gov-btn-primary mt-6 inline-flex items-center gap-2 font-bold shadow-sm">
        <Home className="h-4 w-4" aria-hidden="true" />
        <span>Return to Citizen Portal Home</span>
      </Link>
    </div>
  )
}
