const users = [
  { id: "U-1001", name: "Aarav Sharma", email: "aarav@example.com", role: "Citizen", complaints: 4, status: "Active" },
  { id: "U-1002", name: "Meera Nair", email: "meera@example.com", role: "Citizen", complaints: 2, status: "Active" },
  { id: "U-2001", name: "Dept. Officer – Sanitation", email: "sanitation@city.gov", role: "Admin", complaints: 0, status: "Active" },
  { id: "U-2002", name: "Dept. Officer – Electrical", email: "electrical@city.gov", role: "Admin", complaints: 0, status: "Active" },
  { id: "U-1003", name: "Rahul Verma", email: "rahul@example.com", role: "Citizen", complaints: 7, status: "Suspended" },
]

export default function UserManagement() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">User Management</h1>
        <p className="text-sm text-muted">Manage citizen accounts and department officers.</p>
      </div>
      <div className="gov-card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Complaints</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-surface">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-navy">{u.id}</td>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${u.role === "Admin" ? "bg-navy text-white" : "bg-surfaceAlt text-navy"}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3">{u.complaints}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${u.status === "Active" ? "bg-[#E8F1EC] text-india-greenDark" : "bg-[#FCE9E7] text-[#8A2A22]"}`}>{u.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
