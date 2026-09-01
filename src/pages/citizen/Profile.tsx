import { useEffect, useState } from "react"
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
    <div className="space-y-4">
      <div className="gov-card p-4">
        <h1 className="text-xl font-bold text-navy">My Profile</h1>
        <p className="text-sm text-muted">Keep your contact details up to date for complaint updates.</p>
      </div>
      <form onSubmit={onSubmit} className="gov-card p-6">
        {saved ? (
          <p role="status" className="mb-4 rounded-gov border border-[#A9D3B9] bg-[#E8F1EC] px-3 py-2 text-sm text-india-greenDark">
            Profile saved successfully.
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="mb-4 rounded-gov border border-[#E56458] bg-[#FCE9E7] px-3 py-2 text-sm text-[#8A2A22]">
            {error}
          </p>
        ) : null}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="p-name" className="gov-label">Full Name</label>
            <input id="p-name" className="gov-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label htmlFor="p-email" className="gov-label">Email (Read Only)</label>
            <input id="p-email" type="email" disabled className="gov-input bg-surface text-muted" value={form.email} />
          </div>
          <div>
            <label htmlFor="p-phone" className="gov-label">Mobile Number</label>
            <input id="p-phone" className="gov-input" placeholder="10-digit mobile number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label htmlFor="p-ward" className="gov-label">Ward / Sector</label>
            <input id="p-ward" className="gov-input" placeholder="e.g. Ward 12 – Shivaji Nagar" value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="p-address" className="gov-label">Address</label>
            <textarea id="p-address" rows={2} className="gov-input" placeholder="Building, Street, Landmark" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
        </div>
        <button className="gov-btn-primary mt-5" disabled={busy}>
          {busy ? "Saving changes…" : "Save Changes"}
        </button>
      </form>
    </div>
  )
}
