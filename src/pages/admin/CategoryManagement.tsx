import { useState } from "react"
import { ISSUE_CATEGORIES } from "../../types"

export default function CategoryManagement() {
  const [categories, setCategories] = useState<string[]>([...ISSUE_CATEGORIES])
  const [value, setValue] = useState("")

  function add(e: React.FormEvent) {
    e.preventDefault()
    const v = value.trim()
    if (v && !categories.includes(v)) setCategories((p) => [...p, v])
    setValue("")
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Category Management</h1>
        <p className="text-sm text-muted">Define the civic issue categories citizens can report.</p>
      </div>
      <form onSubmit={add} className="gov-card flex flex-col gap-3 p-4 sm:flex-row">
        <input className="gov-input" placeholder="New category name" value={value} onChange={(e) => setValue(e.target.value)} />
        <button className="gov-btn-primary sm:w-40">Add Category</button>
      </form>
      <ul className="gov-card divide-y divide-line">
        {categories.map((c) => (
          <li key={c} className="flex items-center justify-between px-4 py-3">
            <span className="font-medium text-ink">{c}</span>
            <button className="gov-link text-sm" onClick={() => setCategories((p) => p.filter((x) => x !== c))}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
