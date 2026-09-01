import { BaseRepository, unwrap } from "./base.repository"
import { toSurvey, toSurveyResponse } from "../lib/mappers"
import type { Survey, SurveyQuestion, SurveyResponse } from "../types"
import type { SurveyQuestionRow, SurveyRow } from "../types/db"

class SurveysRepository extends BaseRepository {
  async list(activeOnly = false): Promise<Survey[]> {
    let q = this.db.from("surveys").select("*").order("created_at", { ascending: false })
    if (activeOnly) q = q.eq("active", true)
    const surveys = unwrap(await q) as SurveyRow[]
    if (!surveys.length) return []
    const ids = surveys.map((s) => s.id)
    const questions = unwrap(
      await this.db.from("survey_questions").select("*").in("survey_id", ids),
    ) as SurveyQuestionRow[]
    return surveys.map((s) =>
      toSurvey(
        s,
        questions.filter((q) => q.survey_id === s.id),
      ),
    )
  }

  async get(id: string): Promise<Survey | null> {
    const rows = unwrap(await this.db.from("surveys").select("*").eq("id", id).limit(1)) as SurveyRow[]
    if (!rows.length) return null
    const questions = unwrap(
      await this.db.from("survey_questions").select("*").eq("survey_id", id),
    ) as SurveyQuestionRow[]
    return toSurvey(rows[0], questions)
  }

  async create(
    survey: { title: string; description?: string; created_by?: string | null },
    questions: Array<Omit<SurveyQuestion, "id">>,
  ): Promise<string> {
    const row = unwrap(await this.db.from("surveys").insert(survey).select("*").single()) as SurveyRow
    if (questions.length) {
      const payload = questions.map((qn, i) => ({
        survey_id: row.id,
        prompt: qn.prompt,
        type: qn.type,
        options: (qn.options ?? []) as unknown as SurveyQuestionRow["options"],
        position: qn.position ?? i,
        required: qn.required ?? true,
      }))
      unwrap(await this.db.from("survey_questions").insert(payload).select("id"))
    }
    return row.id
  }

  async setActive(id: string, active: boolean): Promise<void> {
    unwrap(await this.db.from("surveys").update({ active }).eq("id", id).select("id"))
  }

  async submit(response: {
    survey_id: string
    respondent?: string | null
    gender?: string | null
    age?: number | null
    area_id?: string | null
    answers: SurveyResponse["answers"]
  }): Promise<void> {
    unwrap(
      await this.db
        .from("survey_responses")
        .insert({
          ...response,
          answers: response.answers as unknown as SurveyQuestionRow["options"],
        })
        .select("id"),
    )
  }

  async responses(surveyId: string): Promise<SurveyResponse[]> {
    const rows = unwrap(
      await this.db
        .from("survey_responses")
        .select("*, areas(name)")
        .eq("survey_id", surveyId)
        .order("created_at", { ascending: false }),
    ) as unknown as Array<Parameters<typeof toSurveyResponse>[0] & { areas?: { name?: string } }>
    return rows.map((r) => toSurveyResponse(r, r.areas?.name))
  }
}

export const surveysRepository = new SurveysRepository()
