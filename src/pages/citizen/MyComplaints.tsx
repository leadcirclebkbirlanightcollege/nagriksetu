import { useEffect, useMemo, useState } from "react"
import { Filter, Eye, X, FileText } from "lucide-react"
import StatusBadge from "../../components/ui/StatusBadge"
import ComplaintTimeline from "../../features/complaints/ComplaintTimeline"
import { listMyComplaints } from "../../features/complaints/api"
import { COMPLAINT_STATUSES, type Complaint, type ComplaintStatus } from "../../types"

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filter, setFilter] = useState<ComplaintStatus | "All">("All")
  const [selected, setSelected] = useState<Complaint | null>(null)

  useEffect(() => {
    listMyComplaints().then(setComplaints).catch(() => setComplaints([]))
  }, [])

  const filtered = useMemo(
    () => (filter === "All" ? complaints : complaints.filter((c) => c.status === filter)),
    [complaints, filter],
  )

  return (
    <div className="space-y-5">
      <div className="gov-card border-t-[4px] border-t-navy p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <h1 className="text-xl font-bold text-navy flex items-center gap-2">
            <FileText className="h-5 w-5 text-navy" />
            <span>My Complaints</span>
          </h1>
          <span className="text-xs font-semibold text-[#64748B]">Showing {filtered.length} of {complaints.length} records</span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-bold text-[#64748B] mr-1">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          {(["All", ...COMPLAINT_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-gov border px-3 py-1 text-xs font-bold transition-all ${
                filter === s
                  ? "border-navy bg-navy text-white shadow-xs"
                  : "border-[#CBD5E1] bg-white text-[#334155] hover:border-navy hover:bg-[#F8FAFC]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="gov-card overflow-x-auto border border-[#D8DEE6] shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            <tr>
              <th className="px-5 py-3.5">Complaint ID</th>
              <th className="px-5 py-3.5">Title</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Reported</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs font-bold text-navy">{c.id}</td>
                <td className="px-5 py-3.5 font-medium text-[#1E293B]">{c.title}</td>
                <td className="px-5 py-3.5">
                  <span className="rounded border border-[#E2E8F0] bg-[#F1F5F9] px-2 py-0.5 text-xs font-medium text-navy">
                    {c.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-[#64748B]">
                  {new Date(c.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" } as never)}
                </td>
                <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:text-[#E65100] underline underline-offset-2"
                    onClick={() => setSelected(c)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-[#64748B]">
                  No complaints in this category.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Complaint ${selected.id}`}
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-gov border-t-[4px] border-t-navy bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="font-mono text-xs font-extrabold tracking-wider text-navy">{selected.id}</span>
                <h2 className="mt-1 text-lg font-bold text-navy">{selected.title}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="gov-btn-outline h-8 w-8 p-0 flex items-center justify-center"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-navy" />
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#334155]">{selected.description}</p>
            <div className="mt-6 border-t border-[#E2E8F0] pt-4">
              <h3 className="mb-4 text-sm font-bold text-navy">Status Timeline</h3>
              <ComplaintTimeline complaint={selected} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

