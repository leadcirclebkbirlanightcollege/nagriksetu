import { useEffect, useState } from "react"
import { History, RotateCw, Loader2, AlertCircle, Clock } from "lucide-react"
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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <History className="h-6 w-6 text-navy" />
            <span>Activity Logs &amp; Audit Trail</span>
          </h1>
          <p className="mt-1 text-xs text-[#64748B]">Complete audit trail of citizen submissions and administrative updates.</p>
        </div>
        <button className="gov-btn-outline gap-2 text-xs font-bold" onClick={loadLogs}>
          <RotateCw className="h-3.5 w-3.5" />
          🔄 Refresh
        </button>
      </div>

      {error ? (
        <div role="alert" className="flex items-center gap-2.5 rounded-gov border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-xs font-bold text-[#991B1B]">
          <AlertCircle className="h-4 w-4 text-[#DC2626] shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="gov-card overflow-hidden border border-[#D8DEE6] shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-center text-[#64748B]">
            <Loader2 className="h-5 w-5 animate-spin text-navy" />
            <span className="font-semibold text-sm">Loading audit records…</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#64748B]">No audit logs recorded yet.</div>
        ) : (
          <ol className="divide-y divide-[#E2E8F0]">
            {logs.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors">
                <time className="flex items-center gap-1.5 w-48 shrink-0 text-xs font-medium text-[#64748B]" dateTime={l.createdAt}>
                  <Clock className="h-3.5 w-3.5 text-[#64748B]" />
                  {new Date(l.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </time>
                <span className="rounded border border-[#CBD5E1] bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-bold text-navy">
                  {l.actorName}
                </span>
                <span className="min-w-0 flex-1 text-xs font-medium text-[#1E293B]">{l.action}</span>
                {l.entityId ? (
                  <span className="font-mono text-xs font-semibold text-[#64748B]">[{l.entity}: {l.entityId}]</span>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

