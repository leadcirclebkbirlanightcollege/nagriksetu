import { Router, Response } from "express"
import { db } from "../db"
import { optionalAuth, AuthenticatedRequest } from "../auth"

export const surveysRouter = Router()

// Get all active surveys
surveysRouter.get("/", (req, res) => {
  try {
    const surveys = db.getSurveys()
    return res.status(200).json(surveys)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to fetch surveys" })
  }
})

// Get survey by id
surveysRouter.get("/:id", (req, res) => {
  try {
    const survey = db.getSurveyById(req.params.id)
    if (!survey) return res.status(404).json({ error: "Survey not found" })
    return res.status(200).json(survey)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to fetch survey" })
  }
})

// Submit survey response
surveysRouter.post("/:id/responses", optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const surveyId = req.params.id
    const { answers } = req.body

    const survey = db.getSurveyById(surveyId)
    if (!survey) return res.status(404).json({ error: "Survey not found" })

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "Answers object is required" })
    }

    const respondentId = req.user ? req.user.userId : null
    const respondentName = req.user ? req.user.name : "Citizen"

    const response = db.createSurveyResponse({
      surveyId,
      respondentId,
      respondentName,
      answers,
    })

    db.recordActivity({
      actorId: respondentId,
      actorName: respondentName,
      action: `Participated in survey "${survey.title}"`,
      entity: "survey",
      entityId: survey.id,
    })

    return res.status(201).json(response)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to submit survey" })
  }
})

// Dynamically aggregated survey analytics
surveysRouter.get("/analytics/aggregate", (req, res) => {
  try {
    const responses = db.getSurveyResponses()
    const totalResponses = responses.length

    // Problem breakdown (from q1 or answers)
    const problemCounts: Record<string, number> = {
      Garbage: 0,
      "Road Damage": 0,
      "Water Supply": 0,
      Drainage: 0,
      "Street Lights": 0,
    }

    // Satisfaction levels (1 to 5 rating)
    const satisfactionMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    responses.forEach((r) => {
      const answers = r.answers || {}

      // Count problem
      const pAns = answers["q1"]
      if (typeof pAns === "string") {
        if (pAns.includes("Garbage")) problemCounts["Garbage"]++
        else if (pAns.includes("Road")) problemCounts["Road Damage"]++
        else if (pAns.includes("Water")) problemCounts["Water Supply"]++
        else if (pAns.includes("Drainage")) problemCounts["Drainage"]++
        else if (pAns.includes("Street")) problemCounts["Street Lights"]++
        else {
          problemCounts[pAns] = (problemCounts[pAns] || 0) + 1
        }
      }

      // Count rating
      const rating = Number(answers["q3"])
      if (rating >= 1 && rating <= 5) {
        satisfactionMap[rating] = (satisfactionMap[rating] || 0) + 1
      }
    })

    const topProblems = Object.entries(problemCounts)
      .map(([problem, count]) => ({
        problem,
        responses: count,
      }))
      .sort((a, b) => b.responses - a.responses)

    const satisfactionLabels: Record<number, string> = {
      5: "Very Satisfied",
      4: "Satisfied",
      3: "Neutral",
      2: "Dissatisfied",
      1: "Very Dissatisfied",
    }

    const satisfaction = [5, 4, 3, 2, 1].map((lvl) => ({
      name: satisfactionLabels[lvl],
      value: satisfactionMap[lvl] || 0,
    }))

    return res.status(200).json({
      totalResponses,
      topProblems,
      satisfaction,
    })
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to calculate survey analytics" })
  }
})
