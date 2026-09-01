// Dashboard analytics computed from complaints + feedback + officers.
import { complaintsRepository } from "../repositories/complaints.repository"
import { feedbackRepository } from "../repositories/feedback.repository"
import { referenceRepository } from "../repositories/reference.repository"
import { RESOLVED_STATUSES, PENDING_STATUSES } from "../types"
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

function topKey(map: Map<string, number>): string {
  let best = ""
  let bestN = -1
  for (const [k, v] of map) if (v > bestN) ((best = k), (bestN = v))
  return best || "—"
}

function monthKey(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString("en", { month: "short", year: "2-digit" })
}

export const analyticsService = {
  async dashboard(): Promise<DashboardStats> {
    const [complaints, feedback, officers] = await Promise.all([
      complaintsRepository.list({ archived: false }),
      feedbackRepository.list(),
      referenceRepository.officers().catch(() => []),
    ])

    const resolvedSet = new Set<string>(RESOLVED_STATUSES)
    const pendingSet = new Set<string>(PENDING_STATUSES)
    const today = new Date().toISOString().slice(0, 10)

    const catMap = new Map<string, number>()
    const areaReported = new Map<string, number>()
    const areaResolved = new Map<string, number>()
    const monthReported = new Map<string, number>()
    const monthResolved = new Map<string, number>()
    const offAssigned = new Map<string, number>()
    const offResolved = new Map<string, number>()

    let resolved = 0
    let pending = 0
    let todays = 0
    let resolutionSum = 0
    let resolutionCount = 0

    for (const c of complaints) {
      catMap.set(c.category, (catMap.get(c.category) ?? 0) + 1)
      areaReported.set(c.area, (areaReported.get(c.area) ?? 0) + 1)
      const mk = monthKey(c.createdAt)
      monthReported.set(mk, (monthReported.get(mk) ?? 0) + 1)
      if (c.createdAt.slice(0, 10) === today) todays++
      const isResolved = resolvedSet.has(c.status)
      if (isResolved) {
        resolved++
        areaResolved.set(c.area, (areaResolved.get(c.area) ?? 0) + 1)
        monthResolved.set(mk, (monthResolved.get(mk) ?? 0) + 1)
        if (c.resolvedAt) {
          const days =
            (new Date(c.resolvedAt).getTime() - new Date(c.createdAt).getTime()) /
            86400000
          if (days >= 0) ((resolutionSum += days), (resolutionCount += 1))
        }
      }
      if (pendingSet.has(c.status)) pending++
      if (c.assignedTo) {
        offAssigned.set(c.assignedTo, (offAssigned.get(c.assignedTo) ?? 0) + 1)
        if (isResolved) offResolved.set(c.assignedTo, (offResolved.get(c.assignedTo) ?? 0) + 1)
      }
    }

    const avgRating = feedback.length
      ? feedback.reduce((s, f) => s + f.rating, 0) / feedback.length
      : 0

    const officerNames = new Set<string>([
      ...offAssigned.keys(),
      ...officers.map((o) => o.name),
    ])

    return {
      total: complaints.length,
      resolved,
      pending,
      todays,
      avgResolutionDays: resolutionCount ? resolutionSum / resolutionCount : 0,
      mostReportedCategory: topKey(catMap),
      mostAffectedArea: topKey(areaReported),
      avgRating,
      categoryStats: [...catMap.entries()].map(([category, count]) => ({ category, count })),
      areaStats: [...areaReported.entries()].map(([area, reported]) => ({
        area,
        reported,
        resolved: areaResolved.get(area) ?? 0,
      })),
      monthlyTrends: [...monthReported.entries()].map(([month, reported]) => ({
        month,
        reported,
        resolved: monthResolved.get(month) ?? 0,
      })),
      officerPerformance: [...officerNames].map((officer) => ({
        officer,
        assigned: offAssigned.get(officer) ?? 0,
        resolved: offResolved.get(officer) ?? 0,
      })),
      recent: complaints.slice(0, 8),
    }
  },
}
