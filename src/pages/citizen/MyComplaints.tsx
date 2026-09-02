import { useEffect, useMemo, useState } from "react"
import { Filter, Eye, Search, FileText, Calendar, Tag, ShieldCheck } from "lucide-react"
import StatusBadge from "../../components/ui/StatusBadge"
import Breadcrumb from "../../components/ui/Breadcrumb"
import EmptyState from "../../components/ui/EmptyState"
import Modal from "../../components/ui/Modal"
import Pagination from "../../components/ui/Pagination"
import ComplaintTimeline from "../../features/complaints/ComplaintTimeline"
import { listMyComplaints } from "../../features/complaints/api"
import { COMPLAINT_STATUSES, type Complaint, type ComplaintStatus } from "../../types"

const PAGE_SIZE = 8

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filter, setFilter] = useState<ComplaintStatus | "All">("All")
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selected, setSelected] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listMyComplaints()
      .then((data) => setComplaints(data))
      .catch(() => setComplaints([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesFilter = filter === "All" || c.status === filter
      const matchesSearch =
        !search.trim() ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [complaints, filter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filter, search])

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Citizen Portal", to: "/citizen" }, { label: "My Complaints" }]} />

      {/* Header & Filter Card */}
      <div className="gov-card border-t-4 border-t-navy p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lineSubtle pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
              <FileText className="h-6 w-6 text-navy" aria-hidden="true" />
              <span>My Complaints</span>
            </h1>
            <p className="mt-1 text-xs text-ink-muted">
              Official record of all grievances reported by your registered account
            </p>
          </div>
          <span className="text-xs font-semibold text-ink-muted">
            Showing {filtered.length} of {complaints.length} records
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative sm:w-80">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-light"
              aria-hidden="true"
            />
            <input
              type="search"
              className="gov-input pl-9 text-xs"
              placeholder="Search by ID, title, or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            <span className="flex items-center gap-1 text-xs font-bold text-ink-muted mr-1">
              <Filter className="h-3.5 w-3.5" aria-hidden="true" /> Status:
            </span>
            {(["All", ...COMPLAINT_STATUSES] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={`rounded-gov border px-2.5 py-1 text-xs font-bold transition-all ${
                  filter === s
                    ? "border-navy bg-navy text-white shadow-xs"
                    : "border-line bg-white text-ink hover:border-navy hover:bg-surface"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Administrative Table (Hidden on Mobile) */}
      <div className="hidden md:block gov-card overflow-hidden border border-line shadow-sm">
        <table className="w-full text-left text-sm" aria-label="Citizen grievances list">
          <thead className="border-b border-line bg-surfaceAlt text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            <tr>
              <th scope="col" className="px-5 py-3.5">Complaint ID</th>
              <th scope="col" className="px-5 py-3.5">Title</th>
              <th scope="col" className="px-5 py-3.5">Category</th>
              <th scope="col" className="px-5 py-3.5">Reported</th>
              <th scope="col" className="px-5 py-3.5">Status</th>
              <th scope="col" className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lineSubtle">
            {paginated.map((c) => (
              <tr key={c.id} className="hover:bg-surface transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs font-extrabold text-navy">{c.id}</td>
                <td className="px-5 py-3.5 font-medium text-ink max-w-xs truncate">{c.title}</td>
                <td className="px-5 py-3.5">
                  <span className="rounded-gov border border-line bg-surfaceAlt px-2.5 py-0.5 text-xs font-semibold text-navy">
                    {c.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-ink-muted">
                  {new Date(c.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" } as never)}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={c.status} size="sm" />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:text-saffron underline underline-offset-2 transition-colors"
                    onClick={() => setSelected(c)}
                    aria-label={`View details for complaint ${c.id}`}
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} className="p-0">
                  <EmptyState
                    title="No complaints found"
                    description="No registered complaints match your search and filter criteria."
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

      {/* Mobile Responsive Complaint Cards (NO horizontal scrollbar) */}
      <div className="space-y-3 md:hidden">
        {paginated.map((c) => (
          <div key={c.id} className="gov-card p-4 shadow-sm border border-line space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-lineSubtle pb-2.5">
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
                <span className="inline-flex items-center gap-1 text-[11px]">
                  <Calendar className="h-3 w-3 text-ink-light" aria-hidden="true" />
                  {new Date(c.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" } as never)}
                </span>
              </div>
            </div>

            <div className="border-t border-lineSubtle pt-2.5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelected(c)}
                className="gov-btn-outline gap-1.5 py-1 px-3 text-xs font-bold"
                aria-label={`View details for complaint ${c.id}`}
              >
                <Eye className="h-3.5 w-3.5 text-navy" aria-hidden="true" />
                <span>View Details &amp; Status</span>
              </button>
            </div>
          </div>
        ))}

        {paginated.length === 0 && !loading ? (
          <EmptyState
            title="No complaints found"
            description="No registered complaints match your search and filter criteria."
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

      {/* Accessible Complaint Details Modal */}
      {selected ? (
        <Modal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          title={`Complaint Reference: ${selected.id}`}
          description="Detailed grievance log, assigned department, and audit timeline"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="rounded-gov border border-line bg-surfaceAlt px-2.5 py-0.5 text-xs font-bold text-navy">
                  {selected.category}
                </span>
                <StatusBadge status={selected.status} />
              </div>
              <h3 className="text-base font-bold text-navy">{selected.title}</h3>
            </div>

            <div className="rounded-gov border border-line bg-surface p-3.5 text-xs grid gap-2 sm:grid-cols-2">
              <div>
                <span className="text-ink-muted font-medium">Area / Ward:</span>{" "}
                <strong className="text-navy">{selected.area}</strong>
              </div>
              <div>
                <span className="text-ink-muted font-medium">Landmark:</span>{" "}
                <strong className="text-navy">{selected.landmark || "None specified"}</strong>
              </div>
              <div>
                <span className="text-ink-muted font-medium">Assigned To:</span>{" "}
                <strong className="text-navy">{selected.assignedTo || "Pending assignment"}</strong>
              </div>
              <div>
                <span className="text-ink-muted font-medium">Lodged On:</span>{" "}
                <strong className="text-navy">
                  {new Date(selected.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </strong>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                Grievance Description
              </h4>
              <p className="text-xs sm:text-sm text-ink leading-relaxed rounded-gov border border-lineSubtle bg-white p-3">
                {selected.description}
              </p>
            </div>

            <div className="border-t border-lineSubtle pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3 flex items-center justify-between">
                <span>Official Status Timeline</span>
                <span className="text-[11px] font-semibold text-navy">Audit Trail</span>
              </h4>
              <ComplaintTimeline complaint={selected} />
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
