import { useEffect, useState } from "react"
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
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Area &amp; Ward Management</h1>
        <p className="text-sm text-muted">Wards and zones covered by the portal with live issue load and resolution rates.</p>
      </div>

      {error ? (
        <p role="alert" className="rounded-gov border border-[#E56458] bg-[#FCE9E7] px-3 py-2 text-sm text-[#8A2A22]">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="rounded-gov border border-line bg-surface p-8 text-center text-muted">
          Loading area metrics…
        </div>
      ) : areas.length === 0 ? (
        <div className="rounded-gov border border-line bg-surface p-8 text-center text-muted">
          No area statistics available yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a) => {
            const pending = Math.max(0, a.reported - a.resolved)
            const rate = a.reported > 0 ? Math.round((a.resolved / a.reported) * 100) : 0
            return (
              <div key={a.area} className="gov-card border-t-4 border-t-navy p-5">
                <h2 className="text-base font-bold text-navy">{a.area}</h2>
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Reported</dt>
                    <dd className="font-semibold text-ink">{a.reported}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Resolved</dt>
                    <dd className="font-semibold text-india-greenDark">{a.resolved}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Pending</dt>
                    <dd className="font-semibold text-saffron-dark">{pending}</dd>
                  </div>
                </dl>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-muted">
                    <span>Resolution rate</span>
                    <span>{rate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surfaceAlt">
                    <div className="h-2 rounded-full bg-india-green" style={{ width: rate + "%" }} />
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
