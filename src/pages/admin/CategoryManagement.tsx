import { useEffect, useState } from "react"
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
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Category Management</h1>
        <p className="text-sm text-muted">Define the civic issue categories citizens can report.</p>
      </div>

      {error ? (
        <p role="alert" className="rounded-gov border border-[#E56458] bg-[#FCE9E7] px-3 py-2 text-sm text-[#8A2A22]">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleAdd} className="gov-card flex flex-col gap-3 p-4 sm:flex-row">
        <input
          className="gov-input"
          placeholder="New category name (e.g. Traffic Signals & Signs)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="gov-btn-primary sm:w-40" disabled={busy}>
          {busy ? "Adding…" : "Add Category"}
        </button>
      </form>

      <div className="gov-card divide-y divide-line">
        {loading ? (
          <div className="p-8 text-center text-muted">Loading categories…</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-muted">No categories configured.</div>
        ) : (
          categories.map((c) => (
            <div key={c} className="flex items-center justify-between px-4 py-3">
              <span className="font-medium text-ink">{c}</span>
              <button
                type="button"
                className="text-xs font-semibold text-[#8A2A22] hover:underline"
                onClick={() => handleRemove(c)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
