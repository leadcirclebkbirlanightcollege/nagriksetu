import {
  FileText,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  Wrench,
  Search,
  CheckCheck,
  Award,
  Archive,
  type LucideIcon,
} from "lucide-react"
import type { ComplaintStatus } from "../../types"

interface StatusConfig {
  badge: string
  icon: LucideIcon
  iconColor: string
}

// 9-stage complaint lifecycle with official icons and high accessible contrast
const statusConfigs: Record<ComplaintStatus, StatusConfig> = {
  Reported: {
    badge: "bg-[#F1F5F9] text-[#1E293B] border-[#CBD5E1]",
    icon: FileText,
    iconColor: "text-[#475569]",
  },
  Verified: {
    badge: "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]",
    icon: CheckCircle2,
    iconColor: "text-[#2563EB]",
  },
  Assigned: {
    badge: "bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]",
    icon: UserCheck,
    iconColor: "text-[#0284C7]",
  },
  "Officer Accepted": {
    badge: "bg-[#EEF2FF] text-[#3730A3] border-[#C7D2FE]",
    icon: ShieldCheck,
    iconColor: "text-[#4F46E5]",
  },
  "Work Started": {
    badge: "bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]",
    icon: Wrench,
    iconColor: "text-[#EA580C]",
  },
  Inspection: {
    badge: "bg-[#FEFCE8] text-[#854D0E] border-[#FEF08A]",
    icon: Search,
    iconColor: "text-[#CA8A04]",
  },
  Resolved: {
    badge: "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]",
    icon: CheckCheck,
    iconColor: "text-[#16A34A]",
  },
  "Citizen Verified": {
    badge: "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]",
    icon: Award,
    iconColor: "text-[#059669]",
  },
  Closed: {
    badge: "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]",
    icon: Archive,
    iconColor: "text-[#64748B]",
  },
}

const FALLBACK: StatusConfig = {
  badge: "bg-[#F1F5F9] text-[#1E293B] border-[#CBD5E1]",
  icon: FileText,
  iconColor: "text-[#475569]",
}

export default function StatusBadge({
  status,
  size = "md",
}: {
  status: ComplaintStatus
  size?: "sm" | "md"
}) {
  const config = statusConfigs[status] ?? FALLBACK
  const Icon = config.icon

  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
  const iconSizeClass = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-gov border font-semibold tracking-wide shadow-xs ${sizeClass} ${config.badge}`}
    >
      <Icon className={`${iconSizeClass} shrink-0 ${config.iconColor}`} aria-hidden="true" />
      <span>{status}</span>
    </span>
  )
}
