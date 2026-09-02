import { useEffect, useState } from "react"
import { History, RotateCw, Loader2, AlertCircle, Clock } from "lucide-react"
import Breadcrumb from "../../components/ui/Breadcrumb"
import { apiGetAdminActivityLogs, type ActivityLog } from "../../lib/api"

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadLogs() {
    setLoading(true)
    try {
      const data = await apiGetAdminActivityLogs()
      setLogs(data)
    } catch (err) {
      setError((err as Error).message || "Failed to load activity logs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [])

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Administration", to: "/admin" }, { label: "Activity Logs" }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lineSubtle pb-4">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <History className="h-6 w-6 text-navy" aria-hidden="true" />
            <span>Activity Logs &amp; Audit Trail</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted">
            Complete audit trail of citizen submissions and administrative milestone changes.
          </p>
        </div>
        <button
          type="button"
          className="gov-btn-outline gap-2 text-xs font-bold shadow-xs"
          onClick={loadLogs}
          disabled={loading}
        >
          <RotateCw className={`h-3.5 w-3.5 text-navy ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
          <span>Refresh</span>
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-gov border border-govRed-border bg-govRed-tint p-3.5 text-xs font-bold text-govRed-dark"
        >
          <AlertCircle className="h-4 w-4 text-govRed shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="gov-card overflow-hidden border border-line shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-center text-ink-muted">
            <Loader2 className="h-5 w-5 animate-spin text-navy" aria-hidden="true" />
            <span className="font-semibold text-sm">Loading audit records…</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink-muted">No audit logs recorded yet.</div>
        ) : (
          <ol className="divide-y divide-lineSubtle" aria-label="Administrative activity audit log">
            {logs.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 hover:bg-surface transition-colors">
                <time className="flex items-center gap-1.5 w-48 shrink-0 text-xs font-medium text-ink-muted" dateTime={l.createdAt}>
                  <Clock className="h-3.5 w-3.5 text-ink-light" aria-hidden="true" />
                  <span>{new Date(l.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                </time>
                <span className="rounded-gov border border-line bg-surfaceAlt px-2.5 py-0.5 text-xs font-bold text-navy">
                  {l.actorName}
                </span>
                <span className="min-w-0 flex-1 text-xs sm:text-sm font-medium text-ink">{l.action}</span>
                {l.entityId ? (
                  <span className="font-mono text-xs font-semibold text-ink-muted">[{l.entity}: {l.entityId}]</span>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
