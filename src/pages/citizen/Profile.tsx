import { useEffect, useState } from "react"
import { User, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import Breadcrumb from "../../components/ui/Breadcrumb"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../components/ui/Toast"
import { apiGetMe, apiUpdateProfile } from "../../lib/api"

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const { success: toastSuccess } = useToast()
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
      toastSuccess("Citizen profile updated successfully")
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError((err as Error).message || "Failed to update profile")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Citizen Portal", to: "/citizen" }, { label: "Profile" }]} />

      <div className="gov-card border-t-4 border-t-navy p-5 sm:p-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
          <User className="h-6 w-6 text-navy" aria-hidden="true" />
          <span>Citizen Profile &amp; Contact Details</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-muted">
          Keep your residential ward and mobile number updated for grievance progress alerts.
        </p>
      </div>

      <form onSubmit={onSubmit} className="gov-card p-6 sm:p-8 shadow-card">
        {saved ? (
          <div
            role="status"
            className="mb-6 flex items-center gap-2.5 rounded-gov border border-govGreen-tint bg-govGreen-tint p-3.5 text-xs font-bold text-govGreen-dark"
          >
            <CheckCircle2 className="h-4 w-4 text-govGreen shrink-0" aria-hidden="true" />
            <span>Profile saved successfully.</span>
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="mb-6 flex items-center gap-2.5 rounded-gov border border-govRed-border bg-govRed-tint p-3.5 text-xs font-bold text-govRed-dark"
          >
            <AlertCircle className="h-4 w-4 text-govRed shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="p-name" className="gov-label">
              Full Name <span className="text-govRed font-bold">*</span>
            </label>
            <input
              id="p-name"
              className="gov-input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="p-email" className="gov-label">
              Registered Email (Read Only)
            </label>
            <input
              id="p-email"
              type="email"
              disabled
              className="gov-input bg-surfaceAlt text-ink-light cursor-not-allowed border-line"
              value={form.email}
            />
          </div>

          <div>
            <label htmlFor="p-phone" className="gov-label">
              Mobile Number (for SMS Tracking)
            </label>
            <input
              id="p-phone"
              className="gov-input"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="p-ward" className="gov-label">
              Residential Ward / Sector
            </label>
            <input
              id="p-ward"
              className="gov-input"
              placeholder="e.g. Ward 12 – Shivaji Nagar"
              value={form.ward}
              onChange={(e) => setForm({ ...form, ward: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="p-address" className="gov-label">
              Residential Address
            </label>
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

        <div className="mt-8 border-t border-lineSubtle pt-5">
          <button
            type="submit"
            className="gov-btn-primary gap-2 font-bold shadow-sm"
            disabled={busy}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
            ) : (
              <Save className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{busy ? "Saving changes…" : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
