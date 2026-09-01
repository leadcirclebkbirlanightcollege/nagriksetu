import type { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  accent?: "navy" | "saffron" | "green"
  icon?: ReactNode
}

const accents = {
  navy: "border-t-navy",
  saffron: "border-t-saffron",
  green: "border-t-india-green",
}

export default function StatCard({ label, value, hint, accent = "navy", icon }: StatCardProps) {
  return (
    <div className={`gov-card border-t-4 ${accents[accent]} p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-1 text-3xl font-bold text-navy">{value}</p>
        </div>
        {icon ? <span aria-hidden className="text-2xl text-muted">{icon}</span> : null}
      </div>
      {hint ? <p className="mt-2 text-xs text-muted">{hint}</p> : null}
    </div>
  )
}
