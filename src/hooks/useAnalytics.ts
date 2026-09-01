import { useAsync } from "./useAsync"
import { apiGetAnalytics, apiListComplaints, apiGetFeedback } from "../lib/api"
import type { Complaint } from "../types"

export interface DashboardStats {
  total: number
  resolved: number
  pending: number
  todays: number
  avgResolutionDays: number
  mostReportedCategory: string
  mostAffectedArea: string
  avgRating: number
  categoryStats: Array<{ category: string; count: number }>
  areaStats: Array<{ area: string; reported: number; resolved: number }>
  monthlyTrends: Array<{ month: string; reported: number; resolved: number }>
  officerPerformance: Array<{ officer: string; assigned: number; resolved: number }>
  recent: Complaint[]
}

export function useAnalytics() {
  return useAsync<DashboardStats>(async () => {
    const [analytics, complaints, feedback] = await Promise.all([
      apiGetAnalytics(),
      apiListComplaints({ archived: false }),
      apiGetFeedback().catch(() => []),
    ])

    const totalRatings = feedback.reduce((sum, f) => sum + f.rating, 0)
    const avgRating = feedback.length > 0 ? Number((totalRatings / feedback.length).toFixed(1)) : 4.5

    const mostReportedCategory = analytics.categoryStats[0]?.category ?? "—"
    const mostAffectedArea = analytics.areaStats[0]?.area ?? "—"

    // Calculate officer performance from real complaints
    const officerMap: Record<string, { assigned: number; resolved: number }> = {}
    complaints.forEach((c) => {
      if (c.assignedTo) {
        if (!officerMap[c.assignedTo]) {
          officerMap[c.assignedTo] = { assigned: 0, resolved: 0 }
        }
        officerMap[c.assignedTo].assigned++
        if (c.status === "Resolved" || c.status === "Citizen Verified" || c.status === "Closed") {
          officerMap[c.assignedTo].resolved++
        }
      }
    })

    const officerPerformance = Object.entries(officerMap).map(([officer, data]) => ({
      officer,
      assigned: data.assigned,
      resolved: data.resolved,
    }))

    return {
      total: analytics.total,
      resolved: analytics.resolved,
      pending: analytics.pending,
      todays: analytics.todaysCount,
      avgResolutionDays: analytics.avgResolutionDays,
      mostReportedCategory,
      mostAffectedArea,
      avgRating,
      categoryStats: analytics.categoryStats,
      areaStats: analytics.areaStats,
      monthlyTrends: analytics.monthlyTrends,
      officerPerformance,
      recent: complaints.slice(0, 10),
    }
  }, [])
}
