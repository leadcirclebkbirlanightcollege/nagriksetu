import { useEffect, useState } from "react"
import { Layers, Plus, Trash2, Loader2, AlertCircle } from "lucide-react"
import { apiGetAdminCategories, apiAddAdminCategory, apiRemoveAdminCategory } from "../../lib/api"

export default function CategoryManagement() {
  const [categories, setCategories] = useState<string[]>([])
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      const list = await apiGetAdminCategories()
      setCategories(list)
    } catch (err) {
      setError((err as Error).message || "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const v = value.trim()
    if (!v) return
    setBusy(true)
    setError(null)
    try {
      const updated = await apiAddAdminCategory(v)
      setCategories(updated)
      setValue("")
    } catch (err) {
      setError((err as Error).message || "Failed to add category")
    } finally {
      setBusy(false)
    }
  }

  async function handleRemove(category: string) {
    if (!window.confirm(`Are you sure you want to remove category "${category}"?`)) return
    try {
      const updated = await apiRemoveAdminCategory(category)
      setCategories(updated)
    } catch (err) {
      setError((err as Error).message || "Failed to remove category")
    }
  }

  return (
    <div className="space-y-5">
      <div className="border-b border-[#E2E8F0] pb-4">
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Layers className="h-6 w-6 text-navy" />
          <span>Category Management</span>
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">Define the civic issue categories citizens can report.</p>
      </div>

      {error ? (
        <div role="alert" className="flex items-center gap-2.5 rounded-gov border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-xs font-bold text-[#991B1B]">
          <AlertCircle className="h-4 w-4 text-[#DC2626] shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <form onSubmit={handleAdd} className="gov-card flex flex-col gap-3 p-5 shadow-sm sm:flex-row">
        <input
          className="gov-input text-xs"
          placeholder="New category name (e.g. Traffic Signals & Signs)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="gov-btn-primary gap-2 text-xs font-bold sm:w-44 shrink-0" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {busy ? "Adding…" : "Add Category"}
        </button>
      </form>

      <div className="gov-card overflow-hidden border border-[#D8DEE6] shadow-sm divide-y divide-[#E2E8F0]">
        <div className="bg-[#F8FAFC] px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
          Active Civic Categories ({categories.length})
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-10 text-center text-[#64748B]">
            <Loader2 className="h-5 w-5 animate-spin text-navy" />
            <span className="font-semibold text-sm">Loading categories…</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#64748B]">No categories configured.</div>
        ) : (
          categories.map((c) => (
            <div key={c} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors">
              <span className="text-sm font-semibold text-[#1E293B]">{c}</span>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#DC2626] hover:underline"
                onClick={() => handleRemove(c)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

