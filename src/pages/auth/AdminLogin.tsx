import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShieldCheck, AlertCircle, Loader2, KeyRound } from "lucide-react"
import { AuthShell } from "./Login"
import { useAuth } from "../../context/AuthContext"

export default function AdminLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await signIn(form.email, form.password, "admin")
      navigate("/admin", { replace: true })
    } catch (err) {
      setError((err as Error).message || "Invalid administrative credentials.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Administrative Portal" subtitle="Authorized municipal staff and department grievance officers">
      <div className="mb-4 flex items-center gap-2 rounded-gov border border-line bg-surfaceAlt px-3.5 py-2.5 text-xs font-bold text-navy">
        <ShieldCheck className="h-4 w-4 text-navy shrink-0" aria-hidden="true" />
        <span>Restricted Access &bull; Official Department Personnel Only</span>
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

        <div>
          <label htmlFor="a-email" className="gov-label text-xs">
            Official Department Email
          </label>
          <input
            id="a-email"
            type="email"
            className="gov-input text-xs font-mono"
            required
            placeholder="officer@nagriksetu.gov"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="a-pass" className="gov-label text-xs">
            Password
          </label>
          <input
            id="a-pass"
            type="password"
            className="gov-input text-xs"
            required
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
          ) : (
            <KeyRound className="h-4 w-4" aria-hidden="true" />
          )}
          <span>{busy ? "Verifying Credentials…" : "Secure Admin Login"}</span>
        </button>
      </form>

      <div className="mt-5 border-t border-lineSubtle pt-4 text-center">
        <p className="text-xs text-ink-muted">
          Not a municipal officer?{" "}
          <Link to="/login" className="gov-link font-bold">
            Citizen Portal Login
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
