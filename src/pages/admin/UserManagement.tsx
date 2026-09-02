import { useEffect, useMemo, useState } from "react"
import { Users, RotateCw, Search, Loader2, AlertCircle, Shield, UserCheck, Ban } from "lucide-react"
import Breadcrumb from "../../components/ui/Breadcrumb"
import EmptyState from "../../components/ui/EmptyState"
import Pagination from "../../components/ui/Pagination"
import { useToast } from "../../components/ui/Toast"
import { apiGetAdminUsers, apiUpdateAdminUser, type AdminUser } from "../../lib/api"

const PAGE_SIZE = 10

export default function UserManagement() {
  const { success: toastSuccess, error: toastError } = useToast()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
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
      toastSuccess(`User ${u.name} is now ${nextStatus}`)
    } catch (err) {
      toastError("Failed to update status: " + (err as Error).message)
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter((u) => {
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        (u.ward && u.ward.toLowerCase().includes(q))
      )
    })
  }, [users, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Administration", to: "/admin" }, { label: "User Management" }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lineSubtle pb-4">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <Users className="h-6 w-6 text-navy" aria-hidden="true" />
            <span>User Management</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted">
            Manage citizen accounts, department officers, and role access permissions.
          </p>
        </div>
        <button
          type="button"
          className="gov-btn-outline gap-2 text-xs font-bold shadow-xs"
          onClick={loadUsers}
          disabled={loading}
        >
          <RotateCw className={`h-3.5 w-3.5 text-navy ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
          <span>Refresh</span>
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-gov border border-govRed-border bg-govRed-tint p-3.5 text-xs font-bold text-govRed-dark"
        >
          <AlertCircle className="h-4 w-4 text-govRed shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="flex justify-between">
        <div className="relative sm:w-80">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-light"
            aria-hidden="true"
          />
          <input
            type="search"
            className="gov-input pl-9 text-xs"
            placeholder="Search by name, email, ward…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block gov-card overflow-hidden border border-line shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-center text-ink-muted">
            <Loader2 className="h-5 w-5 animate-spin text-navy" aria-hidden="true" />
            <span className="font-semibold text-sm">Loading users…</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm" aria-label="System users table">
            <thead className="border-b border-line bg-surfaceAlt text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              <tr>
                <th scope="col" className="px-5 py-3.5">User ID</th>
                <th scope="col" className="px-5 py-3.5">Name</th>
                <th scope="col" className="px-5 py-3.5">Email</th>
                <th scope="col" className="px-5 py-3.5">Role</th>
                <th scope="col" className="px-5 py-3.5">Complaints</th>
                <th scope="col" className="px-5 py-3.5">Status</th>
                <th scope="col" className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lineSubtle">
              {paginated.map((u) => (
                <tr key={u.id} className="hover:bg-surface transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-extrabold text-navy">{u.id}</td>
                  <td className="px-5 py-3.5 font-medium text-ink">{u.name}</td>
                  <td className="px-5 py-3.5 text-xs text-ink-muted">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-gov px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                        u.role === "admin"
                          ? "bg-navy text-white"
                          : "border border-line bg-surfaceAlt text-navy"
                      }`}
                    >
                      {u.role === "admin" ? <Shield className="h-3 w-3" aria-hidden="true" /> : null}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-navy">{u.complaintsCount}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-gov border px-2.5 py-0.5 text-xs font-bold ${
                        u.status === "Active"
                          ? "border-govGreen-tint bg-govGreen-tint text-govGreen-dark"
                          : "border-govRed-border bg-govRed-tint text-govRed-dark"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      className={`rounded-gov border px-3 py-1 text-xs font-bold transition-all ${
                        u.status === "Active"
                          ? "border-govRed-border bg-white text-govRed hover:bg-govRed-tint"
                          : "border-govGreen-tint bg-white text-govGreen-dark hover:bg-govGreen-tint"
                      }`}
                      onClick={() => toggleStatus(u)}
                    >
                      {u.status === "Active" ? "Suspend" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} className="p-0">
                    <EmptyState
                      title="No users found"
                      description="No registered accounts match your search criteria."
                    />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Mobile Stacked Cards */}
      <div className="space-y-3 md:hidden">
        {paginated.map((u) => (
          <div key={u.id} className="gov-card p-4 shadow-sm border border-line space-y-2.5">
            <div className="flex items-center justify-between border-b border-lineSubtle pb-2">
              <span className="font-mono text-xs font-extrabold text-navy">{u.id}</span>
              <span
                className={`rounded-gov border px-2 py-0.5 text-[11px] font-bold ${
                  u.status === "Active"
                    ? "border-govGreen-tint bg-govGreen-tint text-govGreen-dark"
                    : "border-govRed-border bg-govRed-tint text-govRed-dark"
                }`}
              >
                {u.status}
              </span>
            </div>

            <div>
              <p className="text-sm font-bold text-navy">{u.name}</p>
              <p className="text-xs text-ink-muted">{u.email}</p>
              <div className="mt-1.5 flex items-center gap-3 text-xs text-ink-light">
                <span>Role: <strong className="text-navy">{u.role}</strong></span>
                <span>Complaints: <strong className="text-navy">{u.complaintsCount}</strong></span>
              </div>
            </div>

            <div className="border-t border-lineSubtle pt-2 flex justify-end">
              <button
                type="button"
                className={`rounded-gov border px-3 py-1 text-xs font-bold ${
                  u.status === "Active"
                    ? "border-govRed-border bg-white text-govRed"
                    : "border-govGreen-tint bg-white text-govGreen-dark"
                }`}
                onClick={() => toggleStatus(u)}
              >
                {u.status === "Active" ? "Suspend Account" : "Activate Account"}
              </button>
            </div>
          </div>
        ))}

        {paginated.length === 0 && !loading ? (
          <EmptyState
            title="No users found"
            description="No registered accounts match your search criteria."
          />
        ) : null}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
