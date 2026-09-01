import { useState } from "react"

export default function Feedback() {
  const [rating, setRating] = useState(0)
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState("")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="gov-card border-t-4 border-t-india-green p-6 text-center">
        <div aria-hidden className="text-4xl">🙏</div>
        <h1 className="mt-2 text-xl font-bold text-navy">Thank you for your feedback</h1>
        <p className="mt-1 text-ink/80">Your input helps us improve civic services.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="gov-card p-4">
        <h1 className="text-xl font-bold text-navy">Feedback</h1>
        <p className="text-sm text-muted">Rate your experience with NagrikSetu and the resolution process.</p>
      </div>
      <form onSubmit={onSubmit} className="gov-card p-6">
        <fieldset>
          <legend className="gov-label">Overall satisfaction</legend>
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
          <label htmlFor="fb-msg" className="gov-label">Comments</label>
          <textarea id="fb-msg" rows={4} className="gov-input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what worked well or what can be improved…" />
        </div>
        <button className="gov-btn-saffron mt-5" disabled={rating === 0}>Submit Feedback</button>
      </form>
    </div>
  )
}
