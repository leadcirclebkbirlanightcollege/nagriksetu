import { useEffect, useState } from "react"
import { Users, RotateCw, Search, Loader2, AlertCircle } from "lucide-react"
import { apiGetAdminUsers, apiUpdateAdminUser, type AdminUser } from "../../lib/api"

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function loadUsers() {
    setLoading(true)
    try {
      const list = await apiGetAdminUsers()
      setUsers(list)
    } catch (err) {
      setError((err as Error).message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  async function toggleStatus(u: AdminUser) {
    const nextStatus = u.status === "Active" ? "Suspended" : "Active"
    try {
      await apiUpdateAdminUser(u.id, { status: nextStatus })
      setUsers((prev) => prev.map((item) => (item.id === u.id ? { ...item, status: nextStatus } : item)))
    } catch (err) {
      alert("Failed to update status: " + (err as Error).message)
    }
  }

  const filtered = users.filter((u) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q) ||
      (u.ward && u.ward.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <Users className="h-6 w-6 text-navy" />
            <span>User Management</span>
          </h1>
          <p className="mt-1 text-xs text-[#64748B]">Manage citizen accounts, department officers, and role access permissions.</p>
        </div>
        <button className="gov-btn-outline gap-2 text-xs font-bold" onClick={loadUsers}>
          <RotateCw className="h-3.5 w-3.5" />
          🔄 Refresh
        </button>
      </div>

      {error ? (
        <div role="alert" className="flex items-center gap-2.5 rounded-gov border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-xs font-bold text-[#991B1B]">
          <AlertCircle className="h-4 w-4 text-[#DC2626] shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="flex justify-between">
        <div className="relative sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#64748B]" />
          <input
            type="search"
            className="gov-input pl-9 text-xs"
            placeholder="Search by name, email, ward…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="gov-card overflow-x-auto border border-[#D8DEE6] shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-center text-[#64748B]">
            <Loader2 className="h-5 w-5 animate-spin text-navy" />
            <span className="font-semibold text-sm">Loading users…</span>
          </div>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              <tr>
                <th className="px-5 py-3.5">User ID</th>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Complaints</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-[#64748B]">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-navy">{u.id}</td>
                    <td className="px-5 py-3.5 font-medium text-[#1E293B]">{u.name}</td>
                    <td className="px-5 py-3.5 text-xs text-[#64748B]">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                          u.role === "admin"
                            ? "bg-navy text-white"
                            : "border border-[#CBD5E1] bg-[#F1F5F9] text-navy"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-navy">{u.complaintsCount}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded border px-2.5 py-0.5 text-xs font-bold ${
                          u.status === "Active"
                            ? "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]"
                            : "border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        className="gov-btn-outline px-3 py-1 text-xs font-bold"
                        onClick={() => toggleStatus(u)}
                      >
                        {u.status === "Active" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

