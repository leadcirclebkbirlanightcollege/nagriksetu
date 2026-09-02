import { useEffect, useMemo, useState } from "react"
import {
  FolderKanban,
  Search,
  SlidersHorizontal,
  RotateCw,
  Loader2,
  AlertCircle,
  Eye,
  Trash2,
  Save,
  Tag,
  Calendar,
} from "lucide-react"
import StatusBadge from "../../components/ui/StatusBadge"
import Breadcrumb from "../../components/ui/Breadcrumb"
import EmptyState from "../../components/ui/EmptyState"
import Modal from "../../components/ui/Modal"
import Pagination from "../../components/ui/Pagination"
import ComplaintTimeline from "../../features/complaints/ComplaintTimeline"
import { useToast } from "../../components/ui/Toast"
import {
  apiListComplaints,
  apiUpdateStatus,
  apiDeleteComplaint,
} from "../../lib/api"
import { COMPLAINT_STATUSES, type Complaint, type ComplaintStatus } from "../../types"

const PAGE_SIZE = 10

const departments = [
  "Solid Waste Management",
  "Roads & Infrastructure",
  "Water Supply & Sewerage",
  "Public Health & Sanitation",
  "Electrical & Street Lighting",
  "Garden & Parks",
  "Disaster & Emergency",
]

export default function AdminComplaints() {
  const { success: toastSuccess, error: toastError } = useToast()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "All">("All")
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selected, setSelected] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadComplaints() {
    setLoading(true)
    setError(null)
    try {
      const data = await apiListComplaints()
      setComplaints(data)
    } catch (err) {
      setError((err as Error).message || "Failed to load complaints from backend")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchStatus = statusFilter === "All" || c.status === statusFilter
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [complaints, statusFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, search])

  async function handleApplyChanges(
    id: string,
    newStatus: ComplaintStatus,
    newAssignedTo: string,
    note: string,
  ) {
    try {
      await apiUpdateStatus(id, newStatus, note, newAssignedTo)
      toastSuccess(`Complaint ${id} updated to ${newStatus}`)
      await loadComplaints()
      setSelected(null)
    } catch (err) {
      toastError("Failed to update status: " + (err as Error).message)
    }
  }

  async function handleDelete(id: string) {
    if (
      !window.confirm(
        `Are you sure you want to delete complaint ${id}? This action will permanently remove it from the database.`,
      )
    ) {
      return
    }
    try {
      await apiDeleteComplaint(id)
      toastSuccess(`Complaint ${id} deleted successfully`)
      await loadComplaints()
      setSelected(null)
    } catch (err) {
      toastError("Failed to delete complaint: " + (err as Error).message)
    }
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Administration", to: "/admin" }, { label: "Complaint Management" }]} />

      {/* Toolbar & Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lineSubtle pb-4">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-navy" aria-hidden="true" />
            <span>Department Complaint Management</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted">
            Assign grievances to municipal departments, update progress milestones, and record resolution audits.
          </p>
        </div>
        <button
          type="button"
          className="gov-btn-outline gap-2 text-xs font-bold shadow-xs"
          onClick={loadComplaints}
          disabled={loading}
        >
          <RotateCw className={`h-3.5 w-3.5 text-navy ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
          <span>Refresh</span>
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-gov border border-govRed-border bg-govRed-tint p-3.5 text-xs font-bold text-govRed-dark"
        >
          <AlertCircle className="h-4 w-4 text-govRed shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          <span className="flex items-center gap-1 text-xs font-bold text-ink-muted mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" /> Filter:
          </span>
          {(["All", ...COMPLAINT_STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-gov border px-3 py-1 text-xs font-bold transition-all ${
                statusFilter === s
                  ? "border-navy bg-navy text-white shadow-xs"
                  : "border-line bg-white text-ink hover:border-navy hover:bg-surfaceAlt"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-light"
            aria-hidden="true"
          />
          <input
            type="search"
            className="gov-input pl-9 text-xs"
            placeholder="Search by ID, title, area, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Data Table */}
      <div className="hidden md:block gov-card overflow-hidden border border-line shadow-sm">
        <table className="w-full text-left text-sm" aria-label="Department complaints table">
          <thead className="border-b border-line bg-surfaceAlt text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            <tr>
              <th scope="col" className="px-5 py-3.5">ID</th>
              <th scope="col" className="px-5 py-3.5">Title</th>
              <th scope="col" className="px-5 py-3.5">Category</th>
              <th scope="col" className="px-5 py-3.5">Area</th>
              <th scope="col" className="px-5 py-3.5">Assigned To</th>
              <th scope="col" className="px-5 py-3.5">Status</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lineSubtle">
            {paginated.map((c) => (
              <tr key={c.id} className="hover:bg-surface transition-colors">
                <td className="px-5 py-3 font-mono text-xs font-extrabold text-navy">{c.id}</td>
                <td className="px-5 py-3 font-medium text-ink max-w-xs truncate">{c.title}</td>
                <td className="px-5 py-3">
                  <span className="rounded-gov border border-line bg-surfaceAlt px-2.5 py-0.5 text-xs font-semibold text-navy">
                    {c.category}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-ink-muted">{c.area}</td>
                <td className="px-5 py-3 text-xs font-medium text-ink">
                  {c.assignedTo || <span className="text-ink-light italic">Unassigned</span>}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={c.status} size="sm" />
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:text-saffron underline underline-offset-2 transition-colors"
                    onClick={() => setSelected(c)}
                    aria-label={`Manage complaint ${c.id}`}
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Manage</span>
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} className="p-0">
                  <EmptyState
                    title="No complaints found"
                    description="No grievances match the active filter and search terms."
                  />
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Mobile Stacked Complaint Cards */}
      <div className="space-y-3 md:hidden">
        {paginated.map((c) => (
          <div key={c.id} className="gov-card p-4 shadow-sm border border-line space-y-3">
            <div className="flex items-center justify-between border-b border-lineSubtle pb-2.5">
              <span className="font-mono text-xs font-extrabold text-navy">{c.id}</span>
              <StatusBadge status={c.status} size="sm" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-navy leading-snug">{c.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                <span className="inline-flex items-center gap-1 rounded bg-surfaceAlt px-2 py-0.5 font-medium text-navy">
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {c.category}
                </span>
                <span>• Area: {c.area}</span>
              </div>
              <p className="mt-1 text-xs text-ink-light">
                Assigned: <strong className="text-ink">{c.assignedTo || "Unassigned"}</strong>
              </p>
            </div>

            <div className="border-t border-lineSubtle pt-2.5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelected(c)}
                className="gov-btn-outline gap-1.5 py-1 px-3 text-xs font-bold"
                aria-label={`Manage complaint ${c.id}`}
              >
                <Eye className="h-3.5 w-3.5 text-navy" aria-hidden="true" />
                <span>Manage &amp; Update Status</span>
              </button>
            </div>
          </div>
        ))}

        {paginated.length === 0 && !loading ? (
          <EmptyState
            title="No complaints found"
            description="No grievances match the active filter and search terms."
          />
        ) : null}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Accessible Management Modal */}
      {selected ? (
        <Modal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          title={`Administrative Action: ${selected.id}`}
          description="Update grievance milestone, assign municipal departments, and record action remarks"
          maxWidth="2xl"
        >
          <ManageComplaintModal
            complaint={selected}
            onClose={() => setSelected(null)}
            onApply={handleApplyChanges}
            onDelete={() => handleDelete(selected.id)}
          />
        </Modal>
      ) : null}
    </div>
  )
}

