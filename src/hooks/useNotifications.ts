import { useCallback, useEffect, useRef, useState } from "react"
import { notificationService } from "../services/notification.service"
import { supabase, hasSupabase } from "../lib/supabase"
import { toNotification } from "../lib/mappers"
import type { Notification, UserRole } from "../types"
import type { NotificationRow } from "../types/db"
import { mockNotifications } from "../data/mockData"

/**
 * Live notifications for the signed-in user, subscribed via Supabase Realtime.
 * Falls back to bundled demo notifications when the backend is not configured.
 */
export function useNotifications(userId: string | undefined, role: UserRole | undefined) {
  const [items, setItems] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const seen = useRef<Set<string>>(new Set())

  const load = useCallback(async () => {
    if (!hasSupabase || !userId || !role) {
      setItems(mockNotifications)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const list = await notificationService.list(userId, role)
      seen.current = new Set(list.map((n) => n.id))
      setItems(list)
    } finally {
      setLoading(false)
    }
  }, [userId, role])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!hasSupabase || !supabase || !userId || !role) return
    const channel = supabase
      .channel("notifications:" + userId)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const row = payload.new as NotificationRow
          const mine = row.user_id === userId || row.role_target === role
          if (!mine || seen.current.has(row.id)) return
          seen.current.add(row.id)
          setItems((prev) => [toNotification(row), ...prev])
        },
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [userId, role])

  const markRead = useCallback(
    async (id: string) => {
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      if (hasSupabase) await notificationService.markRead(id)
    },
    [],
  )

  const markAllRead = useCallback(async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
    if (hasSupabase && userId) await notificationService.markAllRead(userId)
  }, [userId])

  const unread = items.filter((n) => !n.read).length
  return { items, unread, loading, markRead, markAllRead, reload: load }
}
