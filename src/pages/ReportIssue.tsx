import { Info, ShieldCheck } from "lucide-react"
import SectionHeading from "../components/ui/SectionHeading"
import Breadcrumb from "../components/ui/Breadcrumb"
import ReportIssueForm from "../features/complaints/ReportIssueForm"

export default function ReportIssue() {
  return (
    <div className="gov-container py-6 sm:py-8">
      <Breadcrumb items={[{ label: "Report Civic Issue" }]} />

      <SectionHeading
        title="Report a Civic Issue"
        subtitle="Provide accurate details so your complaint reaches the right department quickly"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ReportIssueForm />

        <aside className="space-y-4">
          <div className="gov-card border-t-4 border-t-navy p-5 shadow-sm">
            <h2 className="text-sm font-bold text-navy flex items-center gap-2 border-b border-lineSubtle pb-2.5">
              <Info className="h-4 w-4 text-navy" aria-hidden="true" />
              <span>Before you report</span>
            </h2>
            <ul className="mt-3 space-y-2.5 text-xs text-ink leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-saffron font-bold text-sm leading-none">&bull;</span>
                <span>Check if the issue is already reported via Track Complaint.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-saffron font-bold text-sm leading-none">&bull;</span>
                <span>Add clear photos of the problem.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-saffron font-bold text-sm leading-none">&bull;</span>
                <span>Provide an accurate landmark or GPS location.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-saffron font-bold text-sm leading-none">&bull;</span>
                <span>Keep your Complaint ID safe for tracking.</span>
              </li>
            </ul>
          </div>

          <div className="gov-card border-t-4 border-t-govGreen p-5 shadow-sm">
            <h2 className="text-sm font-bold text-navy flex items-center gap-2 border-b border-lineSubtle pb-2.5">
              <ShieldCheck className="h-4 w-4 text-govGreen" aria-hidden="true" />
              <span>Your data is protected</span>
            </h2>
            <p className="mt-2.5 text-xs text-ink-muted leading-relaxed">
              You can report anonymously. Personal details are never shown on the public
              community dashboard.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
