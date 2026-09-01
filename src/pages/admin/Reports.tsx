import { useEffect, useState } from "react"
import { apiListComplaints, apiGetAnalytics } from "../../lib/api"
import type { Complaint } from "../../types"

export default function Reports() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [categoryStats, setCategoryStats] = useState<Array<{ category: string; count: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiListComplaints({ archived: false }),
      apiGetAnalytics(),
    ])
      .then(([comp, ana]) => {
        setComplaints(comp)
        setCategoryStats(ana.categoryStats)
      })
      .catch((err) => console.warn("Failed to load report data", err))
      .finally(() => setLoading(false))
  }, [])

  function downloadCsv() {
    const headers = [
      "Complaint ID",
      "Title",
      "Category",
      "Status",
      "Priority",
      "Area",
      "Ward",
      "Landmark",
      "Assigned To",
      "Created At",
      "Updated At",
    ]
    const rows = complaints.map((c) => [
      `"${c.id}"`,
      `"${(c.title || "").replace(/"/g, '""')}"`,
      `"${c.category || ""}"`,
      `"${c.status || ""}"`,
      `"${c.priority || ""}"`,
      `"${c.area || ""}"`,
      `"${c.ward || ""}"`,
      `"${(c.landmark || "").replace(/"/g, '""')}"`,
      `"${c.assignedTo || c.departmentName || ""}"`,
      `"${c.createdAt || ""}"`,
      `"${c.updatedAt || ""}"`,
    ])

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `nagriksetu-civic-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Reports &amp; Export</h1>
          <p className="text-sm text-muted">Generate, analyze, and export complete civic complaint datasets for municipal reporting.</p>
        </div>
        <div className="flex gap-2">
          <button className="gov-btn-primary" onClick={downloadCsv} disabled={loading || complaints.length === 0}>
            ⬇️ Export Complaints CSV
          </button>
          <button className="gov-btn-outline" onClick={() => window.print()}>
            🖨️ Print / PDF
          </button>
        </div>
      </div>

      <section className="gov-card overflow-hidden">
        <h2 className="border-b border-line bg-surface px-4 py-3 text-base font-bold text-navy">Category Distribution Report</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5">Total Reports</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-muted">Loading report…</td>
                </tr>
              ) : categoryStats.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-muted">No data available.</td>
                </tr>
              ) : (
                categoryStats.map((c) => (
                  <tr key={c.category} className="hover:bg-surface">
                    <td className="px-4 py-2.5 font-medium text-ink">{c.category}</td>
                    <td className="px-4 py-2.5 font-semibold text-navy">{c.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
