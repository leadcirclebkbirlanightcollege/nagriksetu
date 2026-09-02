import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { AuthShell } from "./Login"
import { useAuth } from "../../context/AuthContext"

export default function ForgotPassword() {
  const { forgotPassword, demoMode } = useAuth()
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMsg(null)
    setBusy(true)
    try {
      await forgotPassword(email)
      setMsg(
        demoMode
          ? "Demo mode: password reset emails are sent once Supabase is configured."
          : "If an account exists for this email, a password reset link has been sent.",
      )
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Forgot Password" subtitle="Enter your registered email to receive a secure password reset link">
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

        {msg ? (
          <div className="flex items-center gap-2 rounded-gov border border-line bg-govGreen-tint p-3 text-xs font-bold text-govGreen-dark">
            <CheckCircle2 className="h-4 w-4 text-govGreen shrink-0" aria-hidden="true" />
            <span>{msg}</span>
          </div>
        ) : null}

        <div>
          <label htmlFor="f-email" className="gov-label text-xs">
            Registered Email Address
          </label>
          <input
            id="f-email"
            type="email"
            className="gov-input text-xs"
            required
            placeholder="citizen@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            <Mail className="h-4 w-4" aria-hidden="true" />
          )}
          <span>{busy ? "Please wait…" : "Send Reset Link"}</span>
        </button>
      </form>

      <div className="mt-5 border-t border-lineSubtle pt-4 text-center">
        <p className="text-xs text-ink-muted">
          Remembered your password?{" "}
          <Link to="/login" className="gov-link font-bold inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            <span>Back to Login</span>
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
