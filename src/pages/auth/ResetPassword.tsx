import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { KeyRound, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { AuthShell } from "./Login"
import { useAuth } from "../../context/AuthContext"

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: "", confirm: "" })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.")
      return
    }
    setBusy(true)
    try {
      await resetPassword(form.password)
      setDone(true)
      setTimeout(() => navigate("/login", { replace: true }), 1800)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Set New Password" subtitle="Choose a strong, secure password for your citizen account">
      {done ? (
        <div className="flex items-center gap-2 rounded-gov border border-line bg-govGreen-tint p-3.5 text-xs font-bold text-govGreen-dark">
          <CheckCircle2 className="h-4 w-4 text-govGreen shrink-0" aria-hidden="true" />
          <span>Password updated successfully. Redirecting to login…</span>
        </div>
      ) : (
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
            <label htmlFor="r-pass" className="gov-label text-xs">
              New Password (min 8 characters)
            </label>
            <input
              id="r-pass"
              type="password"
              className="gov-input text-xs"
              required
              minLength={8}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="r-confirm" className="gov-label text-xs">
              Confirm New Password
            </label>
            <input
              id="r-confirm"
              type="password"
              className="gov-input text-xs"
              required
              minLength={8}
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
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
            <span>{busy ? "Please wait…" : "Update Password"}</span>
          </button>
        </form>
      )}

      <div className="mt-5 border-t border-lineSubtle pt-4 text-center">
        <p className="text-xs text-ink-muted">
          <Link to="/login" className="gov-link font-bold inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            <span>Back to Login</span>
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
