import SectionHeading from "../components/ui/SectionHeading"
import ReportIssueForm from "../features/complaints/ReportIssueForm"

export default function ReportIssue() {
  return (
    <div className="gov-container py-8">
      <SectionHeading
        title="Report a Civic Issue"
        subtitle="Provide accurate details so your complaint reaches the right department quickly"
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ReportIssueForm />
        <aside className="space-y-4">
          <div className="gov-card border-t-4 border-t-navy p-5">
            <h2 className="text-base font-bold text-navy">Before you report</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink/80">
              <li>• Check if the issue is already reported via Track Complaint.</li>
              <li>• Add clear photos of the problem.</li>
              <li>• Provide an accurate landmark or GPS location.</li>
              <li>• Keep your Complaint ID safe for tracking.</li>
            </ul>
          </div>
          <div className="gov-card border-t-4 border-t-india-green p-5">
            <h2 className="text-base font-bold text-navy">Your data is protected</h2>
            <p className="mt-2 text-sm text-ink/80">
              You can report anonymously. Personal details are never shown on the public
              community dashboard.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
