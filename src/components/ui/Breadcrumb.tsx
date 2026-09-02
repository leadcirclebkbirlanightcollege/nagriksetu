import { Link } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`mb-4 ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-semibold text-navy hover:text-saffron transition-colors"
          >
            <Home className="h-3.5 w-3.5 text-navy" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.label + index} className="inline-flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-line shrink-0" aria-hidden="true" />
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="font-semibold text-navy hover:text-saffron transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="font-bold text-ink"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
