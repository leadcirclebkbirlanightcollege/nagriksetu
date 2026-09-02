import type { ReactNode } from "react"
import { Inbox, type LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`gov-card flex flex-col items-center justify-center p-8 sm:p-12 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surfaceAlt text-navy shadow-xs mb-3.5">
        <Icon className="h-6 w-6 text-navy" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-navy">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-md text-xs sm:text-sm text-ink-muted leading-relaxed">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
