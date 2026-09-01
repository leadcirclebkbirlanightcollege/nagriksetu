// Reference data: wards, areas, departments, officers.
import { BaseRepository, unwrap } from "./base.repository"
import { toArea, toDepartment, toOfficer, toWard } from "../lib/mappers"
import type { Area, Department, Officer, Ward } from "../types"

class ReferenceRepository extends BaseRepository {
  async wards(): Promise<Ward[]> {
    const rows = unwrap(await this.db.from("wards").select("*").order("name"))
    return rows.map(toWard)
  }

  async areas(): Promise<Area[]> {
    const rows = unwrap(await this.db.from("areas").select("*").order("name"))
    return rows.map(toArea)
  }

  async departments(): Promise<Department[]> {
    const rows = unwrap(await this.db.from("departments").select("*").order("name"))
    return rows.map(toDepartment)
  }

  async officers(): Promise<Officer[]> {
    const rows = unwrap(
      await this.db
        .from("officers")
        .select("*, profiles(full_name)")
        .order("created_at"),
    )
    return (rows as unknown as Parameters<typeof toOfficer>[0][]).map(toOfficer)
  }
}

export const referenceRepository = new ReferenceRepository()
