import { AlertCircle } from "lucide-react"
import ReportIssueForm from "../../features/complaints/ReportIssueForm"

export default function CitizenReport() {
  return (
    <div className="space-y-5">
      <div className="gov-card border-t-[4px] border-t-navy p-5 shadow-sm">
        <h1 className="text-xl font-bold text-navy flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-navy" />
          <span>Report a New Issue</span>
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">
          Fill in the details below. You will receive a Complaint ID to track progress.
        </p>
      </div>
      <ReportIssueForm />
    </div>
  )
}

