import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
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
    <div className="gov-container py-8">
      <SectionHeading
        title="Track Your Complaint"
        subtitle="Search by Complaint ID (e.g. NS-2026-000412) or the registered mobile number"
      />

      <form onSubmit={onSubmit} className="gov-card mb-6 flex flex-col gap-3 p-5 sm:flex-row">
        <label htmlFor="track-q" className="sr-only">Complaint ID or Mobile Number</label>
        <input
          id="track-q"
          className="gov-input"
          placeholder="Enter Complaint ID or Mobile Number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="gov-btn-primary sm:w-48">Search</button>
      </form>

      {loading ? <p className="text-muted">Searching…</p> : null}

      {!loading && searched && !complaint ? (
        <div className="gov-card border-t-4 border-t-saffron p-6">
          <p className="font-semibold text-navy">No complaint found</p>
          <p className="mt-1 text-sm text-ink/80">
            Please check the Complaint ID or mobile number and try again. Try the sample ID{" "}
            <button className="gov-link" onClick={() => { setQuery("NS-2026-000412"); runSearch("NS-2026-000412") }}>
              NS-2026-000412
            </button>.
          </p>
        </div>
      ) : null}

      {!loading && complaint ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="gov-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded bg-surfaceAlt px-2.5 py-1 text-sm font-bold text-navy">{complaint.id}</span>
              <StatusBadge status={complaint.status} />
            </div>
            <h2 className="mt-3 text-xl font-bold text-navy">{complaint.title}</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
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
            <div className="mt-4">
              <p className="gov-label">Description</p>
              <p className="text-sm text-ink/80">{complaint.description}</p>
            </div>
          </div>

          <div className="gov-card p-6">
            <h3 className="mb-4 text-base font-bold text-navy">Status Timeline</h3>
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
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  )
}
