import { notificationsRepository } from "../repositories/notifications.repository"
import type { UserRole } from "../types"

export const notificationService = {
  list: (userId: string, role: UserRole) => notificationsRepository.listFor(userId, role),
  markRead: (id: string) => notificationsRepository.markRead(id),
  markAllRead: (userId: string) => notificationsRepository.markAllRead(userId),
}
