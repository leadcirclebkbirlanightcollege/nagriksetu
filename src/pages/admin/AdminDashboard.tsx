import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import StatCard from "../../components/ui/StatCard"
import StatusBadge from "../../components/ui/StatusBadge"
import { useAnalytics } from "../../hooks/useAnalytics"

const axisTick = { fontSize: 12, fill: "#5B6672" }
const axisTickSm = { fontSize: 11, fill: "#5B6672" }
const gridStroke = "#E9EEF4"
const chartMargin = { top: 8, right: 8, bottom: 40, left: 0 }
const lineMargin = { top: 8, right: 8, bottom: 8, left: 0 }
const barRadius: [number, number, number, number] = [3, 3, 0, 0]

export default function AdminDashboard() {
  const { data: stats, loading } = useAnalytics()

  const total = stats?.total ?? 0
  const resolved = stats?.resolved ?? 0
  const pending = stats?.pending ?? 0
  const avgDays = stats?.avgResolutionDays ?? 3.2
  const categoryStats = stats?.categoryStats ?? []
  const monthlyTrends = stats?.monthlyTrends ?? []
  const recent = stats?.recent ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Dashboard Overview</h1>
        <p className="text-sm text-muted">Department-wide live civic complaint monitoring and SLA tracking</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Complaints" value={total.toLocaleString("en-IN")} accent="navy" icon="🗂️" />
        <StatCard label="Resolved" value={resolved.toLocaleString("en-IN")} accent="green" icon="✅" />
        <StatCard label="Pending" value={pending.toLocaleString("en-IN")} accent="saffron" icon="⏳" />
        <StatCard label="Avg. Resolution" value={`${avgDays} days`} accent="navy" icon="⚡" />
      </div>

      {loading ? (
        <div className="rounded-gov border border-line bg-surface p-8 text-center text-muted">
          Loading metrics…
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="gov-card p-5">
              <h2 className="mb-4 border-b border-line pb-2 text-base font-bold text-navy">Complaints by Category</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryStats} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="category" angle={-35} textAnchor="end" interval={0} tick={axisTickSm} height={70} />
                  <YAxis tick={axisTick} />
                  <Tooltip />
                  <Bar dataKey="count" name="Complaints" fill="#0B3C6D" radius={barRadius} />
                </BarChart>
              </ResponsiveContainer>
            </section>
            <section className="gov-card p-5">
              <h2 className="mb-4 border-b border-line pb-2 text-base font-bold text-navy">Monthly Resolution Trend</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyTrends} margin={lineMargin}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="month" tick={axisTick} />
                  <YAxis tick={axisTick} />
                  <Tooltip />
                  <Line type="monotone" dataKey="reported" name="Reported" stroke="#FF9933" strokeWidth={2} />
                  <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#138808" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </div>

          <section className="gov-card overflow-hidden">
            <h2 className="border-b border-line bg-surface px-4 py-3 text-base font-bold text-navy">Latest Complaints</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-2.5">ID</th>
                    <th className="px-4 py-2.5">Title</th>
                    <th className="px-4 py-2.5">Area</th>
                    <th className="px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recent.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-muted">
                        No complaints registered yet.
                      </td>
                    </tr>
                  ) : (
                    recent.map((c) => (
                      <tr key={c.id} className="hover:bg-surface">
                        <td className="px-4 py-2.5 font-mono text-xs font-semibold text-navy">{c.id}</td>
                        <td className="px-4 py-2.5">{c.title}</td>
                        <td className="px-4 py-2.5 text-muted">{c.area}</td>
                        <td className="px-4 py-2.5"><StatusBadge status={c.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
