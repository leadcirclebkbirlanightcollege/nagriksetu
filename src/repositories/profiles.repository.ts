import { BaseRepository, unwrap } from "./base.repository"
import { toUser } from "../lib/mappers"
import type { AppUser } from "../types"
import type { ProfileRow } from "../types/db"

class ProfilesRepository extends BaseRepository {
  async get(id: string): Promise<AppUser | null> {
    const rows = unwrap(await this.db.from("profiles").select("*").eq("id", id).limit(1))
    return rows.length ? toUser(rows[0]) : null
  }

  async list(): Promise<AppUser[]> {
    const rows = unwrap(await this.db.from("profiles").select("*").order("created_at"))
    return rows.map(toUser)
  }

  async update(id: string, patch: Partial<ProfileRow>): Promise<AppUser> {
    const row = unwrap(
      await this.db.from("profiles").update(patch).eq("id", id).select("*").single(),
    )
    return toUser(row)
  }

  async setRole(id: string, role: ProfileRow["role"]): Promise<void> {
    unwrap(await this.db.from("profiles").update({ role }).eq("id", id).select("id"))
  }
}

export const profilesRepository = new ProfilesRepository()
