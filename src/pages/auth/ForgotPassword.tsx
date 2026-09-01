import { useState } from "react"
import { Link } from "react-router-dom"
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
        {error ? <p role="alert" className="rounded-gov border border-[#E56458] bg-[#FCE9E7] px-3 py-2 text-sm text-[#8A2A22]">{error}</p> : null}
        {msg ? <p className="rounded-gov border border-[#A9D3B9] bg-[#E8F1EC] px-3 py-2 text-sm text-india-greenDark">{msg}</p> : null}
        <div>
          <label htmlFor="f-email" className="gov-label">Registered Email</label>
          <input id="f-email" type="email" className="gov-input" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="gov-btn-primary w-full" disabled={busy}>{busy ? "Please wait…" : "Send Reset Link"}</button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        Remembered it? <Link to="/login" className="gov-link">Back to Login</Link>
      </p>
    </AuthShell>
  )
}
