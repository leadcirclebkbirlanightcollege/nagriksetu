import { useState } from "react"
import { useAuth } from "../../context/AuthContext"

export default function Profile() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: "",
    ward: "",
  })

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
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
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="p-name" className="gov-label">Full Name</label>
            <input id="p-name" className="gov-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label htmlFor="p-email" className="gov-label">Email</label>
            <input id="p-email" type="email" className="gov-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label htmlFor="p-phone" className="gov-label">Mobile Number</label>
            <input id="p-phone" className="gov-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label htmlFor="p-ward" className="gov-label">Ward</label>
            <input id="p-ward" className="gov-input" value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="p-address" className="gov-label">Address</label>
            <textarea id="p-address" rows={2} className="gov-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
        </div>
        <button className="gov-btn-primary mt-5">Save Changes</button>
      </form>
    </div>
  )
}
