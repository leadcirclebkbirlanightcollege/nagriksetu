import { Check, Clock, Calendar, User, FileText, LucideIcon } from "lucide-react"
import { COMPLAINT_STATUSES, type Complaint, type ComplaintStatus } from "../../types"

export default function ComplaintTimeline({ complaint }: { complaint: Complaint }) {
  const reachedIndex = COMPLAINT_STATUSES.indexOf(complaint.status)
  const eventByStatus = new Map(complaint.timeline.map((e) => [e.status, e]))

  return (
    <ol className="relative space-y-0" aria-label="Official grievance progress timeline">
      {COMPLAINT_STATUSES.map((status, i) => {
        const done = i <= reachedIndex
        const current = i === reachedIndex
        const event = eventByStatus.get(status)

        return (
          <li key={status} className="relative flex gap-4 pb-7 last:pb-0">
            {/* Step marker line */}
            {i < COMPLAINT_STATUSES.length - 1 ? (
              <span
                aria-hidden="true"
                className={`absolute left-4 top-8 -bottom-1 w-0.5 -translate-x-1/2 transition-colors ${
                  i < reachedIndex ? "bg-govGreen" : "bg-lineSubtle"
                }`}
              />
            ) : null}

            {/* Step Icon Badge */}
            <div className="relative z-10 flex flex-col items-center">
              <span
                aria-hidden="true"
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all shadow-xs ${
                  done
                    ? "border-govGreen bg-govGreen text-white"
                    : "border-line bg-white text-ink-light"
                } ${current ? "ring-4 ring-govGreen-tint border-govGreen" : ""}`}
              >
                {done ? <Check className="h-4 w-4 stroke-[3]" /> : i + 1}
              </span>
            </div>

            {/* Step Details */}
            <div className="pt-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className={`text-sm font-bold ${done ? "text-navy" : "text-ink-light"}`}>
                  {status}
                </p>
                {current ? (
                  <span className="inline-flex items-center gap-1 rounded-gov border border-[#FED7AA] bg-[#FFF7ED] px-2 py-0.5 text-[11px] font-bold text-saffron-dark shadow-xs">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    <span>Current Stage</span>
                  </span>
                ) : null}
              </div>

              {event ? (
                <div className="mt-1.5 space-y-1 rounded-gov border border-lineSubtle bg-surface p-2.5 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-ink-muted">
                    <Calendar className="h-3 w-3 text-ink-light shrink-0" aria-hidden="true" />
                    <time dateTime={event.at}>
                      {new Date(event.at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </time>
                  </div>
                  {event.note ? (
                    <p className="text-ink leading-relaxed font-medium">
                      {event.note}
                    </p>
                  ) : null}
                  {event.actor ? (
                    <p className="flex items-center gap-1 text-[11px] text-ink-light">
                      <User className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span>Updated by: <strong className="text-navy">{event.actor}</strong></span>
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-1 text-xs text-ink-light">Awaiting preceding stage completion</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
