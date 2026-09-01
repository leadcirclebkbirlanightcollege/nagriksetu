import { useEffect, useState } from "react"
import { CheckCircle2, Send, Loader2, Star, AlertCircle, HelpCircle } from "lucide-react"
import SectionHeading from "../components/ui/SectionHeading"
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
      <div className="gov-container flex items-center justify-center gap-3 py-16 text-center text-[#475569]">
        <Loader2 className="h-6 w-6 animate-spin text-navy" />
        <span className="font-semibold text-base">Loading citizen survey…</span>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="gov-container py-12">
        <div className="gov-card mx-auto max-w-xl border-t-[4px] border-t-[#138808] p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F5E9] text-[#138808]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-navy">Thank you for participating</h1>
          <p className="mt-2 text-sm text-[#475569]">Your response has been recorded and submitted to the municipal planning council.</p>
        </div>
      </div>
    )
  }

  if (!survey) {
    return (
      <div className="gov-container py-12 text-center text-[#64748B]">
        No active surveys currently available.
      </div>
    )
  }

  return (
    <div className="gov-container py-8 sm:py-10">
      <SectionHeading title={survey.title} subtitle={survey.description} />
      <form className="gov-card mx-auto max-w-3xl border-t-[4px] border-t-navy p-6 sm:p-8 shadow-sm" onSubmit={handleSubmit}>
        {error ? (
          <div role="alert" className="mb-6 flex items-start gap-3 rounded-gov border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#991B1B]">
            <AlertCircle className="h-5 w-5 shrink-0 text-[#DC2626]" />
            <span>{error}</span>
          </div>
        ) : null}
        <ol className="space-y-8">
          {survey.questions.map((q, i) => (
            <li key={q.id} className="rounded-gov border border-[#E2E8F0] bg-[#F8FAFC] p-5">
              <fieldset>
                <legend className="text-sm font-bold text-navy">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-bold text-white mr-2">
                    {i + 1}
                  </span>
                  {q.prompt} {q.required ? <span className="text-[#DC2626] font-bold">*</span> : null}
                </legend>
                {q.type === "single" && q.options ? (
                  <div className="mt-3.5 space-y-2">
                    {q.options.map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 rounded-gov border p-3 cursor-pointer transition-all ${
                          answers[q.id] === opt
                            ? "border-navy bg-[#EFF6FF] shadow-xs"
                            : "border-[#CBD5E1] bg-white hover:bg-[#F1F5F9]"
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
                        <span className="text-sm font-medium text-[#1E293B]">{opt}</span>
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
                              ? "border-navy bg-[#EFF6FF] shadow-xs"
                              : "border-[#CBD5E1] bg-white hover:bg-[#F1F5F9]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={opt}
                            checked={isChecked}
                            className="h-4 w-4 rounded text-navy focus:ring-navy"
                            onChange={() => toggleMulti(q.id, opt)}
                          />
                          <span className="text-sm font-medium text-[#1E293B]">{opt}</span>
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
                              ? "border-[#E65100] bg-[#FFF7ED] text-[#C2410C] ring-2 ring-[#E65100]/20 shadow-xs"
                              : "border-[#CBD5E1] bg-white text-[#475569] hover:border-navy hover:bg-[#F1F5F9]"
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
        <div className="mt-8 border-t border-[#E2E8F0] pt-6">
          <button className="gov-btn-saffron gap-2 font-bold shadow-sm" disabled={submitting}>
            <Send className="h-4 w-4" />
            {submitting ? "Submitting response…" : "Submit Survey"}
          </button>
        </div>
      </form>
    </div>
  )
}