function ManageComplaintModal({
  complaint,
  onClose,
  onApply,
  onDelete,
}: {
  complaint: Complaint
  onClose: () => void
  onApply: (id: string, s: ComplaintStatus, assignedTo: string, note: string) => Promise<void>
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
    <div className="space-y-4">
      <div className="rounded-gov border border-line bg-surface p-4 text-xs">
        <h3 className="text-sm font-bold text-navy mb-1">{complaint.title}</h3>
        <p className="text-xs text-ink leading-relaxed">{complaint.description}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted border-t border-lineSubtle pt-2.5">
          <span><strong className="text-navy">Category:</strong> {complaint.category}</span>
          <span><strong className="text-navy">Area:</strong> {complaint.area}</span>
          {complaint.contactNumber ? <span><strong className="text-navy">Contact:</strong> {complaint.contactNumber}</span> : null}
          {complaint.reporterName ? <span><strong className="text-navy">Reporter:</strong> {complaint.reporterName}</span> : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border-t border-lineSubtle pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          Update Status &amp; Assignment
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="m-status" className="gov-label text-xs">Status Milestone</label>
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
            <label htmlFor="m-dept" className="gov-label text-xs">Department / Officer</label>
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
          <label htmlFor="m-note" className="gov-label text-xs">Administrative Remarks / Action Taken</label>
          <textarea
            id="m-note"
            rows={3}
            className="gov-input text-xs"
            placeholder="e.g. Field inspection completed. Work crew dispatched to rectify issue."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-bold text-govRed hover:underline focus:outline-none"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Delete Complaint</span>
          </button>
          <div className="flex gap-2">
            <button type="button" className="gov-btn-outline text-xs font-bold" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="gov-btn-primary gap-2 text-xs font-bold shadow-sm" disabled={busy}>
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <Save className="h-3.5 w-3.5" />}
              <span>{busy ? "Saving…" : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </form>

      <div className="border-t border-lineSubtle pt-4">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-muted">
          Audit History Timeline
        </h4>
        <ComplaintTimeline complaint={complaint} />
      </div>
    </div>
  )
}
