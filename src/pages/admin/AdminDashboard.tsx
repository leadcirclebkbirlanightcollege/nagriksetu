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
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Zap,
  BarChart3,
  TrendingUp,
  Loader2,
} from "lucide-react"
import StatCard from "../../components/ui/StatCard"
import StatusBadge from "../../components/ui/StatusBadge"
import { useAnalytics } from "../../hooks/useAnalytics"

const axisTick = { fontSize: 11, fill: "#475569" }
const axisTickSm = { fontSize: 10, fill: "#475569" }
const gridStroke = "#E2E8F0"
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
      <div className="border-b border-[#E2E8F0] pb-4">
        <h1 className="text-2xl font-bold text-navy">Dashboard Overview</h1>
        <p className="mt-1 text-xs text-[#64748B]">Department-wide live civic complaint monitoring and SLA tracking</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Complaints"
          value={total.toLocaleString("en-IN")}
          accent="navy"
          icon={<FolderKanban className="h-5 w-5 text-navy" />}
        />
        <StatCard
          label="Resolved"
          value={resolved.toLocaleString("en-IN")}
          accent="green"
          icon={<CheckCircle2 className="h-5 w-5 text-[#138808]" />}
        />
        <StatCard
          label="Pending"
          value={pending.toLocaleString("en-IN")}
          accent="saffron"
          icon={<Clock className="h-5 w-5 text-[#E65100]" />}
        />
        <StatCard
          label="Avg. Resolution"
          value={`${avgDays} days`}
          accent="navy"
          icon={<Zap className="h-5 w-5 text-navy" />}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-gov border border-[#D8DEE6] bg-white p-12 text-center text-[#475569] shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-navy" />
          <span className="font-semibold text-sm">Loading metrics…</span>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="gov-card border-t-[3px] border-t-navy p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 border-b border-[#E2E8F0] pb-2.5 text-sm font-bold text-navy">
                <BarChart3 className="h-4 w-4 text-navy" />
                <span>Complaints by Category</span>
              </h2>
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
            <section className="gov-card border-t-[3px] border-t-navy p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 border-b border-[#E2E8F0] pb-2.5 text-sm font-bold text-navy">
                <TrendingUp className="h-4 w-4 text-[#138808]" />
                <span>Monthly Resolution Trend</span>
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyTrends} margin={lineMargin}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="month" tick={axisTick} />
                  <YAxis tick={axisTick} />
                  <Tooltip />
                  <Line type="monotone" dataKey="reported" name="Reported" stroke="#E65100" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#138808" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </div>

          <section className="gov-card overflow-hidden border border-[#D8DEE6] shadow-sm">
            <h2 className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-navy">
              Latest Complaints
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  <tr>
                    <th className="px-5 py-3.5">ID</th>
                    <th className="px-5 py-3.5">Title</th>
                    <th className="px-5 py-3.5">Area</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {recent.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-sm text-[#64748B]">
                        No complaints registered yet.
                      </td>
                    </tr>
                  ) : (
                    recent.map((c) => (
                      <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-5 py-3 font-mono text-xs font-bold text-navy">{c.id}</td>
                        <td className="px-5 py-3 font-medium text-[#1E293B]">{c.title}</td>
                        <td className="px-5 py-3 text-xs text-[#64748B]">{c.area}</td>
                        <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
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

