const logs = [
  { at: "2026-07-19T11:00:00Z", actor: "Sanitation Dept.", action: "Updated NS-2026-000412 to In Progress" },
  { at: "2026-07-19T09:00:00Z", actor: "Control Room", action: "Reviewed NS-2026-000355" },
  { at: "2026-07-16T08:30:00Z", actor: "Control Room", action: "Assigned NS-2026-000412 to Sanitation Dept." },
  { at: "2026-07-10T14:00:00Z", actor: "Electrical Dept.", action: "Resolved NS-2026-000388" },
  { at: "2026-07-05T10:15:00Z", actor: "Admin", action: "Published new waste segregation guidelines" },
]

export default function ActivityLogs() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Activity Logs</h1>
        <p className="text-sm text-muted">Audit trail of administrative actions.</p>
      </div>
      <ol className="gov-card divide-y divide-line">
        {logs.map((l, i) => (
          <li key={i} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <time className="w-40 shrink-0 text-xs text-muted" dateTime={l.at}>
              {new Date(l.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </time>
            <span className="rounded bg-surfaceAlt px-2 py-0.5 text-xs font-semibold text-navy">{l.actor}</span>
            <span className="min-w-0 flex-1 text-sm text-ink">{l.action}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
