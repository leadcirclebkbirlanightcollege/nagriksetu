import SectionHeading from "../components/ui/SectionHeading"
import { Link } from "react-router-dom"

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
    <div className="gov-container py-8">
      <SectionHeading title="Citizen Guidelines" subtitle="How to use NagrikSetu responsibly and effectively" />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="gov-card p-6">
          <h2 className="text-lg font-bold text-navy">Reporting an issue — step by step</h2>
          <ol className="mt-4 space-y-4">
            {steps.map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{i + 1}</span>
                <span><strong className="text-navy">{t}.</strong> <span className="text-ink/80">{d}</span></span>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-4">
          <div className="gov-card border-t-4 border-t-india-green p-5">
            <h3 className="font-bold text-india-greenDark">Do</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-ink/80">{dos.map((d) => <li key={d}>✓ {d}</li>)}</ul>
          </div>
          <div className="gov-card border-t-4 border-t-[#E56458] p-5">
            <h3 className="font-bold text-[#8A2A22]">Don't</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-ink/80">{donts.map((d) => <li key={d}>✕ {d}</li>)}</ul>
          </div>
          <div className="gov-card border-t-4 border-t-navy p-5">
            <h3 className="font-bold text-navy">Accessibility</h3>
            <p className="mt-2 text-sm text-ink/80">Use the A / A+ / A++ controls in the top bar to resize text, switch between English and Hindi, and navigate fully by keyboard.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function About() {
  return (
    <div className="gov-container py-8">
      <SectionHeading title="About NagrikSetu" subtitle="A citizen bridge to responsive local governance" />
      <div className="gov-card p-6">
        <p className="text-ink/80">
          <strong className="text-navy">NagrikSetu</strong> (“Citizen Bridge”) is a digital civic issue
          reporting and community problem monitoring portal. It connects citizens with municipal
          departments so local problems — garbage, road damage, water supply, drainage, street lights
          and more — can be reported, routed, tracked and resolved transparently.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["🎯", "Mission", "Make civic issue resolution fast, transparent and accountable."],
            ["👥", "Community", "Empower citizens to participate in improving their neighbourhoods."],
            ["🔎", "Transparency", "Public dashboards show real resolution performance."],
          ].map(([icon, t, d]) => (
            <div key={t} className="rounded-gov border border-line bg-surface p-4">
              <div aria-hidden className="text-2xl">{icon}</div>
              <h3 className="mt-1 font-bold text-navy">{t}</h3>
              <p className="mt-1 text-sm text-ink/80">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-gov bg-surface p-4 text-sm text-muted">
          Disclaimer: This is an academic / field-project demonstration portal. It is not an official
          government website and is not affiliated with any government body. Branding and emblem are
          original and do not reproduce official government identity elements.
        </p>
      </div>
    </div>
  )
}

export function Contact() {
  const [sent, done] = [false, false]
  void sent; void done
  return (
    <div className="gov-container py-8">
      <SectionHeading title="Contact Us" subtitle="Reach the municipal control room and support desk" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="gov-card p-6">
          <h2 className="text-lg font-bold text-navy">Municipal Support</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><span className="font-semibold text-navy">Control Room:</span> 1916</li>
            <li><span className="font-semibold text-navy">Helpline:</span> 1800-000-000 (toll free)</li>
            <li><span className="font-semibold text-navy">Email:</span> support@nagriksetu.example</li>
            <li><span className="font-semibold text-navy">Office Hours:</span> Mon–Sat, 10:00 – 18:00 IST</li>
          </ul>
          <p className="mt-4 rounded-gov bg-surface p-3 text-sm text-muted">
            For emergencies (fire, medical, police) always call <strong>112</strong>.
          </p>
        </div>
        <form
          className="gov-card p-6"
          onSubmit={(e) => {
            e.preventDefault()
            alert("Thank you — your message has been recorded (demo).")
          }}
        >
          <h2 className="text-lg font-bold text-navy">Send a message</h2>
          <div className="mt-4 space-y-4">
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
            <button className="gov-btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="gov-container py-20 text-center">
      <p className="text-6xl font-extrabold text-navy">404</p>
      <h1 className="mt-2 text-xl font-bold text-navy">Page not found</h1>
      <p className="mt-2 text-muted">The page you are looking for doesn't exist or has moved.</p>
      <Link to="/" className="gov-btn-primary mt-6">Back to Home</Link>
    </div>
  )
}
