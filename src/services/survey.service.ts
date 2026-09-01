import { surveysRepository } from "../repositories/surveys.repository"
import type { Survey, SurveyQuestion, SurveyResponse } from "../types"

export interface SurveyAnalytics {
  totalResponses: number
  satisfaction: number // avg rating 0-5
  byArea: Array<{ label: string; value: number }>
  byGender: Array<{ label: string; value: number }>
  byAge: Array<{ label: string; value: number }>
  commonProblems: Array<{ label: string; value: number }>
}

const AGE_BUCKETS: Array<[string, (n: number) => boolean]> = [
  ["Under 18", (n) => n < 18],
  ["18-30", (n) => n >= 18 && n <= 30],
  ["31-45", (n) => n >= 31 && n <= 45],
  ["46-60", (n) => n >= 46 && n <= 60],
  ["60+", (n) => n > 60],
]

function tally(items: string[]): Array<{ label: string; value: number }> {
  const map = new Map<string, number>()
  for (const it of items) map.set(it, (map.get(it) ?? 0) + 1)
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

export const surveyService = {
  list: (activeOnly = false) => surveysRepository.list(activeOnly),
  get: (id: string) => surveysRepository.get(id),
  setActive: (id: string, active: boolean) => surveysRepository.setActive(id, active),

  create: (
    survey: { title: string; description?: string; created_by?: string | null },
    questions: Array<Omit<SurveyQuestion, "id">>,
  ) => surveysRepository.create(survey, questions),

  submit: (response: {
    survey_id: string
    respondent?: string | null
    gender?: string | null
    age?: number | null
    area_id?: string | null
    answers: SurveyResponse["answers"]
  }) => surveysRepository.submit(response),

  responses: (surveyId: string) => surveysRepository.responses(surveyId),

  analyze(survey: Survey, responses: SurveyResponse[]): SurveyAnalytics {
    const ratingQ = survey.questions.find((q) => q.type === "rating")
    let satisfaction = 0
    if (ratingQ) {
      const vals = responses
        .map((r) => Number(r.answers[ratingQ.id]))
        .filter((n) => Number.isFinite(n) && n > 0)
      satisfaction = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
    }

    const problems: string[] = []
    for (const r of responses) {
      for (const q of survey.questions) {
        if (q.type === "single" || q.type === "multi") {
          const ans = r.answers[q.id]
          if (Array.isArray(ans)) problems.push(...ans.map(String))
          else if (typeof ans === "string") problems.push(ans)
        }
      }
    }

    const ageLabels = responses
      .map((r) => r.age)
      .filter((a): a is number => typeof a === "number")
      .map((n) => AGE_BUCKETS.find(([, test]) => test(n))?.[0] ?? "Unknown")

    return {
      totalResponses: responses.length,
      satisfaction,
      byArea: tally(responses.map((r) => r.area ?? "Unknown")),
      byGender: tally(responses.map((r) => r.gender ?? "Unknown")),
      byAge: tally(ageLabels),
      commonProblems: tally(problems),
    }
  },
}
