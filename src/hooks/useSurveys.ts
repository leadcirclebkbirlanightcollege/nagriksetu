import { useAsync } from "./useAsync"
import { surveyService } from "../services/survey.service"
import { hasSupabase } from "../lib/supabase"
import { mockSurvey } from "../data/mockData"
import type { Survey } from "../types"

export function useSurveys(activeOnly = false) {
  return useAsync<Survey[]>(async () => {
    if (!hasSupabase) return [mockSurvey]
    return surveyService.list(activeOnly)
  }, [activeOnly])
}

export function useSurvey(id: string | undefined) {
  return useAsync<Survey | null>(async () => {
    if (!id) return null
    if (!hasSupabase) return mockSurvey
    return surveyService.get(id)
  }, [id])
}
