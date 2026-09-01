import { useEffect, useMemo, useState } from "react"
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
    <div className="space-y-4">
      <div className="gov-card p-4">
        <h1 className="text-xl font-bold text-navy">My Complaints</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["All", ...COMPLAINT_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-gov border px-3 py-1.5 text-sm font-medium ${
                filter === s ? "border-navy bg-navy text-white" : "border-line bg-white text-ink hover:bg-surface"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="gov-card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Complaint ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Reported</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-surface">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-navy">{c.id}</td>
                <td className="px-4 py-3 text-ink">{c.title}</td>
                <td className="px-4 py-3">{c.category}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(c.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" } as never)}
                </td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3">
                  <button className="gov-link" onClick={() => setSelected(c)}>View</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">No complaints in this category.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Complaint ${selected.id}`}
          onClick={() => setSelected(null)}
        >
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-gov bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-semibold text-navy">{selected.id}</span>
                <h2 className="text-lg font-bold text-navy">{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="gov-btn-outline px-3" aria-label="Close">✕</button>
            </div>
            <p className="mt-2 text-sm text-ink/80">{selected.description}</p>
            <div className="mt-5">
              <h3 className="mb-3 font-bold text-navy">Status Timeline</h3>
              <ComplaintTimeline complaint={selected} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
