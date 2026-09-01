import { useAsync } from "./useAsync"
import { analyticsService, type DashboardStats } from "../services/analytics.service"
import { hasSupabase } from "../lib/supabase"
import {
  mockComplaints,
  categoryStats,
  areaStats,
  monthlyTrends,
  communityTotals,
} from "../data/mockData"

function demoStats(): DashboardStats {
  return {
    total: communityTotals.total,
    resolved: communityTotals.resolved,
    pending: communityTotals.pending,
    todays: 12,
    avgResolutionDays: communityTotals.avgDays,
    mostReportedCategory: categoryStats[0]?.category ?? "—",
    mostAffectedArea: areaStats[0]?.area ?? "—",
    avgRating: 4.1,
    categoryStats,
    areaStats,
    monthlyTrends,
    officerPerformance: [
      { officer: "R. Deshmukh", assigned: 42, resolved: 38 },
      { officer: "S. Iyer", assigned: 35, resolved: 30 },
      { officer: "A. Khan", assigned: 28, resolved: 21 },
    ],
    recent: mockComplaints.slice(0, 8),
  }
}

export function useAnalytics() {
  return useAsync(async () => {
    if (!hasSupabase) return demoStats()
    return analyticsService.dashboard()
  }, [])
}
