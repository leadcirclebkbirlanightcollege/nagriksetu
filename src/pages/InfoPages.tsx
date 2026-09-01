import { Link } from "react-router-dom"
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
} from "lucide-react"
import SectionHeading from "../components/ui/SectionHeading"

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
    <div className="gov-container py-8 sm:py-10">
      <SectionHeading title="Citizen Guidelines" subtitle="How to use NagrikSetu responsibly and effectively" />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="gov-card border-t-[4px] border-t-navy p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-navy border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-navy" />
            <span>Reporting an issue — step by step</span>
          </h2>
          <ol className="mt-5 space-y-4">
            {steps.map(([t, d], i) => (
              <li key={t} className="flex items-start gap-3.5 rounded-gov border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-extrabold text-white">
                  {i + 1}
                </span>
                <div>
                  <strong className="block text-sm font-bold text-navy">{t}.</strong>
                  <span className="text-xs text-[#475569] leading-relaxed mt-0.5 block">{d}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-5">
          <div className="gov-card border-l-[4px] border-l-[#138808] p-5 shadow-sm">
            <h3 className="font-bold text-[#138808] flex items-center gap-2 text-base">
              <Check className="h-4 w-4" />
              <span>Do</span>
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-[#334155]">
              {dos.map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <span className="text-[#138808] font-bold">✓</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="gov-card border-l-[4px] border-l-[#DC2626] p-5 shadow-sm">
            <h3 className="font-bold text-[#DC2626] flex items-center gap-2 text-base">
              <X className="h-4 w-4" />
              <span>Don't</span>
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-[#334155]">
              {donts.map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <span className="text-[#DC2626] font-bold">✕</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="gov-card border-t-[4px] border-t-navy p-5 shadow-sm bg-[#F8FAFC]">
            <h3 className="font-bold text-navy flex items-center gap-2 text-sm">
              <Accessibility className="h-4 w-4 text-navy" />
              <span>Accessibility</span>
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#475569]">
              Use the A / A+ / A++ controls in the top bar to resize text, switch between English and Hindi, and navigate fully by keyboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function About() {
  return (
    <div className="gov-container py-8 sm:py-10">
      <SectionHeading title="About NagrikSetu" subtitle="A citizen bridge to responsive local governance" />
      <div className="gov-card border-t-[4px] border-t-navy p-6 sm:p-8 shadow-sm">
        <p className="text-sm leading-relaxed text-[#334155]">
          <strong className="text-navy font-bold">NagrikSetu</strong> (“Citizen Bridge”) is a digital civic issue
          reporting and community problem monitoring portal. It connects citizens with municipal
          departments so local problems — garbage, road damage, water supply, drainage, street lights
          and more — can be reported, routed, tracked and resolved transparently.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            [<Target className="h-5 w-5 text-navy" />, "Mission", "Make civic issue resolution fast, transparent and accountable."],
            [<Users className="h-5 w-5 text-[#E65100]" />, "Community", "Empower citizens to participate in improving their neighbourhoods."],
            [<Search className="h-5 w-5 text-[#138808]" />, "Transparency", "Public dashboards show real resolution performance."],
          ].map(([icon, t, d]) => (
            <div key={t as string} className="rounded-gov border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-xs">
              <div className="mb-2">{icon}</div>
              <h3 className="font-bold text-navy text-sm">{t as string}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#475569]">{d as string}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-gov border border-[#E2E8F0] bg-[#F1F5F9] p-4 text-xs text-[#64748B] leading-relaxed flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#64748B] mt-0.5" />
          <span>
            Disclaimer: This is an academic / field-project demonstration portal. It is not an official
            government website and is not affiliated with any government body. Branding and emblem are
            original and do not reproduce official government identity elements.
          </span>
        </p>
      </div>
    </div>
  )
}

export function Contact() {
  const [sent, done] = [false, false]
  void sent; void done
  return (
    <div className="gov-container py-8 sm:py-10">
      <SectionHeading title="Contact Us" subtitle="Reach the municipal control room and support desk" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="gov-card border-t-[4px] border-t-navy p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-navy border-b border-[#E2E8F0] pb-3">Municipal Support</h2>
          <ul className="mt-5 space-y-4 text-xs sm:text-sm">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-navy shrink-0" />
              <div>
                <span className="font-bold text-navy">Control Room:</span>{" "}
                <span className="text-[#334155]">1916</span>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#138808] shrink-0" />
              <div>
                <span className="font-bold text-navy">Helpline:</span>{" "}
                <span className="text-[#334155]">1800-000-000 (toll free)</span>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-navy shrink-0" />
              <div>
                <span className="font-bold text-navy">Email:</span>{" "}
                <span className="text-[#334155]">support@nagriksetu.example</span>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-[#E65100] shrink-0" />
              <div>
                <span className="font-bold text-navy">Office Hours:</span>{" "}
                <span className="text-[#334155]">Mon–Sat, 10:00 – 18:00 IST</span>
              </div>
            </li>
          </ul>
          <div className="mt-6 flex items-start gap-2.5 rounded-gov border border-[#FED7AA] bg-[#FFF7ED] p-3.5 text-xs text-[#9A3412]">
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#EA580C] mt-0.5" />
            <p>
              For emergencies (fire, medical, police) always call <strong>112</strong>.
            </p>
          </div>
        </div>
        <form
          className="gov-card border-t-[4px] border-t-navy p-6 sm:p-8 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault()
            alert("Thank you — your message has been recorded (demo).")
          }}
        >
          <h2 className="text-lg font-bold text-navy border-b border-[#E2E8F0] pb-3">Send a message</h2>
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="c-name" className="gov-label">Name</label>
              <input id="c-name" className="gov-input" required />
            </div>
            <div>
              <label htmlFor="c-email" className="gov-label">Email</label>
              <input id="c-email" type="email" className="gov-input" required />
            </div>
            <div>
              <label htmlFor="c-msg" className="gov-label">Message</label>
              <textarea id="c-msg" rows={4} className="gov-input" required />
            </div>
            <button className="gov-btn-primary gap-2 font-bold w-full sm:w-auto">
              <Send className="h-4 w-4" />
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="gov-container py-20 text-center">
      <p className="text-7xl font-extrabold tracking-tight text-navy">404</p>
      <h1 className="mt-3 text-2xl font-bold text-navy">Page not found</h1>
      <p className="mt-2 text-sm text-[#64748B]">The page you are looking for doesn't exist or has moved.</p>
      <Link to="/" className="gov-btn-primary mt-6 inline-flex items-center gap-2 font-bold">
        <Home className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  )
}

