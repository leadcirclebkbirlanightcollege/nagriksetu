import type { ComplaintStatus } from "../../types"

// Colour mapping for the 9-stage complaint lifecycle. A safe default keeps the
// badge rendering even for unexpected values.
const styles: Record<ComplaintStatus, string> = {
  Reported: "bg-surfaceAlt text-navy border-line",
  Verified: "bg-[#FFF3E0] text-[#8A5200] border-[#F3D19E]",
  Assigned: "bg-[#E7F0FA] text-navy border-[#B9D3EE]",
  "Officer Accepted": "bg-[#E7F0FA] text-navy border-[#B9D3EE]",
  "Work Started": "bg-[#FBEBDE] text-[#8A4B12] border-saffron",
  Inspection: "bg-[#FBEBDE] text-[#8A4B12] border-saffron",
  Resolved: "bg-[#E8F1EC] text-india-greenDark border-[#A9D3B9]",
  "Citizen Verified": "bg-[#E8F1EC] text-india-greenDark border-[#A9D3B9]",
  Closed: "bg-[#ECEEF1] text-muted border-line",
}

const FALLBACK = "bg-surfaceAlt text-navy border-line"

export default function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-gov border px-2.5 py-1 text-xs font-semibold ${styles[status] ?? FALLBACK}`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
