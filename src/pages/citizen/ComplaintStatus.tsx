import { useState } from "react"
import { Search, Loader2, FileSearch, X, AlertCircle } from "lucide-react"
import StatusBadge from "../../components/ui/StatusBadge"
import Breadcrumb from "../../components/ui/Breadcrumb"
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
      <Breadcrumb items={[{ label: "Citizen Portal", to: "/citizen" }, { label: "Complaint Status" }]} />

      <div className="gov-card border-t-4 border-t-navy p-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
          <FileSearch className="h-6 w-6 text-navy" aria-hidden="true" />
          <span>Complaint Status Verification</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-muted">
          Enter an official Complaint ID or registered mobile number to view live department progress.
        </p>

        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light"
              aria-hidden="true"
            />
            <input
              className="gov-input pl-9 pr-8 text-xs sm:text-sm"
              placeholder="Complaint ID (e.g. NS-2026-000412) or 10-digit Mobile Number"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q ? (
              <button
                type="button"
                onClick={() => {
                  setQ("")
                  setComplaint(null)
                  setSearched(false)
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink"
                aria-label="Clear input"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <button
            type="submit"
            className="gov-btn-primary gap-2 text-xs sm:text-sm font-bold sm:w-44 shrink-0 shadow-sm"
            disabled={loading || !q.trim()}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
            ) : (
              <Search className="h-4 w-4" aria-hidden="true" />
            )}
            <span>Check Status</span>
          </button>
        </form>
      </div>

      {searched && !complaint && !loading ? (
        <div className="gov-card border border-line p-8 text-center text-xs text-ink-muted shadow-sm">
          <AlertCircle className="mx-auto h-6 w-6 text-saffron mb-2" aria-hidden="true" />
          <p>
            No complaint found matching query “<strong className="text-navy">{q}</strong>”. Please verify the ID or mobile number.
          </p>
        </div>
      ) : null}

      {complaint ? (
        <div className="gov-card border-t-4 border-t-navy p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lineSubtle pb-4">
            <div>
              <span className="font-mono text-xs font-extrabold text-navy">{complaint.id}</span>
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
