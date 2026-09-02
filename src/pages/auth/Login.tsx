import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ShieldCheck, LogIn, UserPlus, AlertCircle, Loader2 } from "lucide-react"
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
    <AuthShell title="Citizen Portal Login" subtitle="Access your complaints and track resolution history">
      {/* Mode Switcher Tabs */}
      <div className="mb-5 flex rounded-gov border border-line bg-surfaceAlt p-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m)
              setError(null)
            }}
            className={`flex-1 rounded py-2 text-xs font-bold transition-all ${
              mode === m ? "bg-navy text-white shadow-xs" : "text-ink-muted hover:text-ink"
            }`}
          >
            {m === "login" ? "Sign In" : "New Registration"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error ? (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-gov border border-govRed-border bg-govRed-tint p-3 text-xs font-bold text-govRed-dark"
          >
            <AlertCircle className="h-4 w-4 text-govRed shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}

        {mode === "register" ? (
          <>
            <div>
              <label htmlFor="l-name" className="gov-label text-xs">
                Full Name <span className="text-govRed font-bold">*</span>
              </label>
              <input
                id="l-name"
                className="gov-input text-xs"
                required
                placeholder="e.g. Ramesh Kumar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="l-phone" className="gov-label text-xs">
                  Mobile Number
                </label>
                <input
                  id="l-phone"
                  inputMode="numeric"
                  className="gov-input text-xs"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="l-ward" className="gov-label text-xs">
                  Ward / Zone
                </label>
                <input
                  id="l-ward"
                  className="gov-input text-xs"
                  placeholder="Ward 12"
                  value={form.ward}
                  onChange={(e) => setForm({ ...form, ward: e.target.value })}
                />
              </div>
            </div>
          </>
        ) : null}

        <div>
          <label htmlFor="l-email" className="gov-label text-xs">
            Email Address <span className="text-govRed font-bold">*</span>
          </label>
          <input
            id="l-email"
            type="email"
            className="gov-input text-xs"
            required
            placeholder="citizen@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="l-pass" className="gov-label text-xs">
            Password <span className="text-govRed font-bold">*</span>
          </label>
          <input
            id="l-pass"
            type="password"
            className="gov-input text-xs"
            required
            minLength={6}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="gov-btn-primary w-full gap-2 text-xs font-bold py-2.5 shadow-sm"
          disabled={busy}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
          ) : mode === "login" ? (
            <LogIn className="h-4 w-4" aria-hidden="true" />
          ) : (
            <UserPlus className="h-4 w-4" aria-hidden="true" />
          )}
          <span>{busy ? "Authenticating…" : mode === "login" ? "Sign In" : "Create Account"}</span>
        </button>
      </form>

      {mode === "login" ? (
        <p className="mt-3 text-center text-xs">
          <Link to="/forgot-password" className="gov-link font-semibold">
            Forgot password?
          </Link>
        </p>
      ) : null}

      <div className="mt-5 border-t border-lineSubtle pt-4 text-center">
        <p className="text-xs text-ink-muted">
          Are you a department officer?{" "}
          <Link to="/admin/login" className="gov-link font-bold">
            Admin Login
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* Tricolour Accent */}
      <div aria-hidden="true" className="flex h-1.5 w-full">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-govGreen" />
      </div>

      <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 flex flex-col items-center gap-2 group text-center" aria-label="NagrikSetu Home">
            <div className="flex items-center justify-center rounded-gov border border-line bg-white p-2 shadow-xs">
              <Logo size={52} />
            </div>
            <span className="text-2xl font-black tracking-tight text-navy">NagrikSetu</span>
            <span className="text-center text-[11px] font-semibold text-ink-muted max-w-xs leading-relaxed">
              Digital Civic Issue Reporting &amp; Community Problem Monitoring Portal
            </span>
          </Link>

          <div className="gov-card border-t-4 border-t-navy p-6 sm:p-7 shadow-card">
            <div className="mb-4 border-b border-lineSubtle pb-3">
              <h1 className="text-lg sm:text-xl font-bold text-navy flex items-center justify-between">
                <span>{title}</span>
                <ShieldCheck className="h-5 w-5 text-govGreen" aria-hidden="true" />
              </h1>
              <p className="mt-1 text-xs text-ink-muted leading-relaxed">{subtitle}</p>
            </div>
            {children}
          </div>

          <div className="mt-5 text-center text-[11px] text-ink-light">
            Protected by Municipal e-Governance Standards &bull; Secure Authentication
          </div>
        </div>
      </div>
    </div>
  )
}
