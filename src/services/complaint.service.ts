// Complaint orchestration: creation (with images + routing), status workflow.
import { complaintsRepository, type ComplaintFilters } from "../repositories/complaints.repository"
import { activityRepository } from "../repositories/activity.repository"
import { notificationsRepository } from "../repositories/notifications.repository"
import { storageService } from "./storage.service"
import { sanitizeText } from "../lib/validation"
import type { Complaint, ComplaintPriority, ComplaintStatus } from "../types"
import type { ComplaintInput } from "../lib/validation"

export interface CreateComplaintArgs extends ComplaintInput {
  images?: File[]
  reporterId?: string | null
  areaId?: string | null
  wardId?: string | null
}

export const complaintService = {
  list: (filters?: ComplaintFilters) => complaintsRepository.list(filters),
  getByPublicId: (id: string) => complaintsRepository.getByPublicId(id),
  findByContact: (mobile: string) => complaintsRepository.findByContact(mobile),

  /** Search by complaint id OR registered mobile number. */
  async track(query: string): Promise<Complaint[]> {
    const q = query.trim()
    if (!q) return []
    if (/^[0-9]{10}$/.test(q)) return complaintsRepository.findByContact(q)
    const byId = await complaintsRepository.getByPublicId(q.toUpperCase())
    return byId ? [byId] : []
  },

  /** Create a complaint; department routing + public id happen server-side. */
  async create(args: CreateComplaintArgs): Promise<Complaint> {
    const row = await complaintsRepository.create({
      title: sanitizeText(args.title),
      category: args.category,
      description: sanitizeText(args.description),
      area: sanitizeText(args.area),
      area_id: args.areaId ?? null,
      ward_id: args.wardId ?? null,
      landmark: args.landmark ? sanitizeText(args.landmark) : null,
      lat: args.lat ?? null,
      lng: args.lng ?? null,
      contact_number: args.contactNumber || null,
      priority: args.priority as ComplaintPriority,
      anonymous: args.anonymous,
      reporter_id: args.anonymous ? null : args.reporterId ?? null,
      status: "Reported",
    })

    if (args.images && args.images.length) {
      const uploaded = await storageService.uploadMany(row.id, args.images)
      for (const img of uploaded) {
        await complaintsRepository.addImage({
          complaint_id: row.id,
          storage_path: img.path,
          public_url: img.url,
        })
      }
    }

    await activityRepository.record({
      actor_id: args.reporterId ?? null,
      action: "complaint.created",
      entity: "complaint",
      entity_id: row.public_id ?? row.id,
    })

    const full = await complaintsRepository.getById(row.id)
    if (!full) throw new Error("Complaint created but could not be reloaded.")
    return full
  },

  /** Move a complaint to a new status, log history + notify (server triggers also fire). */
  async advanceStatus(
    complaint: Complaint,
    status: ComplaintStatus,
    opts: { remarks?: string; officerId?: string | null; actorName?: string } = {},
  ): Promise<void> {
    await complaintsRepository.update(complaint.uuid, { status })
    await complaintsRepository.addHistory({
      complaint_id: complaint.uuid,
      status,
      remarks: opts.remarks ? sanitizeText(opts.remarks) : null,
      officer_id: opts.officerId ?? null,
      actor_name: opts.actorName ?? null,
    })
    await activityRepository.record({
      action: "complaint.status." + status,
      entity: "complaint",
      entity_id: complaint.id,
      actor_name: opts.actorName ?? null,
    })
  },

  async assignOfficer(
    complaint: Complaint,
    officerId: string,
    officerName: string,
  ): Promise<void> {
    await complaintsRepository.update(complaint.uuid, {
      officer_id: officerId,
      status: "Assigned",
    })
    await complaintsRepository.addHistory({
      complaint_id: complaint.uuid,
      status: "Assigned",
      remarks: "Assigned to " + officerName,
      officer_id: officerId,
      actor_name: officerName,
    })
  },

  async changePriority(complaint: Complaint, priority: ComplaintPriority): Promise<void> {
    await complaintsRepository.update(complaint.uuid, { priority })
    await activityRepository.record({
      action: "complaint.priority." + priority,
      entity: "complaint",
      entity_id: complaint.id,
    })
  },

  async addInternalNote(complaint: Complaint, note: string, actorName?: string): Promise<void> {
    await complaintsRepository.addHistory({
      complaint_id: complaint.uuid,
      status: complaint.status,
      remarks: "[Internal] " + sanitizeText(note),
      actor_name: actorName ?? null,
    })
  },

  /** Admin reply visible to the citizen as a notification. */
  async replyToCitizen(complaint: Complaint, message: string): Promise<void> {
    if (!complaint.reporterId) return
    await notificationsRepository.create({
      user_id: complaint.reporterId,
      title: "Reply on " + complaint.id,
      body: sanitizeText(message),
      type: "admin_reply",
      complaint_id: complaint.uuid,
    })
  },

  archive: (c: Complaint) => complaintsRepository.setArchived(c.uuid, true),
  restore: (c: Complaint) => complaintsRepository.setArchived(c.uuid, false),
  remove: (c: Complaint) => complaintsRepository.remove(c.uuid),
}
