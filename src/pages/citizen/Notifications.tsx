import { useEffect, useState } from "react"
import { apiGetNotifications, apiMarkAllNotificationsRead, type AppNotification } from "../../lib/api"

export default function Notifications() {
  const [items, setItems] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const list = await apiGetNotifications()
      setItems(list)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleMarkAll() {
    try {
      await apiMarkAllNotificationsRead()
      setItems((p) => p.map((n) => ({ ...n, read: true })))
    } catch (err) {
      console.warn("Failed to mark notifications read", err)
    }
  }

  const unread = items.filter((n) => !n.read).length

  return (
    <div className="space-y-4">
      <div className="gov-card flex items-center justify-between p-4">
        <div>
          <h1 className="text-xl font-bold text-navy">Notifications</h1>
          <p className="text-sm text-muted">{unread} unread notifications</p>
        </div>
        {unread > 0 ? (
          <button className="gov-btn-outline" onClick={handleMarkAll}>
            Mark all as read
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="gov-card p-8 text-center text-muted">Loading notifications…</div>
      ) : items.length === 0 ? (
        <div className="gov-card p-8 text-center text-muted">No notifications yet.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n.id} className={`gov-card p-4 ${n.read ? "" : "border-l-4 border-l-saffron"}`}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-navy">{n.title}</h2>
                <time className="shrink-0 text-xs text-muted" dateTime={n.createdAt}>
                  {new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </div>
              <p className="mt-1 text-sm text-ink/80">{n.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
