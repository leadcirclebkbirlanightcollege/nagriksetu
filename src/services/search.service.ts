// Global search across complaint id, citizen, area, ward, officer, category.
import { complaintsRepository } from "../repositories/complaints.repository"
import type { Complaint } from "../types"

export interface SearchHit {
  complaint: Complaint
  matchedOn: string
}

export const searchService = {
  async global(term: string): Promise<SearchHit[]> {
    const q = term.trim().toLowerCase()
    if (!q) return []
    // Broad server-side fetch, then rank client-side across all fields.
    const complaints = await complaintsRepository.list({ search: term })
    const extra = await complaintsRepository.list({})
    const seen = new Set(complaints.map((c) => c.uuid))
    const pool = [...complaints, ...extra.filter((c) => !seen.has(c.uuid))]

    const hits: SearchHit[] = []
    for (const c of pool) {
      const fields: Array<[string, string | undefined]> = [
        ["Complaint ID", c.id],
        ["Citizen", c.reporterName],
        ["Area", c.area],
        ["Ward", c.ward],
        ["Officer", c.assignedTo],
        ["Category", c.category],
        ["Title", c.title],
      ]
      const match = fields.find(([, v]) => v && v.toLowerCase().includes(q))
      if (match) hits.push({ complaint: c, matchedOn: match[0] })
    }
    return hits
  },
}
