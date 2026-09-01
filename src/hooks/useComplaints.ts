import { useAsync } from "./useAsync"
import { apiListComplaints, apiGetComplaint, type ComplaintFilters } from "../lib/api"
import type { Complaint } from "../types"

export function useComplaints(filters: ComplaintFilters = {}) {
  return useAsync<Complaint[]>(() => apiListComplaints(filters), [JSON.stringify(filters)])
}

export function useComplaint(publicId: string | undefined) {
  return useAsync<Complaint | null>(async () => {
    if (!publicId) return null
    return apiGetComplaint(publicId)
  }, [publicId])
}
