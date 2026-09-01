import { useState } from "react"
import { Search, Loader2, FileSearch, ShieldCheck } from "lucide-react"
import StatusBadge from "../../components/ui/StatusBadge"
import ComplaintTimeline from "../../features/complaints/ComplaintTimeline"
import { findComplaint } from "../../features/complaints/api"
import type { Complaint } from "../../types"

export default function ComplaintStatus() {
  const [q, setQ] = useState("")
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSearched(true)
    setLoading(true)
    try {
      const res = await findComplaint(q)
      setComplaint(res)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="gov-card border-t-[4px] border-t-navy p-6 shadow-sm">
        <h1 className="text-xl font-bold text-navy flex items-center gap-2">
          <FileSearch className="h-6 w-6 text-navy" />
          <span>Complaint Status</span>
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">Enter a Complaint ID or mobile number to view its live status.</p>
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              className="gov-input pl-9 text-xs"
              placeholder="Complaint ID (e.g. CMP-2026-001) or Mobile Number"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <button className="gov-btn-primary gap-2 text-xs font-bold sm:w-44 shrink-0" disabled={loading || !q.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span>Check Status</span>
          </button>
        </form>
      </div>

      {searched && !complaint && !loading ? (
        <div className="gov-card border border-[#D8DEE6] p-8 text-center text-xs text-[#64748B] shadow-sm">
          No complaint found matching query “<span className="font-bold text-navy">{q}</span>”. Please verify the ID or Mobile Number.
        </div>
      ) : null}

      {complaint ? (
        <div className="gov-card border-t-[4px] border-t-navy p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-navy">{complaint.id}</span>
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

