import { areaStats } from "../../data/mockData"

export default function AreaManagement() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Area Management</h1>
        <p className="text-sm text-muted">Wards and zones covered by the portal, with issue load.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areaStats.map((a) => {
          const pending = a.reported - a.resolved
          const rate = Math.round((a.resolved / a.reported) * 100)
          return (
            <div key={a.area} className="gov-card border-t-4 border-t-navy p-5">
              <h2 className="text-base font-bold text-navy">{a.area}</h2>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Reported</dt><dd className="font-semibold">{a.reported}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Resolved</dt><dd className="font-semibold text-india-greenDark">{a.resolved}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Pending</dt><dd className="font-semibold text-saffron-dark">{pending}</dd></div>
              </dl>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-muted"><span>Resolution rate</span><span>{rate}%</span></div>
                <div className="h-2 w-full rounded-full bg-surfaceAlt">
                  <div className="h-2 rounded-full bg-india-green" style={{ width: rate + "%" }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
