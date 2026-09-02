import { useEffect, useState } from "react"
import { CheckCircle2, Send, Loader2, Star, AlertCircle } from "lucide-react"
import SectionHeading from "../components/ui/SectionHeading"
import Breadcrumb from "../components/ui/Breadcrumb"
import { apiGetSurveys, apiSubmitSurveyResponse, type Survey as SurveyType } from "../lib/api"

export default function Survey() {
  const [survey, setSurvey] = useState<SurveyType | null>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiGetSurveys()
      .then((list) => {
        if (list && list.length > 0) {
          setSurvey(list[0])
        }
      })
      .catch((err) => {
        setError((err as Error).message || "Failed to load active surveys")
      })
      .finally(() => setLoading(false))
  }, [])

  function setSingle(qid: string, value: string) {
    setAnswers((p) => ({ ...p, [qid]: value }))
  }

  function toggleMulti(qid: string, value: string) {
    setAnswers((p) => {
      const cur = (p[qid] as string[]) ?? []
      return { ...p, [qid]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!survey) return
    setSubmitting(true)
    setError(null)
    try {
      await apiSubmitSurveyResponse(survey.id, answers)
      setSubmitted(true)
    } catch (err) {
      setError((err as Error).message || "Failed to submit survey")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="gov-container flex items-center justify-center gap-3 py-16 text-center text-ink-muted">
        <Loader2 className="h-6 w-6 animate-spin text-navy" aria-hidden="true" />
        <span className="font-semibold text-base">Loading citizen survey…</span>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="gov-container py-12">
        <div className="gov-card mx-auto max-w-xl border-t-4 border-t-govGreen p-8 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-govGreen-tint text-govGreen">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-navy">Thank you for participating</h1>
          <p className="mt-2 text-sm text-ink-muted leading-relaxed">
            Your response has been recorded and submitted to the municipal planning council for civic infrastructure prioritization.
          </p>
        </div>
      </div>
    )
  }

  if (!survey) {
    return (
      <div className="gov-container py-12 text-center text-ink-muted">
        No active surveys currently available.
      </div>
    )
  }

  return (
    <div className="gov-container py-6 sm:py-8">
      <Breadcrumb items={[{ label: "Civic Survey" }]} />

      <SectionHeading title={survey.title} subtitle={survey.description} />

      <form className="gov-card mx-auto max-w-3xl border-t-4 border-t-navy p-6 sm:p-8 shadow-card" onSubmit={handleSubmit}>
        {error ? (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-gov border border-govRed-border bg-govRed-tint p-4 text-sm text-govRed-dark"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-govRed mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}

        <ol className="space-y-8">
          {survey.questions.map((q, i) => (
            <li key={q.id} className="rounded-gov border border-line bg-surface p-5">
              <fieldset>
                <legend className="text-sm font-bold text-navy">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-bold text-white mr-2">
                    {i + 1}
                  </span>
                  <span>{q.prompt}</span>
                  {q.required ? <span className="text-govRed font-bold ml-1" aria-hidden="true">*</span> : null}
                </legend>

                {q.type === "single" && q.options ? (
                  <div className="mt-3.5 space-y-2">
                    {q.options.map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 rounded-gov border p-3 cursor-pointer transition-all ${
                          answers[q.id] === opt
                            ? "border-navy bg-navy-tint shadow-xs"
                            : "border-line bg-white hover:bg-surfaceAlt"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          required={q.required}
                          checked={answers[q.id] === opt}
                          className="h-4 w-4 text-navy focus:ring-navy"
                          onChange={() => setSingle(q.id, opt)}
                        />
                        <span className="text-sm font-medium text-ink">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : null}

                {q.type === "multi" && q.options ? (
                  <div className="mt-3.5 space-y-2">
                    {q.options.map((opt) => {
                      const isChecked = ((answers[q.id] as string[]) || []).includes(opt)
                      return (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 rounded-gov border p-3 cursor-pointer transition-all ${
                            isChecked
                              ? "border-navy bg-navy-tint shadow-xs"
                              : "border-line bg-white hover:bg-surfaceAlt"
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={opt}
                            checked={isChecked}
                            className="h-4 w-4 rounded text-navy focus:ring-navy"
                            onChange={() => toggleMulti(q.id, opt)}
                          />
                          <span className="text-sm font-medium text-ink">{opt}</span>
                        </label>
                      )
                    })}
                  </div>
                ) : null}

                {q.type === "rating" ? (
                  <div className="mt-3.5 flex flex-wrap gap-2.5" role="radiogroup" aria-label={q.prompt}>
                    {[1, 2, 3, 4, 5].map((n) => {
                      const isSelected = answers[q.id] === n
                      return (
                        <button
                          type="button"
                          key={n}
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setAnswers((p) => ({ ...p, [q.id]: n }))}
                          className={`flex h-11 w-11 items-center justify-center rounded-gov border text-base font-bold transition-all ${
                            isSelected
                              ? "border-saffron bg-[#FFF7ED] text-saffron-dark ring-2 ring-saffron/20 shadow-xs"
                              : "border-line bg-white text-ink-muted hover:border-navy hover:bg-surfaceAlt"
                          }`}
                        >
                          {n}
                        </button>
                      )
                    })}
                  </div>
                ) : null}

                {q.type === "text" ? (
                  <div className="mt-3.5">
                    <textarea
                      rows={3}
                      className="gov-input"
                      value={(answers[q.id] as string) || ""}
                      onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                      placeholder="Enter your feedback or suggestions…"
                    />
                  </div>
                ) : null}
              </fieldset>
            </li>
          ))}
        </ol>

        <div className="mt-8 border-t border-lineSubtle pt-6">
          <button className="gov-btn-saffron gap-2 font-bold shadow-sm" disabled={submitting}>
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{submitting ? "Submitting response…" : "Submit Survey"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
