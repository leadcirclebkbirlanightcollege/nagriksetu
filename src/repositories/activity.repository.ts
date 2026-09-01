import { BaseRepository, unwrap } from "./base.repository"
import type { ActivityLogRow } from "../types/db"

export interface ActivityLog {
  id: string
  actorName?: string
  action: string
  entity?: string
  entityId?: string
  at: string
}

function toLog(row: ActivityLogRow): ActivityLog {
  return {
    id: row.id,
    actorName: row.actor_name ?? undefined,
    action: row.action,
    entity: row.entity ?? undefined,
    entityId: row.entity_id ?? undefined,
    at: row.created_at,
  }
}

class ActivityRepository extends BaseRepository {
  async list(limit = 100): Promise<ActivityLog[]> {
    const rows = unwrap(
      await this.db
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit),
    )
    return rows.map(toLog)
  }

  async record(entry: {
    actor_id?: string | null
    actor_name?: string | null
    action: string
    entity?: string | null
    entity_id?: string | null
  }): Promise<void> {
    try {
      unwrap(await this.db.from("activity_logs").insert(entry).select("id"))
    } catch {
      // Non-critical: never let logging break a user action.
    }
  }
}

export const activityRepository = new ActivityRepository()
