import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Logo from "../../components/brand/Logo"
import { useAuth } from "../../context/AuthContext"

export default function Login() {
  const { signIn, signUp, demoMode } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || "/citizen"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === "register") {
        await signUp(form.name, form.email, form.password)
        if (demoMode) navigate(from, { replace: true })
        else setError("Registration successful. Please check your email to confirm, then log in.")
      } else {
        await signIn(form.email, form.password, "citizen")
        navigate(from, { replace: true })
      }
    } catch (err) {
      setError((err as Error).message)
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
            onClick={() => setMode(m)}
            className={`flex-1 rounded px-3 py-2 text-sm font-semibold ${mode === m ? "bg-navy text-white" : "text-ink"}`}
          >
            {m === "login" ? "Login" : "Register"}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? <p role="alert" className="rounded-gov border border-[#F3D19E] bg-[#FFF3E0] px-3 py-2 text-sm text-[#8A5200]">{error}</p> : null}
        {mode === "register" ? (
          <div>
            <label htmlFor="l-name" className="gov-label">Full Name</label>
            <input id="l-name" className="gov-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
        ) : null}
        <div>
          <label htmlFor="l-email" className="gov-label">Email</label>
          <input id="l-email" type="email" className="gov-input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label htmlFor="l-pass" className="gov-label">Password</label>
          <input id="l-pass" type="password" className="gov-input" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="gov-btn-primary w-full" disabled={busy}>
          {busy ? "Please wait…" : mode === "login" ? "Login" : "Create Account"}
        </button>
      </form>
      {mode === "login" ? (
        <p className="mt-3 text-center text-sm">
          <Link to="/forgot-password" className="gov-link">Forgot password?</Link>
        </p>
      ) : null}
      {demoMode ? (
        <p className="mt-4 rounded-gov bg-surface p-3 text-xs text-muted">
          Demo mode: enter any email and password to explore the citizen portal.
        </p>
      ) : null}
      <p className="mt-4 text-center text-sm text-muted">
        Are you a department officer? <Link to="/admin/login" className="gov-link">Admin Login</Link>
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
            <span className="text-center text-xs text-muted">Digital Civic Issue Reporting & Community Problem Monitoring Portal</span>
          </Link>
          <div className="gov-card p-6">
            <h1 className="text-xl font-bold text-navy">{title}</h1>
            <p className="mb-5 text-sm text-muted">{subtitle}</p>
            {children}
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            <Link to="/" className="gov-link">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
