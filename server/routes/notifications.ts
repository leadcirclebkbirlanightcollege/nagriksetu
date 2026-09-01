import { Router, Response } from "express"
import { db } from "../db"
import { requireAuth, AuthenticatedRequest } from "../auth"

export const notificationsRouter = Router()

// Get user notifications
notificationsRouter.get("/", requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })
    const list = db.getNotifications(req.user.userId, req.user.role)
    return res.status(200).json(list)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to fetch notifications" })
  }
})

// Mark single notification as read
notificationsRouter.patch("/:id/read", requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id
    db.markNotificationRead(id)
    return res.status(200).json({ message: "Notification marked as read" })
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to update notification" })
  }
})

// Mark all as read
notificationsRouter.patch("/read-all", requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })
    db.markAllNotificationsRead(req.user.userId)
    return res.status(200).json({ message: "All notifications marked as read" })
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to update notifications" })
  }
})
