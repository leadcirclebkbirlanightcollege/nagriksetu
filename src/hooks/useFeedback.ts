import { useAsync } from "./useAsync"
import { apiGetFeedback, type AppFeedback } from "../lib/api"

export function useFeedbackList() {
  return useAsync<AppFeedback[]>(async () => {
    return apiGetFeedback()
  }, [])
}
