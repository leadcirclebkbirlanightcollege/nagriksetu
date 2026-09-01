import { Router, Response } from "express"
import { db } from "../db"
import { optionalAuth, AuthenticatedRequest } from "../auth"

export const feedbackRouter = Router()

// List feedback
feedbackRouter.get("/", (req, res) => {
  try {
    const list = db.getFeedback()
    return res.status(200).json(list)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to fetch feedback" })
  }
})

// Submit feedback
feedbackRouter.post("/", optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rating, comment, suggestion, complaintId } = req.body

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ error: "Rating between 1 and 5 is required." })
    }

    const userId = req.user ? req.user.userId : null
    const userName = req.user ? req.user.name : "Anonymous Citizen"

    const fb = db.createFeedback({
      userId,
      userName,
      complaintId: complaintId || null,
      rating: Number(rating),
      comment: comment ? comment.trim() : null,
      suggestion: suggestion ? suggestion.trim() : null,
    })

    db.recordActivity({
      actorId: userId,
      actorName: userName,
      action: `Submitted feedback (Rating: ${rating}★)`,
      entity: "feedback",
      entityId: fb.id,
    })

    return res.status(201).json(fb)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to save feedback" })
  }
})
