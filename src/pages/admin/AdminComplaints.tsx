import { useEffect, useMemo, useState } from "react"
import StatusBadge from "../../components/ui/StatusBadge"
import ComplaintTimeline from "../../features/complaints/ComplaintTimeline"
import { apiListComplaints, apiUpdateStatus, apiAssignComplaint, apiDeleteComplaint } from "../../lib/api"
import { COMPLAINT_STATUSES, type Complaint, type ComplaintStatus } from "../../types"

const DEPARTMENTS = [
  "Solid Waste Management Dept.",
  "Electrical & Street Lighting Dept.",
  "Hydraulic Engineer & Water Supply Dept.",
  "Roads & Infrastructure Dept.",
  "Gardens & Tree Authority Dept.",
  "Storm Water Drains & Sewerage Dept.",
]

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "All">("All")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Complaint | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadComplaints() {
    setLoading(true)
    try {
      const data = await apiListComplaints({ archived: false })
      setComplaints(data)
    } catch (err) {
      setError((err as Error).message || "Failed to load complaints")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  const filtered = useMemo(() => {
    let list = complaints
    if (statusFilter !== "All") {
      list = list.filter((c) => c.status === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.area.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      )
    }
    return list
  }, [complaints, statusFilter, search])

  async function handleApplyUpdate(id: string, status: ComplaintStatus, assignedTo: string, note: string) {
    try {
      await apiUpdateStatus(id, status, note, assignedTo)
      if (assignedTo) {
        await apiAssignComplaint(id, { assignedTo, departmentName: assignedTo, note })
      }
      await loadComplaints()
      setSelected(null)
    } catch (err) {
      alert("Failed to update status: " + (err as Error).message)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(`Are you sure you want to delete complaint ${id}? This action will permanently remove it from the database.`)) {
      return
    }
    try {
      await apiDeleteComplaint(id)
      await loadComplaints()
      setSelected(null)
    } catch (err) {
      alert("Failed to delete complaint: " + (err as Error).message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Complaint Management</h1>
          <p className="text-sm text-muted">Assign complaints to departments, update progress timeline, and resolve issues.</p>
        </div>
        <button className="gov-btn-outline text-sm" onClick={loadComplaints}>
          🔄 Refresh
        </button>
      </div>

      {error ? (
        <p role="alert" className="rounded-gov border border-[#E56458] bg-[#FCE9E7] px-3 py-2 text-sm text-[#8A2A22]">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["All", ...COMPLAINT_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-gov border px-3 py-1.5 text-sm font-medium ${
                statusFilter === s ? "border-navy bg-navy text-white" : "border-line bg-white text-ink hover:bg-surface"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="gov-input sm:w-64"
          placeholder="Search by ID, title, area…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="gov-card overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-muted">Loading complaints…</div>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Area / Ward</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted">
                    No complaints found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-surface">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-navy">{c.id}</td>
                    <td className="px-4 py-3 font-medium text-ink">{c.title}</td>
                    <td className="px-4 py-3">{c.category}</td>
                    <td className="px-4 py-3 text-muted">{c.area}</td>
                    <td className="px-4 py-3 text-muted">{c.assignedTo || c.departmentName || "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3">
                      <button className="gov-btn-primary px-3 py-1.5 text-xs" onClick={() => setSelected(c)}>
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {selected ? (
        <ManageModal
          complaint={selected}
          departments={DEPARTMENTS}
          onClose={() => setSelected(null)}
          onApply={handleApplyUpdate}
          onDelete={() => handleDelete(selected.id)}
        />
      ) : null}
    </div>
  )
}

function ManageModal({
  complaint,
  departments,
  onClose,
  onApply,
  onDelete,
}: {
  complaint: Complaint
  departments: string[]
  onClose: () => void
  onApply: (id: string, status: ComplaintStatus, assignedTo: string, note: string) => Promise<void>
  onDelete: () => void
}) {
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status)
  const [assignedTo, setAssignedTo] = useState(complaint.assignedTo ?? "")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    await onApply(complaint.id, status, assignedTo, note)
    setBusy(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Manage Complaint ${complaint.id}`}
      onClick={onClose}
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-gov bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-line pb-3">
          <div>
            <span className="font-mono text-xs font-semibold text-navy">{complaint.id}</span>
            <h2 className="text-lg font-bold text-navy">{complaint.title}</h2>
          </div>
          <button onClick={onClose} className="gov-btn-outline px-3 py-1 text-sm" aria-label="Close">✕</button>
        </div>

        <div className="mt-4 rounded-gov bg-surface p-3 text-sm">
          <p className="text-ink/80">{complaint.description}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            <span><strong>Category:</strong> {complaint.category}</span>
            <span><strong>Area:</strong> {complaint.area}</span>
            {complaint.contactNumber ? <span><strong>Contact:</strong> {complaint.contactNumber}</span> : null}
            {complaint.reporterName ? <span><strong>Reporter:</strong> {complaint.reporterName}</span> : null}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 border-t border-line pt-4">
          <h3 className="font-bold text-navy">Update Status &amp; Assignment</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="m-status" className="gov-label">Status</label>
              <select
                id="m-status"
                className="gov-input"
                value={status}
                onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
              >
                {COMPLAINT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="m-dept" className="gov-label">Assign Department / Officer</label>
              <select
                id="m-dept"
                className="gov-input"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Select Department / Officer</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="m-note" className="gov-label">Administrative Remarks / Action Taken</label>
            <textarea
              id="m-note"
              rows={3}
              className="gov-input"
              placeholder="e.g. Field inspection carried out. Repair crew dispatched to site."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="text-xs font-semibold text-[#8A2A22] hover:underline"
              onClick={onDelete}
            >
              🗑️ Delete Complaint
            </button>
            <div className="flex gap-2">
              <button type="button" className="gov-btn-outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="gov-btn-primary" disabled={busy}>
                {busy ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 border-t border-line pt-4">
          <h3 className="mb-3 font-bold text-navy">Audit History Timeline</h3>
          <ComplaintTimeline complaint={complaint} />
        </div>
      </div>
    </div>
  )
}
