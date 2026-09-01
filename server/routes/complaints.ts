import { Router, Response } from "express"
import { db, ComplaintRecord } from "../db"
import { requireAuth, optionalAuth, requireRole, AuthenticatedRequest } from "../auth"

export const complaintsRouter = Router()

// Auto-routing helper: map category to municipal department
function findDepartmentForCategory(category: string) {
  const departments = db.getDepartments()
  for (const dept of departments) {
    if (dept.categories.some((c) => c.toLowerCase() === category.toLowerCase())) {
      return dept
    }
  }
  return departments[0] || null
}

// List complaints with real filtering and search
complaintsRouter.get("/", optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    let list = db.getComplaints()

    const {
      status,
      category,
      area,
      ward,
      priority,
      departmentId,
      officerId,
      reporterId,
      archived,
      search,
      fromDate,
      toDate,
    } = req.query

    // Filter by archived status
    if (archived === "true") {
      list = list.filter((c) => c.archived === true)
    } else if (archived === "false" || archived === undefined) {
      list = list.filter((c) => c.archived === false)
    }

    if (status && status !== "All") {
      list = list.filter((c) => c.status === status)
    }

    if (category && category !== "All") {
      list = list.filter((c) => c.category.toLowerCase() === (category as string).toLowerCase())
    }

    if (area) {
      list = list.filter((c) => c.area.toLowerCase().includes((area as string).toLowerCase()))
    }

    if (ward) {
      list = list.filter((c) => c.ward?.toLowerCase().includes((ward as string).toLowerCase()))
    }

    if (priority) {
      list = list.filter((c) => c.priority === priority)
    }

    if (departmentId) {
      list = list.filter((c) => c.departmentId === departmentId)
    }

    if (officerId) {
      list = list.filter((c) => c.officerId === officerId)
    }

    if (reporterId) {
      list = list.filter((c) => c.reporterId === reporterId)
    }

    if (fromDate) {
      list = list.filter((c) => new Date(c.createdAt) >= new Date(fromDate as string))
    }

    if (toDate) {
      list = list.filter((c) => new Date(c.createdAt) <= new Date(toDate as string))
    }

    if (search) {
      const q = (search as string).toLowerCase().trim()
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.area.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (c.contactNumber && c.contactNumber.includes(q))
      )
    }

    return res.status(200).json(list)
  } catch (error) {
    console.error("List complaints error:", error)
    return res.status(500).json({ error: (error as Error).message || "Failed to fetch complaints" })
  }
})

// Public tracking lookup
complaintsRouter.get("/track/:query", (req, res) => {
  try {
    const q = req.params.query.trim()
    if (!q) return res.status(400).json({ error: "Tracking query is required" })

    // Check if query is 10-digit mobile number
    if (/^[0-9]{10}$/.test(q)) {
      const results = db.findComplaintsByContact(q)
      return res.status(200).json(results)
    }

    // Otherwise look up by public ID (e.g. "NS-2026-000412") or UUID
    const single = db.getComplaintByPublicId(q) || db.getComplaintByUuid(q)
    if (single) {
      return res.status(200).json([single])
    }

    return res.status(200).json([])
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to track complaint" })
  }
})

// Get single complaint details
complaintsRouter.get("/:id", (req, res) => {
  try {
    const id = req.params.id
    const complaint = db.getComplaintByPublicId(id) || db.getComplaintByUuid(id)
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" })
    }
    return res.status(200).json(complaint)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to fetch complaint" })
  }
})

// Create a new complaint
complaintsRouter.post("/", optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      category,
      description,
      area,
      ward,
      landmark,
      lat,
      lng,
      imageUrls = [],
      contactNumber,
      priority = "Medium",
      anonymous = false,
    } = req.body

    if (!title || title.trim().length < 5) {
      return res.status(400).json({ error: "Please enter a descriptive title (min 5 characters)" })
    }

    if (!category) {
      return res.status(400).json({ error: "Please select a category" })
    }

    if (!description || description.trim().length < 15) {
      return res.status(400).json({ error: "Please describe the issue (min 15 characters)" })
    }

    if (!area || area.trim().length < 2) {
      return res.status(400).json({ error: "Please enter the area or ward" })
    }

    const dept = findDepartmentForCategory(category)

    const reporterId = anonymous ? null : (req.user ? req.user.userId : null)
    const reporterName = anonymous ? "Anonymous Citizen" : (req.user ? req.user.name : "Citizen")

    const now = new Date().toISOString()
    const timelineEntry = {
      status: "Reported",
      at: now,
      actor: reporterName,
      note: "Complaint submitted via NagrikSetu portal",
    }

    const complaint = db.createComplaint({
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      area: area.trim(),
      ward: ward ? ward.trim() : undefined,
      landmark: landmark ? landmark.trim() : undefined,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
      contactNumber: contactNumber ? contactNumber.trim() : undefined,
      priority,
      anonymous: !!anonymous,
      archived: false,
      status: "Reported",
      reporterId,
      reporterName: anonymous ? null : reporterName,
      departmentId: dept?.id || null,
      departmentName: dept?.name || null,
      timeline: [timelineEntry],
    })

    // Record system notification for citizen
    if (reporterId) {
      db.createNotification({
        userId: reporterId,
        title: `Complaint Submitted: ${complaint.id}`,
        body: `Your complaint regarding "${complaint.title}" has been registered and auto-routed to ${dept?.name || "Municipal Department"}.`,
        type: "complaint_created",
        complaintId: complaint.uuid,
      })
    }

    // Record admin notification
    db.createNotification({
      roleTarget: "admin",
      title: `New Issue Reported: ${complaint.id}`,
      body: `[${complaint.category} - ${complaint.area}] ${complaint.title}`,
      type: "admin_alert",
      complaintId: complaint.uuid,
    })

    // Record audit activity log
    db.recordActivity({
      actorId: reporterId,
      actorName: reporterName,
      action: `Submitted complaint ${complaint.id}`,
      entity: "complaint",
      entityId: complaint.id,
      meta: { category: complaint.category, area: complaint.area },
    })

    return res.status(201).json(complaint)
  } catch (error) {
    console.error("Create complaint error:", error)
    return res.status(500).json({ error: (error as Error).message || "Failed to submit complaint" })
  }
})

