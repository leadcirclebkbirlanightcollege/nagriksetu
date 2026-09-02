import type { ReactNode } from "react"

interface Props {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export default function SectionHeading({ title, subtitle, action, className = "" }: Props) {
  return (
    <div
      className={`mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-lineSubtle pb-3.5 ${className}`}
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl flex items-center gap-2.5">
          <span aria-hidden="true" className="inline-block h-5 w-1.5 rounded-[2px] bg-saffron shrink-0" />
          <span>{title}</span>
        </h2>
        {subtitle ? <p className="mt-1 text-xs sm:text-sm text-ink-muted leading-relaxed">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
