import { useMemo, useState } from "react"
import StatusBadge from "../../components/ui/StatusBadge"
import ComplaintTimeline from "../../features/complaints/ComplaintTimeline"
import { mockComplaints } from "../../data/mockData"
import { COMPLAINT_STATUSES, type Complaint, type ComplaintStatus } from "../../types"

const DEPARTMENTS = [
  "Sanitation Dept.",
  "Electrical Dept.",
  "Water Dept.",
  "Roads & Buildings",
  "Parks & Gardens",
  "Drainage Dept.",
]

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>(() =>
    mockComplaints.map((c) => ({ ...c, timeline: [...c.timeline] })),
  )
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "All">("All")
  const [selected, setSelected] = useState<Complaint | null>(null)

  const filtered = useMemo(
    () => (statusFilter === "All" ? complaints : complaints.filter((c) => c.status === statusFilter)),
    [complaints, statusFilter],
  )

  function applyUpdate(id: string, status: ComplaintStatus, assignedTo: string, note: string) {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        const now = new Date().toISOString()
        return {
          ...c,
          status,
          assignedTo: assignedTo || c.assignedTo,
          updatedAt: now,
          timeline: [...c.timeline, { status, at: now, actor: assignedTo || "Admin", note: note || undefined }],
        }
      }),
    )
    setSelected(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Complaint Management</h1>
        <p className="text-sm text-muted">Assign complaints to departments and update their status.</p>
      </div>

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

      <div className="gov-card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Assigned To</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-surface">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-navy">{c.id}</td>
                <td className="px-4 py-3">{c.title}</td>
                <td className="px-4 py-3">{c.category}</td>
                <td className="px-4 py-3 text-muted">{c.assignedTo ?? "—"}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3">
                  <button className="gov-btn-primary px-3 py-1.5 text-xs" onClick={() => setSelected(c)}>Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected ? (
        <ManageModal
          complaint={selected}
          departments={DEPARTMENTS}
          onClose={() => setSelected(null)}
          onApply={applyUpdate}
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
}: {
  complaint: Complaint
  departments: string[]
  onClose: () => void
  onApply: (id: string, status: ComplaintStatus, assignedTo: string, note: string) => void
}) {
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status)
  const [assignedTo, setAssignedTo] = useState(complaint.assignedTo ?? "")
  const [note, setNote] = useState("")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-gov bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line bg-navy px-5 py-3 text-white">
          <h2 className="font-bold">Manage Complaint – {complaint.id}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded px-2 py-1 hover:bg-white/15">✕</button>
        </div>
        <div className="grid gap-5 p-5 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-navy">{complaint.title}</h3>
            <p className="mt-1 text-sm text-ink/80">{complaint.description}</p>
            <dl className="mt-3 space-y-1 text-sm">
              <div><span className="text-muted">Category:</span> {complaint.category}</div>
              <div><span className="text-muted">Area:</span> {complaint.area}</div>
              <div><span className="text-muted">Landmark:</span> {complaint.landmark ?? "—"}</div>
            </dl>
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-bold text-navy">Current Timeline</h4>
              <ComplaintTimeline complaint={complaint} />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="m-assign" className="gov-label">Assign to Department</label>
              <select id="m-assign" className="gov-input" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                <option value="">Unassigned</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="m-status" className="gov-label">Update Status</label>
              <select id="m-status" className="gov-input" value={status} onChange={(e) => setStatus(e.target.value as ComplaintStatus)}>
                {COMPLAINT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="m-note" className="gov-label">Note (optional)</label>
              <textarea id="m-note" rows={3} className="gov-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an update note for the citizen…" />
            </div>
            <div className="flex gap-3">
              <button className="gov-btn-saffron" onClick={() => onApply(complaint.id, status, assignedTo, note)}>Save Update</button>
              <button className="gov-btn-outline" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
