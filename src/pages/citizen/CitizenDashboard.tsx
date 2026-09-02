import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  PlusCircle,
  ClipboardList,
  FileText,
  CheckCircle2,
  Clock,
  ChevronRight,
  Shield,
  Eye,
} from "lucide-react"
import StatCard from "../../components/ui/StatCard"
import StatusBadge from "../../components/ui/StatusBadge"
import Breadcrumb from "../../components/ui/Breadcrumb"
import EmptyState from "../../components/ui/EmptyState"
import { listMyComplaints } from "../../features/complaints/api"
import { useAuth } from "../../context/AuthContext"
import type { Complaint } from "../../types"

export default function CitizenDashboard() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listMyComplaints()
      .then((data) => setComplaints(data))
      .catch(() => setComplaints([]))
      .finally(() => setLoading(false))
  }, [])

  const resolved = complaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length
  const pending = complaints.length - resolved

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Citizen Portal", to: "/citizen" }, { label: "Dashboard" }]} />

      {/* Citizen Welcome Card */}
      <div className="gov-card border-t-4 border-t-navy p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
              <Shield className="h-5 w-5 text-navy" aria-hidden="true" />
              <span>Namaste, {user?.name}</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-ink-muted leading-relaxed">
              Welcome to your citizen grievance desk. Lodge new civic complaints and monitor official resolution progress.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link to="/citizen/report" className="gov-btn-saffron gap-2 text-xs sm:text-sm font-bold shadow-xs">
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              <span>Report New Issue</span>
            </Link>
            <Link to="/citizen/complaints" className="gov-btn-outline gap-2 text-xs sm:text-sm font-bold shadow-xs">
              <ClipboardList className="h-4 w-4 text-navy" aria-hidden="true" />
              <span>My Complaints</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Summaries */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard
          label="Total Complaints"
          value={complaints.length}
          accent="navy"
          icon={<FileText className="h-5 w-5 text-navy" />}
        />
        <StatCard
          label="Resolved / Closed"
          value={resolved}
          accent="green"
          icon={<CheckCircle2 className="h-5 w-5 text-govGreen" />}
        />
        <StatCard
          label="In Progress / Pending"
          value={pending}
          accent="saffron"
          icon={<Clock className="h-5 w-5 text-saffron" />}
        />
      </div>

      {/* Recent Complaints Section */}
      <div className="gov-card overflow-hidden border border-line shadow-sm">
        <div className="flex items-center justify-between border-b border-lineSubtle bg-surfaceAlt px-5 py-3.5">
          <h2 className="font-bold text-navy text-xs uppercase tracking-wider">
            Recent Complaints &amp; Status
          </h2>
          <Link to="/citizen/complaints" className="gov-link text-xs font-bold flex items-center gap-1">
            <span>View all complaints</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {complaints.length === 0 && !loading ? (
          <EmptyState
            title="No complaints registered yet"
            description="You have not submitted any civic complaints under this account. Click below to raise your first issue."
            action={
              <Link to="/citizen/report" className="gov-btn-primary gap-1.5 text-xs font-bold">
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
                <span>Report Civic Issue</span>
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-lineSubtle">
            {complaints.slice(0, 5).map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 hover:bg-surface transition-colors">
                <span className="font-mono text-xs font-extrabold text-navy">{c.id}</span>
                <span className="min-w-0 flex-1 truncate text-xs sm:text-sm font-medium text-ink">
                  {c.title}
                </span>
                <span className="rounded-gov border border-line bg-surfaceAlt px-2 py-0.5 text-[11px] font-semibold text-navy">
                  {c.category}
                </span>
                <StatusBadge status={c.status} size="sm" />
                <Link
                  to="/citizen/complaints"
                  className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:text-saffron transition-colors ml-2"
                  aria-label={`View details for ${c.id}`}
                >
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">View</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
