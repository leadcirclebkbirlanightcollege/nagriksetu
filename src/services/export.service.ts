// Report generation: CSV, Excel (xlsx), PDF (jsPDF), and print.
import Papa from "papaparse"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

type Row = Record<string, string | number | boolean | null | undefined>

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const exportService = {
  toCSV(rows: Row[], filename = "nagriksetu-report.csv"): void {
    const csv = Papa.unparse(rows)
    download(new Blob([csv], { type: "text/csv;charset=utf-8;" }), filename)
  },

  toExcel(rows: Row[], filename = "nagriksetu-report.xlsx", sheet = "Report"): void {
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheet)
    XLSX.writeFile(wb, filename)
  },

  toPDF(
    rows: Row[],
    opts: { title?: string; filename?: string } = {},
  ): void {
    const doc = new jsPDF({ orientation: "landscape" })
    const title = opts.title ?? "NagrikSetu Report"
    doc.setFontSize(14)
    doc.text(title, 14, 16)
    doc.setFontSize(9)
    doc.text(new Date().toLocaleString(), 14, 22)
    const columns = rows.length ? Object.keys(rows[0]) : []
    const body = rows.map((r) => columns.map((c) => String(r[c] ?? "")))
    autoTable(doc, {
      head: [columns],
      body,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [11, 60, 109] },
    })
    doc.save(opts.filename ?? "nagriksetu-report.pdf")
  },

  print(): void {
    window.print()
  },
}
