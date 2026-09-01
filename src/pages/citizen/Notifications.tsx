import { useState } from "react"
import { mockNotifications } from "../../data/mockData"

export default function Notifications() {
  const [items, setItems] = useState(mockNotifications)
  const unread = items.filter((n) => !n.read).length

  return (
    <div className="space-y-4">
      <div className="gov-card flex items-center justify-between p-4">
        <div>
          <h1 className="text-xl font-bold text-navy">Notifications</h1>
          <p className="text-sm text-muted">{unread} unread</p>
        </div>
        <button className="gov-btn-outline" onClick={() => setItems((p) => p.map((n) => ({ ...n, read: true })))}>
          Mark all as read
        </button>
      </div>
      <ul className="space-y-2">
        {items.map((n) => (
          <li key={n.id} className={`gov-card p-4 ${n.read ? "" : "border-l-4 border-l-saffron"}`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-navy">{n.title}</h2>
              <time className="shrink-0 text-xs text-muted" dateTime={n.at}>
                {new Date(n.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </time>
            </div>
            <p className="mt-1 text-sm text-ink/80">{n.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
