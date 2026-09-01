import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthShell } from "./Login"
import { useAuth } from "../../context/AuthContext"

export default function AdminLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "admin@nagriksetu.gov.in", password: "AdminPassword123!" })
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
    <AuthShell title="Admin / Department Login" subtitle="Authorised municipal staff and department officers">
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? (
          <p role="alert" className="rounded-gov border border-[#E56458] bg-[#FCE9E7] px-3 py-2 text-sm text-[#8A2A22]">
            {error}
          </p>
        ) : null}
        <div>
          <label htmlFor="a-email" className="gov-label">Official Email</label>
          <input
            id="a-email"
            type="email"
            className="gov-input"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="a-pass" className="gov-label">Password</label>
          <input
            id="a-pass"
            type="password"
            className="gov-input"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="gov-btn-primary w-full" disabled={busy}>
          {busy ? "Verifying Credentials…" : "Secure Admin Login"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        Not a municipal officer? <Link to="/login" className="gov-link font-semibold">Citizen Login</Link>
      </p>
    </AuthShell>
  )
}
