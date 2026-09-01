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
import SectionHeading from "../components/ui/SectionHeading"
import StatCard from "../components/ui/StatCard"
import IssueHeatMap from "../features/map/IssueHeatMap"
import {
  areaStats,
  categoryStats,
  communityTotals,
  monthlyTrends,
} from "../data/mockData"

const PIE_COLORS = [
  "#0B3C6D", "#FF9933", "#138808", "#12518F", "#E8842B",
  "#4FB9C9", "#BF8EDA", "#DF84A8", "#72BC8F", "#8A5200",
]

const axisTick = { fontSize: 12, fill: "#5B6672" }
const axisTickSm = { fontSize: 11, fill: "#5B6672" }
const pieLabel = { fontSize: 10 }
const gridStroke = "#E9EEF4"
const marginTall = { top: 8, right: 8, bottom: 40, left: 0 }
const marginMid = { top: 8, right: 8, bottom: 30, left: 0 }
const marginFlat = { top: 8, right: 8, bottom: 8, left: 0 }
const barRadius: [number, number, number, number] = [3, 3, 0, 0]

export default function CommunityDashboard() {
  const resolutionRate = Math.round((communityTotals.resolved / communityTotals.total) * 100)
  return (
    <div className="gov-container py-8">
      <SectionHeading
        title="Community Dashboard"
        subtitle="Public, transparent view of civic issues reported and resolved across the city"
        action={
          <button className="gov-btn-outline" onClick={() => window.print()}>
            📄 Download / Print Report
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Reported Issues" value={communityTotals.total.toLocaleString("en-IN")} accent="navy" icon="📌" />
        <StatCard label="Resolved Issues" value={communityTotals.resolved.toLocaleString("en-IN")} accent="green" icon="✅" />
        <StatCard label="Pending Issues" value={communityTotals.pending.toLocaleString("en-IN")} accent="saffron" icon="⏳" />
        <StatCard label="Resolution Rate" value={resolutionRate + "%"} accent="navy" icon="📈" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="Category-wise Statistics">
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

        <Panel title="Category Distribution">
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

        <Panel title="Area-wise Statistics">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={areaStats} margin={marginMid}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="area" tick={axisTickSm} />
              <YAxis tick={axisTick} />
              <Tooltip />
              <Legend />
              <Bar dataKey="reported" name="Reported" fill="#FF9933" radius={barRadius} />
              <Bar dataKey="resolved" name="Resolved" fill="#138808" radius={barRadius} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Monthly Trends">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends} margin={marginFlat}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="month" tick={axisTick} />
              <YAxis tick={axisTick} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reported" name="Reported" stroke="#0B3C6D" strokeWidth={2} />
              <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#138808" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="mt-8">
        <Panel title="Interactive Map & Heatmap of Reported Issues">
          <p className="mb-3 text-sm text-muted">
            Circles show issue clusters; the heat overlay highlights areas with the most reports.
          </p>
          <IssueHeatMap />
        </Panel>
      </div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="gov-card p-5">
      <h2 className="mb-4 border-b border-line pb-2 text-base font-bold text-navy">{title}</h2>
      {children}
    </section>
  )
}
