import { useEffect, useState } from "react"
import { Bell, CheckCheck, Loader2, Clock } from "lucide-react"
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
    <div className="space-y-5">
      <div className="gov-card border-t-[4px] border-t-navy p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy flex items-center gap-2">
            <Bell className="h-5 w-5 text-navy" />
            <span>Notifications</span>
          </h1>
          <p className="mt-1 text-xs font-semibold text-[#64748B]">{unread} unread notifications</p>
        </div>
        {unread > 0 ? (
          <button className="gov-btn-outline gap-2 text-xs font-bold" onClick={handleMarkAll}>
            <CheckCheck className="h-4 w-4 text-navy" />
            Mark all as read
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="gov-card flex items-center justify-center gap-3 p-10 text-center text-[#64748B]">
          <Loader2 className="h-5 w-5 animate-spin text-navy" />
          <span className="font-semibold text-sm">Loading notifications…</span>
        </div>
      ) : items.length === 0 ? (
        <div className="gov-card p-10 text-center text-sm text-[#64748B]">No notifications yet.</div>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li
              key={n.id}
              className={`gov-card p-5 shadow-xs transition-all ${
                n.read
                  ? "border border-[#E2E8F0] bg-white"
                  : "border-l-[4px] border-l-[#E65100] border-t border-r border-b border-[#E2E8F0] bg-[#FFFBF7]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!n.read ? (
                    <span className="h-2 w-2 rounded-full bg-[#E65100]" aria-hidden="true" />
                  ) : null}
                  <h2 className="text-sm font-bold text-navy">{n.title}</h2>
                </div>
                <time className="flex items-center gap-1 text-[11px] font-semibold text-[#64748B]" dateTime={n.createdAt}>
                  <Clock className="h-3 w-3" />
                  {new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#334155]">{n.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

