import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  pageSize?: number
  className?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null

  const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null
  const endItem = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : null

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-between gap-3 border-t border-lineSubtle bg-surfaceAlt px-4 py-3 text-xs ${className}`}
    >
      <div className="text-ink-muted">
        {startItem && endItem && totalItems ? (
          <span>
            Showing <strong className="text-ink font-semibold">{startItem}</strong> to{" "}
            <strong className="text-ink font-semibold">{endItem}</strong> of{" "}
            <strong className="text-ink font-semibold">{totalItems}</strong> records
          </span>
        ) : (
          <span>
            Page <strong className="text-ink font-semibold">{currentPage}</strong> of{" "}
            <strong className="text-ink font-semibold">{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 rounded-gov border border-line bg-white px-2.5 py-1 font-semibold text-navy shadow-xs hover:bg-surfaceAlt disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Prev</span>
        </button>

        <span className="px-2 text-ink-muted font-medium">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 rounded-gov border border-line bg-white px-2.5 py-1 font-semibold text-navy shadow-xs hover:bg-surfaceAlt disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
