import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Printer,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Loader2,
  BarChart3,
  PieChart as PieIcon,
  MapPin,
} from "lucide-react"
import SectionHeading from "../components/ui/SectionHeading"
import StatCard from "../components/ui/StatCard"
import IssueHeatMap from "../features/map/IssueHeatMap"
import { useAnalytics } from "../hooks/useAnalytics"

const PIE_COLORS = [
  "#0B3C6D", "#E65100", "#138808", "#12518F", "#D97706",
  "#0284C7", "#7C3AED", "#DB2777", "#059669", "#78350F",
]

const axisTick = { fontSize: 11, fill: "#475569" }
const axisTickSm = { fontSize: 10, fill: "#475569" }
const pieLabel = { fontSize: 10, fill: "#1E293B" }
const gridStroke = "#E2E8F0"
const marginTall = { top: 8, right: 8, bottom: 40, left: 0 }
const marginMid = { top: 8, right: 8, bottom: 30, left: 0 }
const marginFlat = { top: 8, right: 8, bottom: 8, left: 0 }
const barRadius: [number, number, number, number] = [3, 3, 0, 0]

export default function CommunityDashboard() {
  const { data: stats, loading } = useAnalytics()

  const total = stats?.total ?? 0
  const resolved = stats?.resolved ?? 0
  const pending = stats?.pending ?? 0
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0

  const categoryStats = stats?.categoryStats ?? []
  const areaStats = stats?.areaStats ?? []
  const monthlyTrends = stats?.monthlyTrends ?? []

  return (
    <div className="gov-container py-8 sm:py-10">
      <SectionHeading
        title="Community Dashboard"
        subtitle="Public, transparent view of civic issues reported and resolved across the city"
        action={
          <button className="gov-btn-outline gap-2 text-xs font-bold" onClick={() => window.print()}>
            <Printer className="h-4 w-4 text-navy" />
            📄 Download / Print Report
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Reported Issues"
          value={total.toLocaleString("en-IN")}
          accent="navy"
          icon={<FileText className="h-5 w-5 text-navy" />}
        />
        <StatCard
          label="Resolved Issues"
          value={resolved.toLocaleString("en-IN")}
          accent="green"
          icon={<CheckCircle2 className="h-5 w-5 text-[#138808]" />}
        />
        <StatCard
          label="Pending Issues"
          value={pending.toLocaleString("en-IN")}
          accent="saffron"
          icon={<Clock className="h-5 w-5 text-[#E65100]" />}
        />
        <StatCard
          label="Resolution Rate"
          value={resolutionRate + "%"}
          accent="navy"
          icon={<TrendingUp className="h-5 w-5 text-navy" />}
        />
      </div>

      {loading ? (
        <div className="mt-8 flex items-center justify-center gap-3 rounded-gov border border-[#D8DEE6] bg-white p-12 text-center text-[#475569] shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-navy" />
          <span className="font-semibold text-sm">Loading civic metrics…</span>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Panel title="Category-wise Statistics" icon={<BarChart3 className="h-4 w-4 text-navy" />}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryStats} margin={marginTall}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="category" angle={-35} textAnchor="end" interval={0} tick={axisTickSm} height={70} />
                  <YAxis tick={axisTick} />
                  <Tooltip />
                  <Bar dataKey="count" name="Reports" fill="#0B3C6D" radius={barRadius} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Category Distribution" icon={<PieIcon className="h-4 w-4 text-[#E65100]" />}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryStats} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={95} label={pieLabel}>
                    {categoryStats.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Area-wise Statistics" icon={<BarChart3 className="h-4 w-4 text-[#138808]" />}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={areaStats} margin={marginMid}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="area" tick={axisTickSm} />
                  <YAxis tick={axisTick} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reported" name="Reported" fill="#E65100" radius={barRadius} />
                  <Bar dataKey="resolved" name="Resolved" fill="#138808" radius={barRadius} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Monthly Trends" icon={<TrendingUp className="h-4 w-4 text-navy" />}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends} margin={marginFlat}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="month" tick={axisTick} />
                  <YAxis tick={axisTick} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="reported" name="Reported" stroke="#0B3C6D" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#138808" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </div>

          <div className="mt-8">
            <Panel title="Interactive Map & Heatmap of Reported Issues" icon={<MapPin className="h-4 w-4 text-[#E65100]" />}>
              <p className="mb-4 text-xs text-[#64748B]">
                Circles show issue clusters; the heat overlay highlights areas with the most reports.
              </p>
              <IssueHeatMap />
            </Panel>
          </div>
        </>
      )}
    </div>
  )
}

function Panel({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="gov-card border-t-[3px] border-t-navy p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 border-b border-[#E2E8F0] pb-2.5 text-sm font-bold text-navy">
        {icon}
        <span>{title}</span>
      </h2>
      {children}
    </section>
  )
}

