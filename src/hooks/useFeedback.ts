import { useAsync } from "./useAsync"
import { feedbackService } from "../services/feedback.service"
import { hasSupabase } from "../lib/supabase"
import type { FeedbackEntry } from "../repositories/feedback.repository"

export function useFeedbackList() {
  return useAsync<FeedbackEntry[]>(async () => {
    if (!hasSupabase) return []
    return feedbackService.list()
  }, [])
}
