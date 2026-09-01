import { useAsync } from "./useAsync"
import { complaintService } from "../services/complaint.service"
import type { ComplaintFilters } from "../repositories/complaints.repository"
import { mockComplaints } from "../data/mockData"
import { hasSupabase } from "../lib/supabase"

export function useComplaints(filters: ComplaintFilters = {}) {
  return useAsync(async () => {
    if (!hasSupabase) return mockComplaints
    return complaintService.list(filters)
  }, [JSON.stringify(filters)])
}

export function useComplaint(publicId: string | undefined) {
  return useAsync(async () => {
    if (!publicId) return null
    if (!hasSupabase) return mockComplaints.find((c) => c.id === publicId) ?? null
    return complaintService.getByPublicId(publicId)
  }, [publicId])
}
