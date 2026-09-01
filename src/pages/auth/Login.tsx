import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Logo from "../../components/brand/Logo"
import { useAuth } from "../../context/AuthContext"

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", ward: "" })
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || "/citizen"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === "register") {
        await signUp(form.name, form.email, form.password, form.phone, form.ward)
        navigate(from, { replace: true })
      } else {
        await signIn(form.email, form.password, "citizen")
        navigate(from, { replace: true })
      }
    } catch (err) {
      setError((err as Error).message || "Authentication failed. Please check credentials.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Citizen Login" subtitle="Access your complaints and civic services">
      <div className="mb-4 flex rounded-gov border border-line p-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m)
              setError(null)
            }}
            className={`flex-1 rounded px-3 py-2 text-sm font-semibold ${mode === m ? "bg-navy text-white" : "text-ink"}`}
          >
            {m === "login" ? "Login" : "Register"}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? (
          <p role="alert" className="rounded-gov border border-[#E56458] bg-[#FCE9E7] px-3 py-2 text-sm text-[#8A2A22]">
            {error}
          </p>
        ) : null}
        {mode === "register" ? (
          <>
            <div>
              <label htmlFor="l-name" className="gov-label">Full Name <span className="text-saffron-dark">*</span></label>
              <input
                id="l-name"
                className="gov-input"
                required
                placeholder="e.g. Ramesh Kumar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="l-phone" className="gov-label">Mobile Number</label>
                <input
                  id="l-phone"
                  className="gov-input"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="l-ward" className="gov-label">Ward / Zone</label>
                <input
                  id="l-ward"
                  className="gov-input"
                  placeholder="Ward 12"
                  value={form.ward}
                  onChange={(e) => setForm({ ...form, ward: e.target.value })}
                />
              </div>
            </div>
          </>
        ) : null}
        <div>
          <label htmlFor="l-email" className="gov-label">Email Address <span className="text-saffron-dark">*</span></label>
          <input
            id="l-email"
            type="email"
            className="gov-input"
            required
            placeholder="citizen@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="l-pass" className="gov-label">Password <span className="text-saffron-dark">*</span></label>
          <input
            id="l-pass"
            type="password"
            className="gov-input"
            required
            minLength={6}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="gov-btn-primary w-full" disabled={busy}>
          {busy ? "Authenticating…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
      {mode === "login" ? (
        <p className="mt-3 text-center text-sm">
          <Link to="/forgot-password" className="gov-link">Forgot password?</Link>
        </p>
      ) : null}
      <p className="mt-4 text-center text-sm text-muted">
        Are you a department officer? <Link to="/admin/login" className="gov-link font-semibold">Admin Login</Link>
      </p>
    </AuthShell>
  )
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div aria-hidden className="flex h-1.5">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-india-green" />
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 flex flex-col items-center gap-2">
            <Logo size={64} />
            <span className="text-2xl font-extrabold text-navy">NagrikSetu</span>
            <span className="text-center text-xs text-muted">Digital Civic Issue Reporting &amp; Community Problem Monitoring Portal</span>
          </Link>
          <div className="gov-card p-6">
            <h1 className="text-xl font-bold text-navy">{title}</h1>
            <p className="mb-4 text-sm text-muted">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
