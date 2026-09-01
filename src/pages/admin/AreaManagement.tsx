import { useEffect, useState } from "react"
import { MapPin, Loader2, AlertCircle } from "lucide-react"
import { apiGetAdminAreas } from "../../lib/api"

interface AreaStat {
  area: string
  reported: number
  resolved: number
}

export default function AreaManagement() {
  const [areas, setAreas] = useState<AreaStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiGetAdminAreas()
      .then((data) => setAreas(data))
      .catch((err) => setError((err as Error).message || "Failed to load area statistics"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5">
      <div className="border-b border-[#E2E8F0] pb-4">
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <MapPin className="h-6 w-6 text-navy" />
          <span>Area &amp; Ward Management</span>
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">Wards and zones covered by the portal with live issue load and resolution rates.</p>
      </div>

      {error ? (
        <div role="alert" className="flex items-center gap-2.5 rounded-gov border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-xs font-bold text-[#991B1B]">
          <AlertCircle className="h-4 w-4 text-[#DC2626] shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-gov border border-[#D8DEE6] bg-white p-12 text-center text-[#475569] shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-navy" />
          <span className="font-semibold text-sm">Loading area metrics…</span>
        </div>
      ) : areas.length === 0 ? (
        <div className="rounded-gov border border-[#D8DEE6] bg-white p-12 text-center text-sm text-[#64748B]">
          No area statistics available yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a) => {
            const pending = Math.max(0, a.reported - a.resolved)
            const rate = a.reported > 0 ? Math.round((a.resolved / a.reported) * 100) : 0
            return (
              <div key={a.area} className="gov-card border-t-[4px] border-t-navy p-5 shadow-sm">
                <h2 className="text-base font-bold text-navy flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-navy shrink-0" />
                  <span>{a.area}</span>
                </h2>
                <dl className="mt-4 space-y-2 text-xs border-y border-[#E2E8F0] py-3">
                  <div className="flex justify-between">
                    <dt className="text-[#64748B] font-medium">Reported</dt>
                    <dd className="font-bold text-navy">{a.reported}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#64748B] font-medium">Resolved</dt>
                    <dd className="font-bold text-[#065F46]">{a.resolved}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#64748B] font-medium">Pending</dt>
                    <dd className="font-bold text-[#E65100]">{pending}</dd>
                  </div>
                </dl>
                <div className="mt-3">
                  <div className="mb-1.5 flex justify-between text-[11px] font-bold">
                    <span className="text-[#64748B]">Resolution rate</span>
                    <span className="text-navy">{rate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                    <div className="h-2 rounded-full bg-[#138808] transition-all" style={{ width: rate + "%" }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

