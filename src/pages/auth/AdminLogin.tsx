import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShieldCheck, LogIn, AlertCircle, Loader2, KeyRound } from "lucide-react"
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
    <AuthShell title="Admin / Department Login" subtitle="Authorised municipal staff and department officers">
      <div className="mb-4 flex items-center gap-2 rounded-gov border border-[#CBD5E1] bg-[#F1F5F9] px-3.5 py-2 text-xs font-semibold text-navy">
        <ShieldCheck className="h-4 w-4 text-navy shrink-0" />
        <span>Restricted Area &bull; For Authorized Municipal Staff Only</span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error ? (
          <div role="alert" className="flex items-center gap-2 rounded-gov border border-[#FECACA] bg-[#FEF2F2] p-3 text-xs font-bold text-[#991B1B]">
            <AlertCircle className="h-4 w-4 text-[#DC2626] shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}
        <div>
          <label htmlFor="a-email" className="gov-label text-xs">Official Email</label>
          <input
            id="a-email"
            type="email"
            className="gov-input text-xs font-mono"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="a-pass" className="gov-label text-xs">Password</label>
          <input
            id="a-pass"
            type="password"
            className="gov-input text-xs"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="gov-btn-primary w-full gap-2 text-xs font-bold py-2.5" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          {busy ? "Verifying Credentials…" : "Secure Admin Login"}
        </button>
      </form>
      <div className="mt-5 border-t border-[#E2E8F0] pt-4 text-center">
        <p className="text-xs text-[#64748B]">
          Not a municipal officer? <Link to="/login" className="gov-link font-bold">Citizen Login</Link>
        </p>
      </div>
    </AuthShell>
  )
}

