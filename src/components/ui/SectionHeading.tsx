interface Props {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function SectionHeading({ title, subtitle, action }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-[#D8DEE6] pb-3.5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl flex items-center gap-2.5">
          <span aria-hidden className="inline-block h-5 w-1.5 rounded-[2px] bg-[#E65100]" />
          {title}
        </h2>
        {subtitle ? <p className="mt-1 text-xs sm:text-sm text-[#475569]">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}

