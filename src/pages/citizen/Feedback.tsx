import { useState } from "react"
import { MessageSquarePlus, Star, Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
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
      <div className="gov-card border-t-[4px] border-t-[#138808] p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFDF5] text-[#138808]">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-3 text-xl font-bold text-navy">Thank you for your feedback</h1>
        <p className="mt-1 text-xs text-[#64748B]">Your input has been recorded and submitted to the municipal quality assurance cell.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="border-b border-[#E2E8F0] pb-4">
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <MessageSquarePlus className="h-6 w-6 text-navy" />
          <span>Citizen Feedback</span>
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">Rate your experience with NagrikSetu and the civic issue resolution process.</p>
      </div>
      <form onSubmit={onSubmit} className="gov-card p-6 shadow-sm border border-[#D8DEE6]">
        {error ? (
          <div role="alert" className="mb-4 flex items-center gap-2 rounded-gov border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-xs font-bold text-[#991B1B]">
            <AlertCircle className="h-4 w-4 text-[#DC2626] shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}
        <fieldset>
          <legend className="gov-label text-xs">Overall satisfaction <span className="text-saffron-dark">*</span></legend>
          <div className="flex gap-2" role="radiogroup" aria-label="Satisfaction rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
                className={`flex h-11 w-11 items-center justify-center rounded-gov border text-lg transition-all ${
                  n <= rating
                    ? "border-[#FF9933] bg-[#FFF7ED] text-[#EA580C] shadow-sm"
                    : "border-[#CBD5E1] bg-white text-[#94A3B8] hover:border-navy"
                }`}
              >
                <Star className={`h-5 w-5 ${n <= rating ? "fill-[#EA580C]" : ""}`} />
              </button>
            ))}
          </div>
        </fieldset>
        <div className="mt-4">
          <label htmlFor="fb-msg" className="gov-label text-xs">Comments on Resolution Quality</label>
          <textarea
            id="fb-msg"
            rows={3}
            className="gov-input text-xs"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what worked well or what can be improved…"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="fb-sug" className="gov-label text-xs">Suggestions for Municipal Digital Portal</label>
          <textarea
            id="fb-sug"
            rows={2}
            className="gov-input text-xs"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Any feature or communication enhancements…"
          />
        </div>
        <button className="gov-btn-saffron mt-5 gap-2 text-xs font-bold" disabled={rating === 0 || busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {busy ? "Submitting…" : "Submit Feedback"}
        </button>
      </form>
    </div>
  )
}

