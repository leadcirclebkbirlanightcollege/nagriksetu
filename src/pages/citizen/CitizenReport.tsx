import { PlusCircle } from "lucide-react"
import Breadcrumb from "../../components/ui/Breadcrumb"
import ReportIssueForm from "../../features/complaints/ReportIssueForm"

export default function CitizenReport() {
  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Citizen Portal", to: "/citizen" }, { label: "Report New Issue" }]} />

      <div className="gov-card border-t-4 border-t-navy p-5 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
          <PlusCircle className="h-6 w-6 text-navy" aria-hidden="true" />
          <span>Report a New Civic Issue</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-muted">
          Fill in the details below. You will receive an official Complaint ID to monitor progress through resolution.
        </p>
      </div>

      <ReportIssueForm />
    </div>
  )
}
