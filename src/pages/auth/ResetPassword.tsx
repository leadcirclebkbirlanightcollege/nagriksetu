import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
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
        <p className="rounded-gov border border-[#A9D3B9] bg-[#E8F1EC] px-3 py-2 text-sm text-india-greenDark">
          Password updated. Redirecting to login…
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {error ? <p role="alert" className="rounded-gov border border-[#E56458] bg-[#FCE9E7] px-3 py-2 text-sm text-[#8A2A22]">{error}</p> : null}
          <div>
            <label htmlFor="r-pass" className="gov-label">New Password</label>
            <input id="r-pass" type="password" className="gov-input" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label htmlFor="r-confirm" className="gov-label">Confirm Password</label>
            <input id="r-confirm" type="password" className="gov-input" required minLength={8} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          </div>
          <button className="gov-btn-primary w-full" disabled={busy}>{busy ? "Please wait…" : "Update Password"}</button>
        </form>
      )}
      <p className="mt-4 text-center text-sm text-muted">
        <Link to="/login" className="gov-link">Back to Login</Link>
      </p>
    </AuthShell>
  )
}