// Advance / Update Status
complaintsRouter.patch("/:id/status", requireRole(["admin", "super_admin", "officer"]), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id
    const { status, remarks, assignedTo, officerId } = req.body

    const existing = db.getComplaintByPublicId(id) || db.getComplaintByUuid(id)
    if (!existing) return res.status(404).json({ error: "Complaint not found" })

    const now = new Date().toISOString()
    const actorName = req.user?.name || "Municipal Administrator"

    const newTimelineEntry = {
      status,
      at: now,
      actor: actorName,
      note: remarks || undefined,
    }

    const patch: Partial<ComplaintRecord> = {
      status,
      timeline: [...existing.timeline, newTimelineEntry],
    }

    if (assignedTo) patch.assignedTo = assignedTo
    if (officerId) patch.officerId = officerId

    if (status === "Resolved" || status === "Closed") {
      patch.resolvedAt = now
    }

    const updated = db.updateComplaint(existing.uuid, patch)

    // Notify citizen if registered
    if (existing.reporterId) {
      db.createNotification({
        userId: existing.reporterId,
        title: `Complaint ${existing.id} Updated`,
        body: `Status changed to "${status}". ${remarks ? "Remarks: " + remarks : ""}`,
        type: "status_update",
        complaintId: existing.uuid,
      })
    }

    db.recordActivity({
      actorId: req.user?.userId,
      actorName,
      action: `Updated ${existing.id} status to ${status}`,
      entity: "complaint",
      entityId: existing.id,
      meta: { status, remarks },
    })

    return res.status(200).json(updated)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to update status" })
  }
})

// Assign officer or department
complaintsRouter.patch("/:id/assign", requireRole(["admin", "super_admin"]), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id
    const { assignedTo, officerId, departmentId, departmentName, note } = req.body

    const existing = db.getComplaintByPublicId(id) || db.getComplaintByUuid(id)
    if (!existing) return res.status(404).json({ error: "Complaint not found" })

    const now = new Date().toISOString()
    const actorName = req.user?.name || "Admin"

    const newTimelineEntry = {
      status: existing.status === "Reported" ? "Assigned" : existing.status,
      at: now,
      actor: actorName,
      note: note || `Assigned to ${assignedTo || departmentName || "Officer"}`,
    }

    const updated = db.updateComplaint(existing.uuid, {
      assignedTo: assignedTo || existing.assignedTo,
      officerId: officerId || existing.officerId,
      departmentId: departmentId || existing.departmentId,
      departmentName: departmentName || existing.departmentName,
      status: existing.status === "Reported" ? "Assigned" : existing.status,
      timeline: [...existing.timeline, newTimelineEntry],
    })

    if (existing.reporterId) {
      db.createNotification({
        userId: existing.reporterId,
        title: `Complaint ${existing.id} Assigned`,
        body: `Assigned to ${assignedTo || departmentName || "department officer"} for field inspection.`,
        type: "assignment",
        complaintId: existing.uuid,
      })
    }

    db.recordActivity({
      actorId: req.user?.userId,
      actorName,
      action: `Assigned ${existing.id} to ${assignedTo || departmentName}`,
      entity: "complaint",
      entityId: existing.id,
    })

    return res.status(200).json(updated)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to assign complaint" })
  }
})

// Update Priority
complaintsRouter.patch("/:id/priority", requireRole(["admin", "super_admin", "officer"]), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id
    const { priority } = req.body

    const existing = db.getComplaintByPublicId(id) || db.getComplaintByUuid(id)
    if (!existing) return res.status(404).json({ error: "Complaint not found" })

    const updated = db.updateComplaint(existing.uuid, { priority })

    db.recordActivity({
      actorId: req.user?.userId,
      actorName: req.user?.name || "Officer",
      action: `Changed priority of ${existing.id} to ${priority}`,
      entity: "complaint",
      entityId: existing.id,
    })

    return res.status(200).json(updated)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to update priority" })
  }
})

// Delete / Archive complaint
complaintsRouter.delete("/:id", requireRole(["admin", "super_admin"]), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id
    const existing = db.getComplaintByPublicId(id) || db.getComplaintByUuid(id)
    if (!existing) return res.status(404).json({ error: "Complaint not found" })

    db.deleteComplaint(existing.uuid)

    db.recordActivity({
      actorId: req.user?.userId,
      actorName: req.user?.name || "Admin",
      action: `Deleted complaint ${existing.id}`,
      entity: "complaint",
      entityId: existing.id,
    })

    return res.status(200).json({ message: "Complaint removed successfully" })
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to delete complaint" })
  }
})
