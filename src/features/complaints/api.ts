import type { Complaint, ComplaintPriority } from "../../types"
import type { ReportFormValues } from "./ReportIssueForm"
import {
  apiCreateComplaint,
  apiTrackComplaint,
  apiListComplaints,
  apiUploadImages,
  apiGetMe,
} from "../../lib/api"

export async function createComplaint(
  values: ReportFormValues,
  files: File[],
): Promise<Complaint> {
  const priority = (values.priority as ComplaintPriority) || "Medium"

  let imageUrls: string[] = []
  if (files && files.length > 0) {
    try {
      imageUrls = await apiUploadImages(files)
    } catch (err) {
      console.warn("Image upload failed, proceeding with complaint submission", err)
    }
  }

  return apiCreateComplaint({
    title: values.title,
    category: values.category,
    description: values.description,
    area: values.area,
    ward: values.ward || undefined,
    landmark: values.landmark || undefined,
    lat: values.lat,
    lng: values.lng,
    imageUrls,
    contactNumber: values.contactNumber || undefined,
    priority,
    anonymous: !!values.anonymous,
  })
}

export async function findComplaint(query: string): Promise<Complaint | null> {
  const q = query.trim()
  if (!q) return null
  const results = await apiTrackComplaint(q)
  return results[0] ?? null
}

export async function listMyComplaints(): Promise<Complaint[]> {
  try {
    const me = await apiGetMe()
    if (!me?.id) return []
    return apiListComplaints({ reporterId: me.id })
  } catch {
    return []
  }
}
