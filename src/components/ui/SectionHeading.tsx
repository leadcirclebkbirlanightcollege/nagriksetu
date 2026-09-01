interface Props {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function SectionHeading({ title, subtitle, action }: Props) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
      <div>
        <h2 className="section-title flex items-center gap-2">
          <span aria-hidden className="inline-block h-5 w-1.5 rounded bg-saffron" />
          {title}
        </h2>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}
