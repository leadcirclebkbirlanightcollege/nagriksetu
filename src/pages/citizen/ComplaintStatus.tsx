import { useState } from "react"
import StatusBadge from "../../components/ui/StatusBadge"
import ComplaintTimeline from "../../features/complaints/ComplaintTimeline"
import { findComplaint } from "../../features/complaints/api"
import type { Complaint } from "../../types"

export default function ComplaintStatus() {
  const [q, setQ] = useState("")
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [searched, setSearched] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSearched(true)
    setComplaint(await findComplaint(q))
  }

  return (
    <div className="space-y-4">
      <div className="gov-card p-4">
        <h1 className="text-xl font-bold text-navy">Complaint Status</h1>
        <p className="mt-1 text-sm text-ink/80">Enter a Complaint ID or mobile number to view its live status.</p>
        <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input className="gov-input" placeholder="Complaint ID or Mobile Number" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="gov-btn-primary sm:w-40">Check Status</button>
        </form>
      </div>

      {searched && !complaint ? (
        <div className="gov-card p-6 text-muted">No complaint found for “{q}”.</div>
      ) : null}

      {complaint ? (
        <div className="gov-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs font-semibold text-navy">{complaint.id}</span>
              <h2 className="text-lg font-bold text-navy">{complaint.title}</h2>
            </div>
            <StatusBadge status={complaint.status} />
          </div>
          <div className="mt-5">
            <ComplaintTimeline complaint={complaint} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
