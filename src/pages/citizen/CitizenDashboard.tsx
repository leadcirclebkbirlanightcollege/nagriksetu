import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import StatCard from "../../components/ui/StatCard"
import StatusBadge from "../../components/ui/StatusBadge"
import { listMyComplaints } from "../../features/complaints/api"
import { useAuth } from "../../context/AuthContext"
import type { Complaint } from "../../types"

export default function CitizenDashboard() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState<Complaint[]>([])

  useEffect(() => {
    listMyComplaints().then(setComplaints).catch(() => setComplaints([]))
  }, [])

  const resolved = complaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length
  const pending = complaints.length - resolved

  return (
    <div className="space-y-6">
      <div className="gov-card border-t-4 border-t-navy p-5">
        <h1 className="text-xl font-bold text-navy">Namaste, {user?.name} 👋</h1>
        <p className="mt-1 text-sm text-ink/80">
          Welcome to your citizen dashboard. Report new civic issues and monitor their resolution here.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/citizen/report" className="gov-btn-saffron">➕ Report New Issue</Link>
          <Link to="/citizen/complaints" className="gov-btn-outline">📋 My Complaints</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Total Complaints" value={complaints.length} accent="navy" />
        <StatCard label="Resolved" value={resolved} accent="green" />
        <StatCard label="In Progress / Pending" value={pending} accent="saffron" />
      </div>

      <div className="gov-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
          <h2 className="font-bold text-navy">Recent Complaints</h2>
          <Link to="/citizen/complaints" className="gov-link text-sm">View all</Link>
        </div>
        {complaints.length === 0 ? (
          <p className="px-4 py-8 text-center text-muted">No complaints yet. Report your first civic issue.</p>
        ) : (
          <ul className="divide-y divide-line">
            {complaints.slice(0, 5).map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="font-mono text-xs font-semibold text-navy">{c.id}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-ink">{c.title}</span>
                <span className="rounded bg-surfaceAlt px-2 py-0.5 text-xs text-navy">{c.category}</span>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
