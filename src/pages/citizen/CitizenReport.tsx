import ReportIssueForm from "../../features/complaints/ReportIssueForm"

export default function CitizenReport() {
  return (
    <div className="space-y-4">
      <div className="gov-card border-t-4 border-t-saffron p-4">
        <h1 className="text-xl font-bold text-navy">Report a New Issue</h1>
        <p className="mt-1 text-sm text-ink/80">
          Fill in the details below. You will receive a Complaint ID to track progress.
        </p>
      </div>
      <ReportIssueForm />
    </div>
  )
}
