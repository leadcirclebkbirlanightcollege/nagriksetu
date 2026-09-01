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
import { apiGetSurveyAnalytics } from "../../lib/api"

const axisTick = { fontSize: 12, fill: "#5B6672" }
const gridStroke = "#E9EEF4"
const barMargin = { top: 8, right: 8, bottom: 8, left: 0 }
const barRadius: [number, number, number, number] = [3, 3, 0, 0]

const PIE_COLORS = ["#138808", "#72BC8F", "#FF9933", "#E8842B", "#E56458"]

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Survey Analytics</h1>
          <p className="text-sm text-muted">
            Civic Priorities &amp; Citizen Feedback Survey — {data.totalResponses.toLocaleString("en-IN")} verified responses
          </p>
        </div>
        <button className="gov-btn-primary" onClick={() => window.print()}>
          ⬇️ Export Survey Data
        </button>
      </div>

      {loading ? (
        <div className="rounded-gov border border-line bg-surface p-8 text-center text-muted">
          Loading survey analytics…
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="gov-card p-5">
            <h2 className="mb-1 text-base font-bold text-navy">Most Common Civic Problems</h2>
            <p className="mb-4 text-sm text-muted">Identified from citizen survey responses</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topProblems} layout="vertical" margin={barMargin}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis type="number" tick={axisTick} />
                <YAxis type="category" dataKey="problem" width={110} tick={axisTick} />
                <Tooltip />
                <Bar dataKey="responses" name="Responses" fill="#0B3C6D" radius={barRadius} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section className="gov-card p-5">
            <h2 className="mb-1 text-base font-bold text-navy">Citizen Satisfaction Breakdown</h2>
            <p className="mb-4 text-sm text-muted">Overall experience with municipal service resolution</p>
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
