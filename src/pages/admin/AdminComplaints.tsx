import { useEffect, useMemo, useState } from "react"
import {
  RotateCw,
  Search,
  SlidersHorizontal,
  X,
  Trash2,
  Save,
  Loader2,
  FolderKanban,
  AlertCircle,
} from "lucide-react"
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
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-navy" />
            <span>Complaint Management</span>
          </h1>
          <p className="mt-1 text-xs text-[#64748B]">Assign complaints to departments, update progress timeline, and resolve issues.</p>
        </div>
        <button className="gov-btn-outline gap-2 text-xs font-bold" onClick={loadComplaints}>
          <RotateCw className="h-3.5 w-3.5" />
          🔄 Refresh
        </button>
      </div>

      {error ? (
        <div role="alert" className="flex items-center gap-2.5 rounded-gov border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-xs font-bold text-[#991B1B]">
          <AlertCircle className="h-4 w-4 text-[#DC2626] shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 text-xs font-bold text-[#64748B] mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filter:
          </span>
          {(["All", ...COMPLAINT_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-gov border px-3 py-1 text-xs font-bold transition-all ${
                statusFilter === s
                  ? "border-navy bg-navy text-white shadow-xs"
                  : "border-[#CBD5E1] bg-white text-[#334155] hover:border-navy hover:bg-[#F8FAFC]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#64748B]" />
          <input
            type="search"
            className="gov-input pl-9 text-xs"
            placeholder="Search by ID, title, area…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="gov-card overflow-x-auto border border-[#D8DEE6] shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-center text-[#64748B]">
            <Loader2 className="h-5 w-5 animate-spin text-navy" />
            <span className="font-semibold text-sm">Loading complaints…</span>
          </div>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              <tr>
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Area / Ward</th>
                <th className="px-5 py-3.5">Assigned To</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-[#64748B]">
                    No complaints found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-navy">{c.id}</td>
                    <td className="px-5 py-3.5 font-medium text-[#1E293B]">{c.title}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded border border-[#E2E8F0] bg-[#F1F5F9] px-2 py-0.5 text-xs font-medium text-navy">
                        {c.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#64748B]">{c.area}</td>
                    <td className="px-5 py-3.5 text-xs font-medium text-[#334155]">{c.assignedTo || c.departmentName || "—"}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        className="gov-btn-primary px-3 py-1.5 text-xs font-bold"
                        onClick={() => setSelected(c)}
                      >
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Manage Complaint ${complaint.id}`}
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-gov border-t-[4px] border-t-navy bg-white p-6 sm:p-7 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
          <div>
            <span className="font-mono text-xs font-extrabold tracking-wider text-navy">{complaint.id}</span>
            <h2 className="mt-1 text-lg font-bold text-navy">{complaint.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="gov-btn-outline h-8 w-8 p-0 flex items-center justify-center"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-navy" />
          </button>
        </div>

        <div className="mt-4 rounded-gov border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs">
          <p className="text-sm leading-relaxed text-[#334155]">{complaint.description}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[#64748B] border-t border-[#E2E8F0] pt-2.5">
            <span><strong className="text-navy">Category:</strong> {complaint.category}</span>
            <span><strong className="text-navy">Area:</strong> {complaint.area}</span>
            {complaint.contactNumber ? <span><strong className="text-navy">Contact:</strong> {complaint.contactNumber}</span> : null}
            {complaint.reporterName ? <span><strong className="text-navy">Reporter:</strong> {complaint.reporterName}</span> : null}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t border-[#E2E8F0] pt-5">
          <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Update Status &amp; Assignment</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="m-status" className="gov-label">Status</label>
              <select
                id="m-status"
                className="gov-input text-xs font-semibold"
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
                className="gov-input text-xs font-semibold"
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
              className="gov-input text-xs"
              placeholder="e.g. Field inspection carried out. Repair crew dispatched to site."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#DC2626] hover:underline"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
              🗑️ Delete Complaint
            </button>
            <div className="flex gap-2">
              <button type="button" className="gov-btn-outline text-xs font-bold" onClick={onClose}>Cancel</button>
              <button type="submit" className="gov-btn-primary gap-2 text-xs font-bold" disabled={busy}>
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {busy ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 border-t border-[#E2E8F0] pt-5">
          <h3 className="mb-4 text-sm font-bold text-navy uppercase tracking-wider">Audit History Timeline</h3>
          <ComplaintTimeline complaint={complaint} />
        </div>
      </div>
    </div>
  )
}

