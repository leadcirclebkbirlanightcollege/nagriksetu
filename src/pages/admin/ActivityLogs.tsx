import { useEffect, useState } from "react"
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Activity Logs &amp; Audit Trail</h1>
          <p className="text-sm text-muted">Complete audit trail of citizen submissions and administrative updates.</p>
        </div>
        <button className="gov-btn-outline text-sm" onClick={loadLogs}>
          🔄 Refresh
        </button>
      </div>

      {error ? (
        <p role="alert" className="rounded-gov border border-[#E56458] bg-[#FCE9E7] px-3 py-2 text-sm text-[#8A2A22]">
          {error}
        </p>
      ) : null}

      <div className="gov-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted">Loading audit records…</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-muted">No audit logs recorded yet.</div>
        ) : (
          <ol className="divide-y divide-line">
            {logs.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-surface">
                <time className="w-48 shrink-0 text-xs text-muted" dateTime={l.createdAt}>
                  {new Date(l.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </time>
                <span className="rounded bg-surfaceAlt px-2 py-0.5 text-xs font-semibold text-navy">
                  {l.actorName}
                </span>
                <span className="min-w-0 flex-1 text-sm text-ink">{l.action}</span>
                {l.entityId ? (
                  <span className="font-mono text-xs text-muted">[{l.entity}: {l.entityId}]</span>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
