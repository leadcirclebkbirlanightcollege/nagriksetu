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
    <AuthShell title="Forgot Password" subtitle="We'll email you a secure reset link">
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? (
          <div role="alert" className="flex items-center gap-2 rounded-gov border border-[#FECACA] bg-[#FEF2F2] p-3 text-xs font-bold text-[#991B1B]">
            <AlertCircle className="h-4 w-4 text-[#DC2626] shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}
        {msg ? (
          <div className="flex items-center gap-2 rounded-gov border border-[#A7F3D0] bg-[#ECFDF5] p-3 text-xs font-bold text-[#065F46]">
            <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
            <span>{msg}</span>
          </div>
        ) : null}
        <div>
          <label htmlFor="f-email" className="gov-label text-xs">Registered Email</label>
          <input
            id="f-email"
            type="email"
            className="gov-input text-xs"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="gov-btn-primary w-full gap-2 text-xs font-bold py-2.5" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          {busy ? "Please wait…" : "Send Reset Link"}
        </button>
      </form>
      <div className="mt-5 border-t border-[#E2E8F0] pt-4 text-center">
        <p className="text-xs text-[#64748B]">
          Remembered it? <Link to="/login" className="gov-link font-bold inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Back to Login</Link>
        </p>
      </div>
    </AuthShell>
  )
}

