import { BaseRepository, unwrap } from "./base.repository"
import type { FeedbackRow } from "../types/db"

export interface FeedbackEntry {
  id: string
  rating: number
  comment?: string
  suggestion?: string
  complaintId?: string
  createdAt: string
}

function toFeedback(row: FeedbackRow): FeedbackEntry {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment ?? undefined,
    suggestion: row.suggestion ?? undefined,
    complaintId: row.complaint_id ?? undefined,
    createdAt: row.created_at,
  }
}

class FeedbackRepository extends BaseRepository {
  async create(entry: {
    rating: number
    comment?: string | null
    suggestion?: string | null
    user_id?: string | null
    complaint_id?: string | null
  }): Promise<void> {
    unwrap(await this.db.from("feedback").insert(entry).select("id"))
  }

  async list(): Promise<FeedbackEntry[]> {
    const rows = unwrap(
      await this.db.from("feedback").select("*").order("created_at", { ascending: false }),
    )
    return rows.map(toFeedback)
  }
}

export const feedbackRepository = new FeedbackRepository()
