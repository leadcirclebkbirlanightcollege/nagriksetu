import { areaStats, categoryStats } from "../../data/mockData"

function toCsv() {
  const lines = ["Category,Reports"]
  categoryStats.forEach((c) => lines.push(`${c.category},${c.count}`))
  lines.push("", "Area,Reported,Resolved")
  areaStats.forEach((a) => lines.push(`${a.area},${a.reported},${a.resolved}`))
  return lines.join("\n")
}

export default function Reports() {
  function download() {
    const blob = new Blob([toCsv()], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "nagriksetu-report.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Reports &amp; Export</h1>
          <p className="text-sm text-muted">Generate and export civic complaint data.</p>
        </div>
        <div className="flex gap-2">
          <button className="gov-btn-primary" onClick={download}>⬇️ Export CSV</button>
          <button className="gov-btn-outline" onClick={() => window.print()}>🖨️ Print / PDF</button>
        </div>
      </div>

      <section className="gov-card overflow-hidden">
        <h2 className="border-b border-line bg-surface px-4 py-3 text-base font-bold text-navy">Category Report</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-muted">
              <tr><th className="px-4 py-2.5">Category</th><th className="px-4 py-2.5">Reports</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {categoryStats.map((c) => (
                <tr key={c.category} className="hover:bg-surface">
                  <td className="px-4 py-2.5">{c.category}</td>
                  <td className="px-4 py-2.5">{c.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
