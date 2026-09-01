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

const axisTick = { fontSize: 12, fill: "#5B6672" }
const gridStroke = "#E9EEF4"
const barMargin = { top: 8, right: 8, bottom: 8, left: 0 }
const barRadius: [number, number, number, number] = [3, 3, 0, 0]

const topProblems = [
  { problem: "Garbage", responses: 412 },
  { problem: "Road Damage", responses: 356 },
  { problem: "Water Supply", responses: 298 },
  { problem: "Drainage", responses: 221 },
  { problem: "Street Lights", responses: 187 },
]

const satisfaction = [
  { name: "Very Satisfied", value: 22 },
  { name: "Satisfied", value: 34 },
  { name: "Neutral", value: 21 },
  { name: "Dissatisfied", value: 15 },
  { name: "Very Dissatisfied", value: 8 },
]

const PIE_COLORS = ["#138808", "#72BC8F", "#FF9933", "#E8842B", "#E56458"]

export default function SurveyAnalytics() {
  const totalResponses = 1284
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Survey Analytics</h1>
          <p className="text-sm text-muted">Civic Priorities Survey 2026 — {totalResponses.toLocaleString("en-IN")} responses</p>
        </div>
        <button className="gov-btn-primary" onClick={() => window.print()}>⬇️ Export Survey Data</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="gov-card p-5">
          <h2 className="mb-1 text-base font-bold text-navy">Most Common Civic Problems</h2>
          <p className="mb-4 text-sm text-muted">Identified from citizen survey responses</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProblems} layout="vertical" margin={barMargin}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis type="number" tick={axisTick} />
              <YAxis type="category" dataKey="problem" width={100} tick={axisTick} />
              <Tooltip />
              <Bar dataKey="responses" name="Responses" fill="#0B3C6D" radius={barRadius} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="gov-card p-5">
          <h2 className="mb-1 text-base font-bold text-navy">Citizen Satisfaction</h2>
          <p className="mb-4 text-sm text-muted">Satisfaction with civic issue resolution</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={satisfaction} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {satisfaction.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section className="gov-card overflow-hidden">
        <h2 className="border-b border-line bg-surface px-4 py-3 text-base font-bold text-navy">Response Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2.5">Civic Problem</th>
                <th className="px-4 py-2.5">Responses</th>
                <th className="px-4 py-2.5">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {topProblems.map((p) => (
                <tr key={p.problem} className="hover:bg-surface">
                  <td className="px-4 py-2.5">{p.problem}</td>
                  <td className="px-4 py-2.5">{p.responses}</td>
                  <td className="px-4 py-2.5">{Math.round((p.responses / totalResponses) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
