import { useState } from "react"
import { apiSubmitFeedback } from "../../lib/api"

export default function Feedback() {
  const [rating, setRating] = useState(0)
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState("")
  const [suggestion, setSuggestion] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) return
    setBusy(true)
    setError(null)
    try {
      await apiSubmitFeedback({
        rating,
        comment: message,
        suggestion,
      })
      setSent(true)
    } catch (err) {
      setError((err as Error).message || "Failed to submit feedback")
    } finally {
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <div className="gov-card border-t-4 border-t-india-green p-6 text-center">
        <div aria-hidden className="text-4xl">🙏</div>
        <h1 className="mt-2 text-xl font-bold text-navy">Thank you for your feedback</h1>
        <p className="mt-1 text-ink/80">Your input has been recorded and submitted to the municipal quality assurance cell.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="gov-card p-4">
        <h1 className="text-xl font-bold text-navy">Citizen Feedback</h1>
        <p className="text-sm text-muted">Rate your experience with NagrikSetu and the civic issue resolution process.</p>
      </div>
      <form onSubmit={onSubmit} className="gov-card p-6">
        {error ? (
          <p role="alert" className="mb-4 rounded-gov border border-[#E56458] bg-[#FCE9E7] px-3 py-2 text-sm text-[#8A2A22]">
            {error}
          </p>
        ) : null}
        <fieldset>
          <legend className="gov-label">Overall satisfaction <span className="text-saffron-dark">*</span></legend>
          <div className="flex gap-1" role="radiogroup" aria-label="Satisfaction rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
                className={`flex h-11 w-11 items-center justify-center rounded-gov border text-2xl ${
                  n <= rating ? "border-saffron bg-[#FBEBDE] text-saffron-dark" : "border-line text-muted"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </fieldset>
        <div className="mt-4">
          <label htmlFor="fb-msg" className="gov-label">Comments on Resolution Quality</label>
          <textarea id="fb-msg" rows={3} className="gov-input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what worked well or what can be improved…" />
        </div>
        <div className="mt-4">
          <label htmlFor="fb-sug" className="gov-label">Suggestions for Municipal Digital Portal</label>
          <textarea id="fb-sug" rows={2} className="gov-input" value={suggestion} onChange={(e) => setSuggestion(e.target.value)} placeholder="Any feature or communication enhancements…" />
        </div>
        <button className="gov-btn-saffron mt-5" disabled={rating === 0 || busy}>
          {busy ? "Submitting…" : "Submit Feedback"}
        </button>
      </form>
    </div>
  )
}
