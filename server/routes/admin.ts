import { Router, Response } from "express"
import { db } from "../db"
import { requireRole, AuthenticatedRequest } from "../auth"

export const adminRouter = Router()

// Protect all admin routes for admin and super_admin
adminRouter.use(requireRole(["admin", "super_admin"]))

// List Users with live complaint count
adminRouter.get("/users", (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = db.getUsers()
    const complaints = db.getComplaints()

    const usersWithStats = users.map((u) => {
      const userComplaints = complaints.filter((c) => c.reporterId === u.id)
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        phone: u.phone,
        ward: u.ward,
        complaintsCount: userComplaints.length,
        createdAt: u.createdAt,
      }
    })

    return res.status(200).json(usersWithStats)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to fetch users" })
  }
})

// Update User (Role / Status)
adminRouter.patch("/users/:id", (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id
    const { role, status } = req.body

    const existing = db.getUserById(id)
    if (!existing) return res.status(404).json({ error: "User not found" })

    const patch: Record<string, unknown> = {}
    if (role) patch.role = role
    if (status) patch.status = status

    const updated = db.updateUser(id, patch)

    db.recordActivity({
      actorId: req.user?.userId,
      actorName: req.user?.name || "Admin",
      action: `Updated user ${existing.email} (Role: ${updated.role}, Status: ${updated.status})`,
      entity: "user",
      entityId: id,
    })

    return res.status(200).json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      status: updated.status,
    })
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to update user" })
  }
})

// Categories
adminRouter.get("/categories", (req, res) => {
  try {
    const categories = db.getCategories()
    return res.status(200).json(categories)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to fetch categories" })
  }
})

adminRouter.post("/categories", (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) return res.status(400).json({ error: "Category name is required" })

    const updated = db.addCategory(name.trim())

    db.recordActivity({
      actorId: req.user?.userId,
      actorName: req.user?.name || "Admin",
      action: `Added category "${name.trim()}"`,
      entity: "category",
      entityId: name.trim(),
    })

    return res.status(201).json(updated)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to add category" })
  }
})

adminRouter.delete("/categories/:name", (req: AuthenticatedRequest, res: Response) => {
  try {
    const name = decodeURIComponent(req.params.name)
    const updated = db.removeCategory(name)

    db.recordActivity({
      actorId: req.user?.userId,
      actorName: req.user?.name || "Admin",
      action: `Removed category "${name}"`,
      entity: "category",
      entityId: name,
    })

    return res.status(200).json(updated)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to delete category" })
  }
})

// Area Management with real live load
adminRouter.get("/areas", (req, res) => {
  try {
    const areas = db.getAreas()
    const complaints = db.getComplaints()

    const areaStats = areas.map((a) => {
      const matched = complaints.filter((c) => c.area.toLowerCase().includes(a.name.toLowerCase()) || c.ward === a.ward)
      const resolved = matched.filter((c) => c.status === "Resolved" || c.status === "Citizen Verified" || c.status === "Closed").length
      return {
        id: a.id,
        area: a.name,
        ward: a.ward,
        reported: matched.length,
        resolved: resolved,
        pending: matched.length - resolved,
        lat: a.lat,
        lng: a.lng,
      }
    })

    return res.status(200).json(areaStats)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to fetch area stats" })
  }
})

// Activity Audit Logs
adminRouter.get("/activity-logs", (req, res) => {
  try {
    const logs = db.getActivityLogs()
    return res.status(200).json(logs)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to fetch activity logs" })
  }
})

// Export CSV
adminRouter.get("/export", (req, res) => {
  try {
    const complaints = db.getComplaints()
    const header = "Complaint ID,Title,Category,Area,Ward,Priority,Status,Reported By,Contact,Reported Date,Resolved Date\n"
    const rows = complaints.map((c) => {
      const cleanTitle = `"${(c.title || "").replace(/"/g, '""')}"`
      const cleanDesc = `"${(c.area || "").replace(/"/g, '""')}"`
      return `${c.id},${cleanTitle},${c.category},${cleanDesc},${c.ward || ""},${c.priority},${c.status},${c.reporterName || "Anonymous"},${c.contactNumber || ""},${c.createdAt},${c.resolvedAt || ""}`
    }).join("\n")

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", 'attachment; filename="nagriksetu-complaints-export.csv"')
    return res.status(200).send(header + rows)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to export data" })
  }
})
