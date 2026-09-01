// Thin adapter over the production service layer, with an in-memory demo
// fallback so the approved UI stays fully explorable without Supabase keys.
import { supabase, hasSupabase } from "../../lib/supabase"
import type { Complaint, ComplaintPriority } from "../../types"
import { mockComplaints } from "../../data/mockData"
import { complaintService } from "../../services/complaint.service"
import { complaintsRepository } from "../../repositories/complaints.repository"
import type { ReportFormValues } from "./ReportIssueForm"

function genPublicId() {
  const year = new Date().getFullYear()
  const n = Math.floor(1 + Math.random() * 999999)
  return "NGS-" + year + "-" + String(n).padStart(6, "0")
}

// In-memory store used in demo mode so newly created complaints are trackable.
const demoStore: Complaint[] = [...mockComplaints]

export async function createComplaint(
  values: ReportFormValues,
  files: File[],
): Promise<Complaint> {
  const priority = (values.priority as ComplaintPriority) || "Medium"

  if (!hasSupabase || !supabase) {
    const now = new Date().toISOString()
    const complaint: Complaint = {
      uuid: crypto.randomUUID(),
      id: genPublicId(),
      title: values.title,
      category: values.category as Complaint["category"],
      description: values.description,
      area: values.area,
      ward: values.ward || undefined,
      landmark: values.landmark || undefined,
      lat: values.lat,
      lng: values.lng,
      imageUrls: files.map((f) => URL.createObjectURL(f)),
      contactNumber: values.contactNumber || undefined,
      priority,
      anonymous: !!values.anonymous,
      archived: false,
      status: "Reported",
      createdAt: now,
      updatedAt: now,
      timeline: [{ status: "Reported", at: now, actor: "Citizen" }],
    }
    demoStore.unshift(complaint)
    return complaint
  }

  const { data: userData } = await supabase.auth.getUser()
  return complaintService.create({
    title: values.title,
    category: values.category,
    description: values.description,
    area: values.area,
    ward: values.ward || "",
    landmark: values.landmark || "",
    lat: values.lat,
    lng: values.lng,
    priority,
    contactNumber: values.contactNumber || "",
    anonymous: !!values.anonymous,
    images: files,
    reporterId: userData.user?.id ?? null,
  })
}

export async function findComplaint(query: string): Promise<Complaint | null> {
  const q = query.trim()
  if (!q) return null
  if (!hasSupabase || !supabase) {
    return (
      demoStore.find(
        (c) => c.id.toLowerCase() === q.toLowerCase() || c.contactNumber === q,
      ) ?? null
    )
  }
  const results = await complaintService.track(q)
  return results[0] ?? null
}

export async function listMyComplaints(): Promise<Complaint[]> {
  if (!hasSupabase || !supabase) return demoStore
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return []
  return complaintsRepository.list({ reporterId: userData.user.id })
}
