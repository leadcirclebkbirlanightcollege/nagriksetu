import { useEffect, useState } from "react"
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">User Management</h1>
          <p className="text-sm text-muted">Manage citizen accounts, department officers, and role access permissions.</p>
        </div>
        <button className="gov-btn-outline text-sm" onClick={loadUsers}>
          🔄 Refresh
        </button>
      </div>

      {error ? (
        <p role="alert" className="rounded-gov border border-[#E56458] bg-[#FCE9E7] px-3 py-2 text-sm text-[#8A2A22]">
          {error}
        </p>
      ) : null}

      <div className="flex justify-between">
        <input
          type="search"
          className="gov-input sm:w-72"
          placeholder="Search by name, email, ward…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="gov-card overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-muted">Loading users…</div>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Complaints</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-surface">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-navy">{u.id}</td>
                    <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                    <td className="px-4 py-3 text-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${
                          u.role === "admin" ? "bg-navy text-white" : "bg-surfaceAlt text-navy"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{u.complaintsCount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-semibold ${
                          u.status === "Active"
                            ? "bg-[#E8F1EC] text-india-greenDark"
                            : "bg-[#FCE9E7] text-[#8A2A22]"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="gov-btn-outline px-2.5 py-1 text-xs"
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
