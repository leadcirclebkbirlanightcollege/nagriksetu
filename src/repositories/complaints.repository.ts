// Complaints data access.
import { BaseRepository, unwrap } from "./base.repository"
import { toComplaint, type ComplaintRelations } from "../lib/mappers"
import type { Complaint, ComplaintStatus } from "../types"
import type { ComplaintRow, ComplaintHistoryRow, ComplaintImageRow } from "../types/db"

export interface ComplaintFilters {
  status?: string
  category?: string
  area?: string
  ward?: string
  priority?: string
  departmentId?: string
  officerId?: string
  reporterId?: string
  archived?: boolean
  fromDate?: string
  toDate?: string
  search?: string
}

const SELECT =
  "*, departments(name), officers(id, profiles(full_name)), reporter:profiles!complaints_reporter_id_fkey(full_name)"

function relationsFromRow(row: Record<string, unknown>): ComplaintRelations {
  const dept = row.departments as { name?: string } | null
  const off = row.officers as { profiles?: { full_name?: string } } | null
  const rep = row.reporter as { full_name?: string } | null
  return {
    departmentName: dept?.name,
    officerName: off?.profiles?.full_name,
    reporterName: rep?.full_name,
  }
}

class ComplaintsRepository extends BaseRepository {
  async list(filters: ComplaintFilters = {}): Promise<Complaint[]> {
    let q = this.db.from("complaints").select(SELECT).order("created_at", { ascending: false })

    if (filters.status) q = q.eq("status", filters.status)
    if (filters.category) q = q.eq("category", filters.category)
    if (filters.area) q = q.eq("area", filters.area)
    if (filters.ward) q = q.eq("ward_id", filters.ward)
    if (filters.priority) q = q.eq("priority", filters.priority)
    if (filters.departmentId) q = q.eq("department_id", filters.departmentId)
    if (filters.officerId) q = q.eq("officer_id", filters.officerId)
    if (filters.reporterId) q = q.eq("reporter_id", filters.reporterId)
    if (typeof filters.archived === "boolean") q = q.eq("archived", filters.archived)
    if (filters.fromDate) q = q.gte("created_at", filters.fromDate)
    if (filters.toDate) q = q.lte("created_at", filters.toDate)
    if (filters.search) {
      const term = filters.search.replace(/[%,]/g, " ")
      q = q.or(
        [
          "public_id.ilike.%" + term + "%",
          "title.ilike.%" + term + "%",
          "area.ilike.%" + term + "%",
          "category.ilike.%" + term + "%",
        ].join(","),
      )
    }

    const rows = unwrap(await q)
    return (rows as unknown as Record<string, unknown>[]).map((r) =>
      toComplaint(r as unknown as ComplaintRow, relationsFromRow(r)),
    )
  }

  /** Full detail incl. history + images. Accepts public_id or uuid. */
  async getByPublicId(publicId: string): Promise<Complaint | null> {
    const rows = unwrap(
      await this.db.from("complaints").select(SELECT).eq("public_id", publicId).limit(1),
    ) as unknown as Record<string, unknown>[]
    if (!rows.length) return null
    return this.hydrate(rows[0])
  }

  async getById(uuid: string): Promise<Complaint | null> {
    const rows = unwrap(
      await this.db.from("complaints").select(SELECT).eq("id", uuid).limit(1),
    ) as unknown as Record<string, unknown>[]
    if (!rows.length) return null
    return this.hydrate(rows[0])
  }

  async findByContact(mobile: string): Promise<Complaint[]> {
    const rows = unwrap(
      await this.db
        .from("complaints")
        .select(SELECT)
        .eq("contact_number", mobile)
        .order("created_at", { ascending: false }),
    ) as unknown as Record<string, unknown>[]
    return Promise.all(rows.map((r) => this.hydrate(r)))
  }

  private async hydrate(row: Record<string, unknown>): Promise<Complaint> {
    const id = row.id as string
    const history = unwrap(
      await this.db
        .from("complaint_history")
        .select("*")
        .eq("complaint_id", id)
        .order("created_at"),
    ) as ComplaintHistoryRow[]
    const images = unwrap(
      await this.db.from("complaint_images").select("*").eq("complaint_id", id),
    ) as ComplaintImageRow[]
    return toComplaint(row as unknown as ComplaintRow, {
      ...relationsFromRow(row),
      history,
      images,
    })
  }

  async create(input: Partial<ComplaintRow> & {
    title: string
    category: string
    description: string
  }): Promise<ComplaintRow> {
    return unwrap(await this.db.from("complaints").insert(input).select("*").single())
  }

  async update(uuid: string, patch: Partial<ComplaintRow>): Promise<ComplaintRow> {
    return unwrap(
      await this.db.from("complaints").update(patch).eq("id", uuid).select("*").single(),
    )
  }

  async setStatus(uuid: string, status: ComplaintStatus): Promise<void> {
    unwrap(await this.db.from("complaints").update({ status }).eq("id", uuid).select("id"))
  }

  async addHistory(entry: {
    complaint_id: string
    status: string
    remarks?: string | null
    officer_id?: string | null
    actor_name?: string | null
  }): Promise<void> {
    unwrap(await this.db.from("complaint_history").insert(entry).select("id"))
  }

  async addImage(entry: {
    complaint_id: string
    storage_path: string
    public_url?: string | null
  }): Promise<void> {
    unwrap(await this.db.from("complaint_images").insert(entry).select("id"))
  }

  async remove(uuid: string): Promise<void> {
    unwrap(await this.db.from("complaints").delete().eq("id", uuid).select("id"))
  }

  async setArchived(uuid: string, archived: boolean): Promise<void> {
    unwrap(await this.db.from("complaints").update({ archived }).eq("id", uuid).select("id"))
  }
}

export const complaintsRepository = new ComplaintsRepository()
