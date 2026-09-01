import { feedbackRepository } from "../repositories/feedback.repository"
import type { z } from "zod"
import type { feedbackSchema } from "../lib/validation"
import { sanitizeText } from "../lib/validation"

type FeedbackInput = z.infer<typeof feedbackSchema>

export const feedbackService = {
  async submit(
    input: FeedbackInput,
    ctx: { userId?: string | null; complaintId?: string | null } = {},
  ): Promise<void> {
    await feedbackRepository.create({
      rating: input.rating,
      comment: input.comment ? sanitizeText(input.comment) : null,
      suggestion: input.suggestion ? sanitizeText(input.suggestion) : null,
      user_id: ctx.userId ?? null,
      complaint_id: ctx.complaintId ?? null,
    })
  },
  list: () => feedbackRepository.list(),
  async averageRating(): Promise<number> {
    const all = await feedbackRepository.list()
    if (!all.length) return 0
    return all.reduce((s, f) => s + f.rating, 0) / all.length
  },
}
