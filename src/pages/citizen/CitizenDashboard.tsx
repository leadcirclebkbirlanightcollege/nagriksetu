import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { PlusCircle, ListOrdered, FileText, CheckCircle2, Clock, ChevronRight } from "lucide-react"
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
      <div className="gov-card border-t-[4px] border-t-navy p-6 shadow-sm">
        <h1 className="text-xl font-bold text-navy">Namaste, {user?.name} 👋</h1>
        <p className="mt-1 text-sm text-[#475569]">
          Welcome to your citizen dashboard. Report new civic issues and monitor their resolution here.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/citizen/report" className="gov-btn-saffron gap-2 font-bold shadow-xs">
            <PlusCircle className="h-4 w-4" />
            ➕ Report New Issue
          </Link>
          <Link to="/citizen/complaints" className="gov-btn-outline gap-2 font-bold">
            <ListOrdered className="h-4 w-4 text-navy" />
            📋 My Complaints
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          label="Total Complaints"
          value={complaints.length}
          accent="navy"
          icon={<FileText className="h-5 w-5 text-navy" />}
        />
        <StatCard
          label="Resolved"
          value={resolved}
          accent="green"
          icon={<CheckCircle2 className="h-5 w-5 text-[#138808]" />}
        />
        <StatCard
          label="In Progress / Pending"
          value={pending}
          accent="saffron"
          icon={<Clock className="h-5 w-5 text-[#E65100]" />}
        />
      </div>

      <div className="gov-card overflow-hidden border border-[#D8DEE6] shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3.5">
          <h2 className="font-bold text-navy text-sm uppercase tracking-wide">Recent Complaints</h2>
          <Link to="/citizen/complaints" className="gov-link text-xs font-bold flex items-center gap-1">
            <span>View all</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        {complaints.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[#64748B]">No complaints yet. Report your first civic issue.</p>
        ) : (
          <ul className="divide-y divide-[#E2E8F0]">
            {complaints.slice(0, 5).map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors">
                <span className="font-mono text-xs font-bold text-navy">{c.id}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#1E293B]">{c.title}</span>
                <span className="rounded border border-[#E2E8F0] bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-medium text-navy">{c.category}</span>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

