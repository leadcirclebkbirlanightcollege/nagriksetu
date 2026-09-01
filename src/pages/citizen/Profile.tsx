import { useEffect, useState } from "react"
import { User, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { apiGetMe, apiUpdateProfile } from "../../lib/api"

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
    ward: user?.ward ?? "",
  })

  useEffect(() => {
    apiGetMe()
      .then((me) => {
        if (me) {
          setForm({
            name: me.name || "",
            email: me.email || "",
            phone: me.phone || "",
            address: me.address || "",
            ward: me.ward || "",
          })
        }
      })
      .catch(() => {})
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setSaved(false)
    try {
      await apiUpdateProfile({
        name: form.name,
        phone: form.phone,
        ward: form.ward,
        address: form.address,
      })
      await refreshUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError((err as Error).message || "Failed to update profile")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="gov-card border-t-[4px] border-t-navy p-5 sm:p-6 shadow-sm">
        <h1 className="text-xl font-bold text-navy flex items-center gap-2">
          <User className="h-5 w-5 text-navy" />
          <span>My Profile</span>
        </h1>
        <p className="mt-1 text-xs font-semibold text-[#64748B]">Keep your contact details up to date for complaint updates.</p>
      </div>

      <form onSubmit={onSubmit} className="gov-card p-6 sm:p-8 shadow-sm">
        {saved ? (
          <div role="status" className="mb-6 flex items-center gap-2.5 rounded-gov border border-[#A7F3D0] bg-[#ECFDF5] p-3.5 text-xs font-bold text-[#065F46]">
            <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" />
            <span>Profile saved successfully.</span>
          </div>
        ) : null}
        {error ? (
          <div role="alert" className="mb-6 flex items-center gap-2.5 rounded-gov border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-xs font-bold text-[#991B1B]">
            <AlertCircle className="h-4 w-4 text-[#DC2626] shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="p-name" className="gov-label">Full Name</label>
            <input
              id="p-name"
              className="gov-input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="p-email" className="gov-label">Email (Read Only)</label>
            <input
              id="p-email"
              type="email"
              disabled
              className="gov-input bg-[#F1F5F9] text-[#64748B] cursor-not-allowed border-[#CBD5E1]"
              value={form.email}
            />
          </div>
          <div>
            <label htmlFor="p-phone" className="gov-label">Mobile Number</label>
            <input
              id="p-phone"
              className="gov-input"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="p-ward" className="gov-label">Ward / Sector</label>
            <input
              id="p-ward"
              className="gov-input"
              placeholder="e.g. Ward 12 – Shivaji Nagar"
              value={form.ward}
              onChange={(e) => setForm({ ...form, ward: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="p-address" className="gov-label">Address</label>
            <textarea
              id="p-address"
              rows={2}
              className="gov-input"
              placeholder="Building, Street, Landmark"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-8 border-t border-[#E2E8F0] pt-5">
          <button className="gov-btn-primary gap-2 font-bold" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {busy ? "Saving changes…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}

