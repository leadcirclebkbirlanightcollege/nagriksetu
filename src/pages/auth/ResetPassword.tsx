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
    <AuthShell title="Reset Password" subtitle="Choose a new password for your account">
      {done ? (
        <div className="flex items-center gap-2 rounded-gov border border-[#A7F3D0] bg-[#ECFDF5] p-3.5 text-xs font-bold text-[#065F46]">
          <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
          <span>Password updated. Redirecting to login…</span>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {error ? (
            <div role="alert" className="flex items-center gap-2 rounded-gov border border-[#FECACA] bg-[#FEF2F2] p-3 text-xs font-bold text-[#991B1B]">
              <AlertCircle className="h-4 w-4 text-[#DC2626] shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}
          <div>
            <label htmlFor="r-pass" className="gov-label text-xs">New Password</label>
            <input
              id="r-pass"
              type="password"
              className="gov-input text-xs"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="r-confirm" className="gov-label text-xs">Confirm Password</label>
            <input
              id="r-confirm"
              type="password"
              className="gov-input text-xs"
              required
              minLength={8}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
          </div>
          <button className="gov-btn-primary w-full gap-2 text-xs font-bold py-2.5" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            {busy ? "Please wait…" : "Update Password"}
          </button>
        </form>
      )}
      <div className="mt-5 border-t border-[#E2E8F0] pt-4 text-center">
        <p className="text-xs text-[#64748B]">
          <Link to="/login" className="gov-link font-bold inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Back to Login</Link>
        </p>
      </div>
    </AuthShell>
  )
}

