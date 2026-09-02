import { useEffect, useState } from "react"
import { Layers, Plus, Trash2, Loader2, AlertCircle } from "lucide-react"
import Breadcrumb from "../../components/ui/Breadcrumb"
import { useToast } from "../../components/ui/Toast"
import { apiGetAdminCategories, apiAddAdminCategory, apiRemoveAdminCategory } from "../../lib/api"

export default function CategoryManagement() {
  const { success: toastSuccess, error: toastError } = useToast()
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
      toastSuccess(`Category "${v}" added successfully`)
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
      toastSuccess(`Category "${category}" removed`)
    } catch (err) {
      setError((err as Error).message || "Failed to remove category")
    }
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Administration", to: "/admin" }, { label: "Category Management" }]} />

      <div className="border-b border-lineSubtle pb-4">
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Layers className="h-6 w-6 text-navy" aria-hidden="true" />
          <span>Category Management</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-muted">
          Configure the active civic issue categories that citizens can select when lodging complaints.
        </p>
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

      <form onSubmit={handleAdd} className="gov-card flex flex-col gap-3 p-5 shadow-sm sm:flex-row">
        <input
          className="gov-input text-xs sm:text-sm"
          placeholder="New category name (e.g. Traffic Signals & Signs)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="submit"
          className="gov-btn-primary gap-2 text-xs sm:text-sm font-bold sm:w-44 shrink-0 shadow-sm"
          disabled={busy || !value.trim()}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Plus className="h-4 w-4" />}
          <span>{busy ? "Adding…" : "Add Category"}</span>
        </button>
      </form>

      <div className="gov-card overflow-hidden border border-line shadow-sm divide-y divide-lineSubtle">
        <div className="bg-surfaceAlt px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
          Active Civic Categories ({categories.length})
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-10 text-center text-ink-muted">
            <Loader2 className="h-5 w-5 animate-spin text-navy" aria-hidden="true" />
            <span className="font-semibold text-sm">Loading categories…</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink-muted">No categories configured.</div>
        ) : (
          categories.map((c) => (
            <div key={c} className="flex items-center justify-between px-5 py-3.5 hover:bg-surface transition-colors">
              <span className="text-sm font-semibold text-ink">{c}</span>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-bold text-govRed hover:underline focus:outline-none"
                onClick={() => handleRemove(c)}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Remove</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
