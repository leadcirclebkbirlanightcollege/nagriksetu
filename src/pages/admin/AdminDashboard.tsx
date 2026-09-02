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
  Calendar,
  Tag,
} from "lucide-react"
import StatCard from "../../components/ui/StatCard"
import StatusBadge from "../../components/ui/StatusBadge"
import Breadcrumb from "../../components/ui/Breadcrumb"
import EmptyState from "../../components/ui/EmptyState"
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
      <Breadcrumb items={[{ label: "Administration", to: "/admin" }, { label: "Dashboard Overview" }]} />

      <div className="border-b border-lineSubtle pb-4">
        <h1 className="text-2xl font-bold text-navy">Department Dashboard Overview</h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-muted">
          Department-wide live civic complaint monitoring and SLA tracking
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Complaints"
          value={total.toLocaleString("en-IN")}
          accent="navy"
          icon={<FolderKanban className="h-5 w-5 text-navy" />}
        />
        <StatCard
          label="Resolved / Closed"
          value={resolved.toLocaleString("en-IN")}
          accent="green"
          icon={<CheckCircle2 className="h-5 w-5 text-govGreen" />}
        />
        <StatCard
          label="Pending / Active"
          value={pending.toLocaleString("en-IN")}
          accent="saffron"
          icon={<Clock className="h-5 w-5 text-saffron" />}
        />
        <StatCard
          label="Avg. Resolution"
          value={`${avgDays} days`}
          accent="navy"
          icon={<Zap className="h-5 w-5 text-navy" />}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-gov border border-line bg-white p-12 text-center text-ink-muted shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-navy" aria-hidden="true" />
          <span className="font-semibold text-sm">Loading department metrics…</span>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="gov-card border-t-4 border-t-navy p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 border-b border-lineSubtle pb-2.5 text-sm font-bold text-navy">
                <BarChart3 className="h-4 w-4 text-navy" aria-hidden="true" />
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

            <section className="gov-card border-t-4 border-t-govGreen p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 border-b border-lineSubtle pb-2.5 text-sm font-bold text-navy">
                <TrendingUp className="h-4 w-4 text-govGreen" aria-hidden="true" />
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

          {/* Latest Complaints Section */}
          <section className="gov-card overflow-hidden border border-line shadow-sm">
            <div className="border-b border-line bg-surfaceAlt px-5 py-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Latest Complaints Lodged
              </h2>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm" aria-label="Latest complaints table">
                <thead className="border-b border-line bg-surfaceAlt text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">ID</th>
                    <th scope="col" className="px-5 py-3.5">Title</th>
                    <th scope="col" className="px-5 py-3.5">Area</th>
                    <th scope="col" className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lineSubtle">
                  {recent.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-sm text-ink-muted">
                        No complaints registered yet.
                      </td>
                    </tr>
                  ) : (
                    recent.map((c) => (
                      <tr key={c.id} className="hover:bg-surface transition-colors">
                        <td className="px-5 py-3 font-mono text-xs font-extrabold text-navy">{c.id}</td>
                        <td className="px-5 py-3 font-medium text-ink">{c.title}</td>
                        <td className="px-5 py-3 text-xs text-ink-muted">{c.area}</td>
                        <td className="px-5 py-3">
                          <StatusBadge status={c.status} size="sm" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards */}
            <div className="divide-y divide-lineSubtle md:hidden">
              {recent.map((c) => (
                <div key={c.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-navy">{c.id}</span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <p className="text-sm font-bold text-navy">{c.title}</p>
                  <p className="text-xs text-ink-muted">{c.area}</p>
                </div>
              ))}
              {recent.length === 0 ? (
                <div className="p-6 text-center text-xs text-ink-muted">
                  No complaints registered yet.
                </div>
              ) : null}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
