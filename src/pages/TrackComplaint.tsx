import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, AlertCircle, FileText, Loader2, Copy, Check, X, ShieldAlert } from "lucide-react"
import SectionHeading from "../components/ui/SectionHeading"
import Breadcrumb from "../components/ui/Breadcrumb"
import StatusBadge from "../components/ui/StatusBadge"
import EmptyState from "../components/ui/EmptyState"
import ComplaintTimeline from "../features/complaints/ComplaintTimeline"
import { findComplaint } from "../features/complaints/api"
import type { Complaint } from "../types"

export default function TrackComplaint() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get("q") ?? "")
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

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

  function clearSearch() {
    setQuery("")
    setComplaint(null)
    setSearched(false)
    setParams({})
  }

  function copyId(id: string) {
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="gov-container py-6 sm:py-8">
      <Breadcrumb items={[{ label: "Track Complaint" }]} />

      <SectionHeading
        title="Track Your Complaint"
        subtitle="Search by Complaint ID (e.g. NS-2026-000412) or registered 10-digit mobile number"
      />

      {/* Search Bar */}
      <form onSubmit={onSubmit} className="gov-card mb-8 border-t-4 border-t-navy p-5 shadow-card">
        <label htmlFor="track-q" className="sr-only">
          Complaint ID or Mobile Number
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light"
              aria-hidden="true"
            />
            <input
              id="track-q"
              className="gov-input pl-10 pr-9"
              placeholder="Enter Complaint ID (e.g. NS-2026-000412) or Mobile Number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query ? (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-ink-light hover:text-ink focus:outline-none"
                aria-label="Clear search input"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <button type="submit" className="gov-btn-primary gap-2 sm:w-48 font-bold shadow-sm">
            <Search className="h-4 w-4" aria-hidden="true" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Loading state */}
      {loading ? (
        <div className="gov-card flex items-center justify-center gap-3 p-10 text-center text-ink-muted shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-navy" aria-hidden="true" />
          <p className="font-semibold text-sm">Searching grievance database…</p>
        </div>
      ) : null}

      {/* Empty / Error state */}
      {!loading && searched && !complaint ? (
        <div className="gov-card border-l-4 border-l-saffron p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-saffron mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-bold text-navy text-base">No complaint found</p>
              <p className="mt-1 text-xs sm:text-sm text-ink-muted leading-relaxed">
                Please check the Complaint ID or mobile number and try again. You can test with the sample ID{" "}
                <button
                  type="button"
                  className="font-bold text-navy underline decoration-saffron underline-offset-2 hover:text-saffron"
                  onClick={() => {
                    setQuery("NS-2026-000412")
                    setParams({ q: "NS-2026-000412" })
                    runSearch("NS-2026-000412")
                  }}
                >
                  NS-2026-000412
                </button>
                .
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Found Complaint Card & Timeline */}
      {!loading && complaint ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="gov-card border-t-4 border-t-navy p-6 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lineSubtle pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-navy shrink-0" aria-hidden="true" />
                <span className="font-mono text-sm font-extrabold tracking-wide text-navy">
                  {complaint.id}
                </span>
                <button
                  type="button"
                  onClick={() => copyId(complaint.id)}
                  className="inline-flex items-center gap-1 rounded-gov border border-line bg-surfaceAlt px-2 py-0.5 text-xs font-semibold text-navy hover:bg-lineSubtle transition-colors"
                  title="Copy reference ID"
                  aria-label="Copy reference ID"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-govGreen" aria-hidden="true" />
                      <span className="text-govGreen text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-navy" aria-hidden="true" />
                      <span className="text-[11px]">Copy ID</span>
                    </>
                  )}
                </button>
              </div>
              <StatusBadge status={complaint.status} />
            </div>

            <h2 className="mt-4 text-xl font-bold tracking-tight text-navy">{complaint.title}</h2>

            <dl className="mt-5 grid gap-x-6 gap-y-4 rounded-gov border border-line bg-surface p-4 text-sm sm:grid-cols-2">
              <Field label="Category" value={complaint.category} />
              <Field label="Area / Ward" value={complaint.area} />
              <Field label="Landmark" value={complaint.landmark ?? "—"} />
              <Field label="Assigned Department / Officer" value={complaint.assignedTo ?? "Pending assignment"} />
              <Field
                label="Reported On"
                value={new Date(complaint.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" } as never)}
              />
              <Field label="Reporting Mode" value={complaint.anonymous ? "Anonymous" : "Registered citizen"} />
            </dl>

            <div className="mt-5 border-t border-lineSubtle pt-4">
              <p className="gov-label text-xs uppercase tracking-wider">Detailed Description</p>
              <p className="mt-1 text-sm leading-relaxed text-ink">{complaint.description}</p>
            </div>
          </div>

          <div className="gov-card border-t-4 border-t-navy p-6 shadow-card">
            <h3 className="mb-5 border-b border-lineSubtle pb-3 text-base font-bold text-navy flex items-center justify-between">
              <span>Status Timeline</span>
              <span className="text-xs font-semibold text-ink-muted">Official Audit Log</span>
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
      <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">{label}</dt>
      <dd className="mt-0.5 font-bold text-navy">{value}</dd>
    </div>
  )
}
