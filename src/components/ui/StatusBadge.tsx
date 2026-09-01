import type { ComplaintStatus } from "../../types"

// Colour mapping for the 9-stage complaint lifecycle with formal institutional contrast
const styles: Record<ComplaintStatus, { badge: string; dot: string }> = {
  Reported: {
    badge: "bg-[#F1F5F9] text-[#1E293B] border-[#CBD5E1]",
    dot: "bg-[#64748B]",
  },
  Verified: {
    badge: "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]",
    dot: "bg-[#3B82F6]",
  },
  Assigned: {
    badge: "bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]",
    dot: "bg-[#0284C7]",
  },
  "Officer Accepted": {
    badge: "bg-[#EEF2FF] text-[#3730A3] border-[#C7D2FE]",
    dot: "bg-[#6366F1]",
  },
  "Work Started": {
    badge: "bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]",
    dot: "bg-[#F97316]",
  },
  Inspection: {
    badge: "bg-[#FEFCE8] text-[#854D0E] border-[#FEF08A]",
    dot: "bg-[#EAB308]",
  },
  Resolved: {
    badge: "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]",
    dot: "bg-[#16A34A]",
  },
  "Citizen Verified": {
    badge: "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]",
    dot: "bg-[#059669]",
  },
  Closed: {
    badge: "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]",
    dot: "bg-[#94A3B8]",
  },
}

const FALLBACK = {
  badge: "bg-[#F1F5F9] text-[#1E293B] border-[#CBD5E1]",
  dot: "bg-[#64748B]",
}

export default function StatusBadge({ status }: { status: ComplaintStatus }) {
  const current = styles[status] ?? FALLBACK
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${current.badge}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {status}
    </span>
  )
}

