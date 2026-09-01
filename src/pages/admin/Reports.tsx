import { useEffect, useState } from "react"
 import { FileSpreadsheet, Download, Printer, Loader2 } from "lucide-react"
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
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-navy" />
            <span>Reports &amp; Export</span>
          </h1>
          <p className="mt-1 text-xs text-[#64748B]">Generate, analyze, and export complete civic complaint datasets for municipal reporting.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="gov-btn-primary gap-2 text-xs font-bold"
            onClick={downloadCsv}
            disabled={loading || complaints.length === 0}
          >
            <Download className="h-4 w-4" />
            ⬇️ Export Complaints CSV
          </button>
          <button className="gov-btn-outline gap-2 text-xs font-bold" onClick={() => window.print()}>
            <Printer className="h-4 w-4 text-navy" />
            🖨️ Print / PDF
          </button>
        </div>
      </div>

      <section className="gov-card overflow-hidden border border-[#D8DEE6] shadow-sm">
        <h2 className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#64748B]">
          Category Distribution Report
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              <tr>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 text-right">Total Reports</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={2} className="px-5 py-10 text-center text-sm text-[#64748B]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-navy" />
                      <span>Loading report…</span>
                    </div>
                  </td>
                </tr>
              ) : categoryStats.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-5 py-8 text-center text-sm text-[#64748B]">No data available.</td>
                </tr>
              ) : (
                categoryStats.map((c) => (
                  <tr key={c.category} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#1E293B]">{c.category}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-navy">{c.count}</td>
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

