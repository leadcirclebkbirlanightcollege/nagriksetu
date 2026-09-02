import { useState } from "react"
import { MessageSquarePlus, Star, Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import Breadcrumb from "../../components/ui/Breadcrumb"
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
      <div className="space-y-5">
        <Breadcrumb items={[{ label: "Citizen Portal", to: "/citizen" }, { label: "Feedback" }]} />
        <div className="gov-card border-t-4 border-t-govGreen p-8 text-center shadow-card max-w-lg mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-govGreen-tint text-govGreen">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-navy">Thank you for your feedback</h1>
          <p className="mt-2 text-xs sm:text-sm text-ink-muted leading-relaxed">
            Your evaluation has been recorded and submitted to the municipal quality assurance cell.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Citizen Portal", to: "/citizen" }, { label: "Feedback" }]} />

      <div className="gov-card border-t-4 border-t-navy p-5 sm:p-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
          <MessageSquarePlus className="h-6 w-6 text-navy" aria-hidden="true" />
          <span>Citizen Experience Feedback</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-muted">
          Rate your overall experience with NagrikSetu and the civic issue resolution process.
        </p>
      </div>

      <form onSubmit={onSubmit} className="gov-card p-6 sm:p-8 shadow-card border border-line">
        {error ? (
          <div
            role="alert"
            className="mb-4 flex items-center gap-2 rounded-gov border border-govRed-border bg-govRed-tint p-3.5 text-xs font-bold text-govRed-dark"
          >
            <AlertCircle className="h-4 w-4 text-govRed shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}

        <fieldset>
          <legend className="gov-label text-xs">
            Overall Municipal Satisfaction <span className="text-govRed font-bold">*</span>
          </legend>
          <div className="flex gap-2.5 mt-2" role="radiogroup" aria-label="Satisfaction rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
                className={`flex h-12 w-12 items-center justify-center rounded-gov border text-lg transition-all ${
                  n <= rating
                    ? "border-saffron bg-[#FFF7ED] text-saffron shadow-xs"
                    : "border-line bg-white text-ink-light hover:border-navy"
                }`}
              >
                <Star className={`h-6 w-6 ${n <= rating ? "fill-saffron" : ""}`} aria-hidden="true" />
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-5">
          <label htmlFor="fb-msg" className="gov-label text-xs">
            Comments on Resolution Quality &amp; Department Response
          </label>
          <textarea
            id="fb-msg"
            rows={3}
            className="gov-input text-xs sm:text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what worked well or what can be improved…"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="fb-sug" className="gov-label text-xs">
            Suggestions for Municipal Digital Services
          </label>
          <textarea
            id="fb-sug"
            rows={2}
            className="gov-input text-xs sm:text-sm"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Any feature or communication enhancements…"
          />
        </div>

        <button
          type="submit"
          className="gov-btn-saffron mt-6 gap-2 text-xs sm:text-sm font-bold shadow-sm"
          disabled={rating === 0 || busy}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          <span>{busy ? "Submitting…" : "Submit Feedback"}</span>
        </button>
      </form>
    </div>
  )
}
