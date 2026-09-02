import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ClipboardList, Download, Loader2, BarChart3, PieChart as PieIcon } from "lucide-react"
import Breadcrumb from "../../components/ui/Breadcrumb"
import { apiGetSurveyAnalytics } from "../../lib/api"

const axisTick = { fontSize: 11, fill: "#475569" }
const gridStroke = "#E2E8F0"
const barMargin = { top: 8, right: 8, bottom: 8, left: 0 }
const barRadius: [number, number, number, number] = [0, 4, 4, 0]

const PIE_COLORS = ["#138808", "#2E7D32", "#E65100", "#F57C00", "#DC2626"]

interface SurveyAnalyticsData {
  totalResponses: number
  topProblems: Array<{ problem: string; responses: number }>
  satisfaction: Array<{ name: string; value: number }>
}

export default function SurveyAnalytics() {
  const [data, setData] = useState<SurveyAnalyticsData>({
    totalResponses: 0,
    topProblems: [],
    satisfaction: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGetSurveyAnalytics()
      .then((res) => {
        setData(res)
      })
      .catch((err) => console.warn("Failed to load survey analytics", err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Administration", to: "/admin" }, { label: "Survey Analytics" }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lineSubtle pb-4">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-navy" aria-hidden="true" />
            <span>Survey Analytics</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted">
            Civic Priorities &amp; Citizen Feedback Survey — {data.totalResponses.toLocaleString("en-IN")} verified responses
          </p>
        </div>
        <button
          type="button"
          className="gov-btn-primary gap-2 text-xs font-bold shadow-sm no-print"
          onClick={() => window.print()}
        >
          <Download className="h-4 w-4 text-white" aria-hidden="true" />
          <span>Export Survey Data</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-gov border border-line bg-white p-12 text-center text-ink-muted shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-navy" aria-hidden="true" />
          <span className="font-semibold text-sm">Loading survey analytics…</span>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="gov-card border-t-4 border-t-navy p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold text-navy">
              <BarChart3 className="h-4 w-4 text-navy" aria-hidden="true" />
              <span>Most Common Civic Problems</span>
            </h2>
            <p className="mb-4 mt-0.5 text-xs text-ink-muted">Identified from citizen survey responses</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topProblems} layout="vertical" margin={barMargin}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis type="number" tick={axisTick} />
                <YAxis type="category" dataKey="problem" width={120} tick={axisTick} />
                <Tooltip />
                <Bar dataKey="responses" name="Responses" fill="#0B3C6D" radius={barRadius} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section className="gov-card border-t-4 border-t-navy p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold text-navy">
              <PieIcon className="h-4 w-4 text-govGreen" aria-hidden="true" />
              <span>Citizen Satisfaction Breakdown</span>
            </h2>
            <p className="mb-4 mt-0.5 text-xs text-ink-muted">Overall experience with municipal service resolution</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.satisfaction}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {data.satisfaction.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </section>
        </div>
      )}
    </div>
  )
}
