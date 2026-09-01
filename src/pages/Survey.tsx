import { useState } from "react"
import SectionHeading from "../components/ui/SectionHeading"
import { mockSurvey } from "../data/mockData"

export default function Survey() {
  const survey = mockSurvey
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({})
  const [submitted, setSubmitted] = useState(false)

  function setSingle(qid: string, value: string) {
    setAnswers((p) => ({ ...p, [qid]: value }))
  }
  function toggleMulti(qid: string, value: string) {
    setAnswers((p) => {
      const cur = (p[qid] as string[]) ?? []
      return { ...p, [qid]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] }
    })
  }

  if (submitted) {
    return (
      <div className="gov-container py-10">
        <div className="gov-card mx-auto max-w-xl border-t-4 border-t-india-green p-8 text-center">
          <div aria-hidden className="text-4xl">✅</div>
          <h1 className="mt-2 text-xl font-bold text-navy">Thank you for participating</h1>
          <p className="mt-2 text-ink/80">Your responses help identify the most common civic problems in your area.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="gov-container py-8">
      <SectionHeading title={survey.title} subtitle={survey.description} />
      <form
        className="gov-card mx-auto max-w-2xl p-6"
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
        }}
      >
        <ol className="space-y-8">
          {survey.questions.map((q, i) => (
            <li key={q.id}>
              <fieldset>
                <legend className="gov-label text-base">
                  {i + 1}. {q.prompt}
                </legend>
                {q.type === "single" && q.options ? (
                  <div className="mt-2 space-y-2">
                    {q.options.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 rounded-gov border border-line p-3 hover:bg-surface">
                        <input type="radio" name={q.id} value={opt} className="h-4 w-4" onChange={() => setSingle(q.id, opt)} />
                        <span className="text-sm text-ink">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : null}
                {q.type === "multi" && q.options ? (
                  <div className="mt-2 space-y-2">
                    {q.options.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 rounded-gov border border-line p-3 hover:bg-surface">
                        <input type="checkbox" value={opt} className="h-4 w-4" onChange={() => toggleMulti(q.id, opt)} />
                        <span className="text-sm text-ink">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : null}
                {q.type === "rating" ? (
                  <div className="mt-2 flex gap-2" role="radiogroup" aria-label={q.prompt}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        type="button"
                        key={n}
                        role="radio"
                        aria-checked={answers[q.id] === n}
                        onClick={() => setAnswers((p) => ({ ...p, [q.id]: n }))}
                        className={`h-11 w-11 rounded-gov border text-lg font-semibold ${
                          answers[q.id] === n ? "border-saffron bg-[#FBEBDE] text-saffron-dark" : "border-line text-muted"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                ) : null}
              </fieldset>
            </li>
          ))}
        </ol>
        <button className="gov-btn-saffron mt-8">Submit Survey</button>
      </form>
    </div>
  )
}
