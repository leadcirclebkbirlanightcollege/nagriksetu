import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, AlertCircle, FileText, Loader2 } from "lucide-react"
import SectionHeading from "../components/ui/SectionHeading"
import StatusBadge from "../components/ui/StatusBadge"
import ComplaintTimeline from "../features/complaints/ComplaintTimeline"
import { findComplaint } from "../features/complaints/api"
import type { Complaint } from "../types"

export default function TrackComplaint() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get("q") ?? "")
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function runSearch(q: string) {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const found = await findComplaint(q)
      setComplaint(found)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const q = params.get("q")
    if (q) runSearch(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setParams(query ? { q: query } : {})
    runSearch(query)
  }

  return (
    <div className="gov-container py-8 sm:py-10">
      <SectionHeading
        title="Track Your Complaint"
        subtitle="Search by Complaint ID (e.g. NS-2026-000412) or the registered mobile number"
      />

      <form onSubmit={onSubmit} className="gov-card mb-8 border-t-[3px] border-t-navy p-5 shadow-sm">
        <label htmlFor="track-q" className="sr-only">Complaint ID or Mobile Number</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              id="track-q"
              className="gov-input pl-10"
              placeholder="Enter Complaint ID or Mobile Number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="gov-btn-primary gap-2 sm:w-48 font-bold">
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <div className="gov-card flex items-center justify-center gap-3 p-8 text-center text-[#475569]">
          <Loader2 className="h-5 w-5 animate-spin text-navy" />
          <p className="font-semibold text-sm">Searching…</p>
        </div>
      ) : null}

      {!loading && searched && !complaint ? (
        <div className="gov-card border-l-[4px] border-l-[#E65100] p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-[#E65100] mt-0.5" />
            <div>
              <p className="font-bold text-navy">No complaint found</p>
              <p className="mt-1 text-sm text-[#475569]">
                Please check the Complaint ID or mobile number and try again. Try the sample ID{" "}
                <button
                  type="button"
                  className="font-bold text-navy underline decoration-saffron underline-offset-2 hover:text-[#E65100]"
                  onClick={() => { setQuery("NS-2026-000412"); runSearch("NS-2026-000412") }}
                >
                  NS-2026-000412
                </button>.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {!loading && complaint ? (
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div className="gov-card border-t-[4px] border-t-navy p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-navy" />
                <span className="font-mono text-sm font-extrabold tracking-wide text-navy">{complaint.id}</span>
              </div>
              <StatusBadge status={complaint.status} />
            </div>
            <h2 className="mt-4 text-xl font-bold tracking-tight text-navy">{complaint.title}</h2>
            <dl className="mt-5 grid gap-x-6 gap-y-4 rounded-gov border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm sm:grid-cols-2">
              <Field label="Category" value={complaint.category} />
              <Field label="Area / Ward" value={complaint.area} />
              <Field label="Landmark" value={complaint.landmark ?? "—"} />
              <Field label="Assigned To" value={complaint.assignedTo ?? "Pending assignment"} />
              <Field
                label="Reported On"
                value={new Date(complaint.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" } as never)}
              />
              <Field label="Reporting" value={complaint.anonymous ? "Anonymous" : "Registered citizen"} />
            </dl>
            <div className="mt-5 border-t border-[#E2E8F0] pt-4">
              <p className="gov-label text-xs uppercase tracking-wider">Description</p>
              <p className="mt-1 text-sm leading-relaxed text-[#334155]">{complaint.description}</p>
            </div>
          </div>

          <div className="gov-card border-t-[4px] border-t-navy p-6 shadow-sm">
            <h3 className="mb-5 border-b border-[#E2E8F0] pb-3 text-base font-bold text-navy flex items-center justify-between">
              <span>Status Timeline</span>
              <span className="text-xs font-semibold text-[#64748B]">Official Log</span>
            </h3>
            <ComplaintTimeline complaint={complaint} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">{label}</dt>
      <dd className="mt-0.5 font-semibold text-navy">{value}</dd>
    </div>
  )
}

