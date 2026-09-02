import type { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  accent?: "navy" | "saffron" | "green"
  icon?: ReactNode
}

const accents = {
  navy: "border-t-navy bg-gradient-to-b from-white to-surface",
  saffron: "border-t-saffron bg-gradient-to-b from-white to-[#FFFBF7]",
  green: "border-t-govGreen bg-gradient-to-b from-white to-[#F4FAF4]",
}

export default function StatCard({ label, value, hint, accent = "navy", icon }: StatCardProps) {
  return (
    <div className={`gov-card border-t-4 ${accents[accent]} p-5 transition-all duration-150 hover:shadow-cardHover`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">{label}</p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-navy">{value}</p>
        </div>
        {icon ? (
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-gov border border-lineSubtle bg-white text-navy shadow-xs"
            aria-hidden="true"
          >
            {icon}
          </div>
        ) : null}
      </div>
      {hint ? <p className="mt-2 text-xs text-ink-light">{hint}</p> : null}
    </div>
  )
}
