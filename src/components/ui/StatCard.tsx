import type { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  accent?: "navy" | "saffron" | "green"
  icon?: ReactNode
}

const accents = {
  navy: "border-t-[#0B3C6D] bg-gradient-to-b from-white to-[#F8FAFC]",
  saffron: "border-t-[#E65100] bg-gradient-to-b from-white to-[#FDF8F3]",
  green: "border-t-[#138808] bg-gradient-to-b from-white to-[#F4F9F4]",
}

export default function StatCard({ label, value, hint, accent = "navy", icon }: StatCardProps) {
  return (
    <div className={`gov-card border-t-[3px] ${accents[accent]} p-5 transition-shadow hover:shadow-[0_4px_12px_rgba(11,60,109,0.08)]`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-[#475569]">{label}</p>
          <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">{value}</p>
        </div>
        {icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-gov border border-[#E2E8F0] bg-white text-navy shadow-sm" aria-hidden>
            {icon}
          </div>
        ) : null}
      </div>
      {hint ? <p className="mt-2 text-xs text-[#64748B]">{hint}</p> : null}
    </div>
  )
}

