import { useEffect, useState } from "react"
import { Bell, CheckCheck, Loader2, Clock } from "lucide-react"
import Breadcrumb from "../../components/ui/Breadcrumb"
import EmptyState from "../../components/ui/EmptyState"
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
      <Breadcrumb items={[{ label: "Citizen Portal", to: "/citizen" }, { label: "Notifications" }]} />

      <div className="gov-card border-t-4 border-t-navy p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
            <Bell className="h-6 w-6 text-navy" aria-hidden="true" />
            <span>Official Notifications</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted">
            {unread > 0 ? `${unread} unread updates regarding your grievances` : "All notifications are caught up"}
          </p>
        </div>
        {unread > 0 ? (
          <button
            type="button"
            className="gov-btn-outline gap-2 text-xs font-bold shadow-xs"
            onClick={handleMarkAll}
          >
            <CheckCheck className="h-4 w-4 text-navy" aria-hidden="true" />
            <span>Mark all as read</span>
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="gov-card flex items-center justify-center gap-3 p-12 text-center text-ink-muted shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-navy" aria-hidden="true" />
          <span className="font-semibold text-sm">Loading notification feed…</span>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications received yet"
          description="You will receive alerts here whenever a municipal officer updates your complaint status or schedules inspection work."
        />
      ) : (
        <ul className="space-y-3" aria-label="Notifications list">
          {items.map((n) => (
            <li
              key={n.id}
              className={`gov-card p-5 shadow-xs transition-all ${
                n.read
                  ? "border border-line bg-white"
                  : "border-l-4 border-l-saffron border-t border-r border-b border-line bg-[#FFFBF7]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!n.read ? (
                    <span className="h-2 w-2 rounded-full bg-saffron" aria-hidden="true" />
                  ) : null}
                  <h2 className="text-sm font-bold text-navy">{n.title}</h2>
                </div>
                <time className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-muted" dateTime={n.createdAt}>
                  <Clock className="h-3 w-3 text-ink-light" aria-hidden="true" />
                  <span>{new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                </time>
              </div>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink">{n.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
