import { COMPLAINT_STATUSES, type Complaint } from "../../types"

export default function ComplaintTimeline({ complaint }: { complaint: Complaint }) {
  const reachedIndex = COMPLAINT_STATUSES.indexOf(complaint.status)
  const eventByStatus = new Map(complaint.timeline.map((e) => [e.status, e]))

  return (
    <ol className="relative">
      {COMPLAINT_STATUSES.map((status, i) => {
        const done = i <= reachedIndex
        const current = i === reachedIndex
        const event = eventByStatus.get(status)
        return (
          <li key={status} className="flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <span
                aria-hidden
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  done
                    ? "border-india-green bg-india-green text-white"
                    : "border-line bg-white text-muted"
                } ${current ? "ring-4 ring-[#E8F1EC]" : ""}`}
              >
                {done ? "✓" : i + 1}
              </span>
              {i < COMPLAINT_STATUSES.length - 1 ? (
                <span
                  aria-hidden
                  className={`mt-1 w-0.5 flex-1 ${i < reachedIndex ? "bg-india-green" : "bg-line"}`}
                />
              ) : null}
            </div>
            <div className="pt-0.5">
              <p className={`font-semibold ${done ? "text-navy" : "text-muted"}`}>
                {status}
                {current ? (
                  <span className="ml-2 rounded bg-[#FBEBDE] px-2 py-0.5 text-xs font-semibold text-[#8A4B12]">
                    Current
                  </span>
                ) : null}
              </p>
              {event ? (
                <>
                  <time className="text-xs text-muted" dateTime={event.at}>
                    {new Date(event.at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                  {event.note ? <p className="mt-0.5 text-sm text-ink/80">{event.note}</p> : null}
                  {event.actor ? <p className="text-xs text-muted">By: {event.actor}</p> : null}
                </>
              ) : (
                <p className="text-xs text-muted">Pending</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
