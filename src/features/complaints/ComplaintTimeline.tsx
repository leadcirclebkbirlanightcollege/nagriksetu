import { Check, Clock } from "lucide-react"
import { COMPLAINT_STATUSES, type Complaint } from "../../types"

export default function ComplaintTimeline({ complaint }: { complaint: Complaint }) {
  const reachedIndex = COMPLAINT_STATUSES.indexOf(complaint.status)
  const eventByStatus = new Map(complaint.timeline.map((e) => [e.status, e]))

  return (
    <ol className="relative" aria-label="Complaint progress timeline">
      {COMPLAINT_STATUSES.map((status, i) => {
        const done = i <= reachedIndex
        const current = i === reachedIndex
        const event = eventByStatus.get(status)
        return (
          <li key={status} className="flex gap-4 pb-7 last:pb-0">
            <div className="flex flex-col items-center">
              <span
                aria-hidden
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                  done
                    ? "border-[#138808] bg-[#138808] text-white shadow-xs"
                    : "border-[#CBD5E1] bg-white text-[#94A3B8]"
                } ${current ? "ring-4 ring-[#DCFCE7] border-[#138808]" : ""}`}
              >
                {done ? <Check className="h-4 w-4 stroke-[3]" /> : i + 1}
              </span>
              {i < COMPLAINT_STATUSES.length - 1 ? (
                <span
                  aria-hidden
                  className={`mt-1.5 w-0.5 flex-1 ${i < reachedIndex ? "bg-[#138808]" : "bg-[#E2E8F0]"}`}
                />
              ) : null}
            </div>
            <div className="pt-0.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className={`text-sm font-bold ${done ? "text-navy" : "text-[#94A3B8]"}`}>
                  {status}
                </p>
                {current ? (
                  <span className="inline-flex items-center gap-1 rounded border border-[#FFEDD5] bg-[#FFF7ED] px-2 py-0.5 text-[11px] font-extrabold text-[#C2410C]">
                    <Clock className="h-3 w-3" />
                    Current
                  </span>
                ) : null}
              </div>
              {event ? (
                <div className="mt-1 space-y-0.5">
                  <time className="block text-[11px] font-semibold text-[#64748B]" dateTime={event.at}>
                    {new Date(event.at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                  {event.note ? <p className="text-xs text-[#334155] leading-relaxed">{event.note}</p> : null}
                  {event.actor ? <p className="text-[11px] text-[#64748B]">By: <span className="font-semibold text-navy">{event.actor}</span></p> : null}
                </div>
              ) : (
                <p className="mt-0.5 text-xs text-[#94A3B8]">Pending</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

