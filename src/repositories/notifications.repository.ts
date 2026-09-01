import { BaseRepository, unwrap } from "./base.repository"
import { toNotification } from "../lib/mappers"
import type { Notification, UserRole } from "../types"
import type { NotificationRow } from "../types/db"

class NotificationsRepository extends BaseRepository {
  /** Notifications for a user OR their role target. */
  async listFor(userId: string, role: UserRole): Promise<Notification[]> {
    const rows = unwrap(
      await this.db
        .from("notifications")
        .select("*")
        .or("user_id.eq." + userId + ",role_target.eq." + role)
        .order("created_at", { ascending: false })
        .limit(100),
    )
    return rows.map(toNotification)
  }

  async markRead(id: string): Promise<void> {
    unwrap(await this.db.from("notifications").update({ read: true }).eq("id", id).select("id"))
  }

  async markAllRead(userId: string): Promise<void> {
    unwrap(
      await this.db.from("notifications").update({ read: true }).eq("user_id", userId).select("id"),
    )
  }

  async create(entry: Partial<NotificationRow> & { title: string }): Promise<void> {
    unwrap(await this.db.from("notifications").insert(entry).select("id"))
  }
}

export const notificationsRepository = new NotificationsRepository()
