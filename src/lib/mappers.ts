// Pure functions mapping Supabase rows -> domain models. No side effects.
import type {
  AppUser,
  Area,
  Complaint,
  ComplaintEvent,
  ComplaintPriority,
  ComplaintStatus,
  Department,
  Gender,
  IssueCategory,
  Notification,
  Officer,
  Survey,
  SurveyQuestion,
  SurveyResponse,
  UserRole,
  Ward,
} from "../types"
import type {
  AreaRow,
  ComplaintHistoryRow,
  ComplaintImageRow,
  ComplaintRow,
  DepartmentRow,
  NotificationRow,
  OfficerRow,
  ProfileRow,
  SurveyQuestionRow,
  SurveyResponseRow,
  SurveyRow,
  WardRow,
} from "../types/db"

export function toEvent(row: ComplaintHistoryRow): ComplaintEvent {
  return {
    status: row.status as ComplaintStatus,
    note: row.remarks ?? undefined,
    actor: row.actor_name ?? undefined,
    at: row.created_at,
  }
}

export interface ComplaintRelations {
  history?: ComplaintHistoryRow[]
  images?: ComplaintImageRow[]
  departmentName?: string
  officerName?: string
  reporterName?: string
  wardName?: string
}

export function toComplaint(row: ComplaintRow, rel: ComplaintRelations = {}): Complaint {
  const timeline = (rel.history ?? [])
    .slice()
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map(toEvent)
  const imageUrls = (rel.images ?? [])
    .map((i) => i.public_url ?? "")
    .filter(Boolean)
  return {
    uuid: row.id,
    id: row.public_id ?? row.id,
    title: row.title,
    category: row.category as IssueCategory,
    description: row.description,
    area: row.area ?? "",
    ward: rel.wardName,
    landmark: row.landmark ?? undefined,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    contactNumber: row.contact_number ?? undefined,
    priority: row.priority as ComplaintPriority,
    anonymous: row.anonymous,
    status: row.status as ComplaintStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at ?? undefined,
    assignedTo: rel.officerName ?? rel.departmentName,
    departmentId: row.department_id ?? undefined,
    officerId: row.officer_id ?? undefined,
    reporterId: row.reporter_id ?? undefined,
    reporterName: rel.reporterName,
    archived: row.archived,
    imageUrls,
    timeline,
  }
}

export function toNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    title: row.title,
    body: row.body ?? "",
    at: row.created_at,
    read: row.read,
    type: row.type ?? undefined,
    complaintId: row.complaint_id ?? undefined,
  }
}

export function toUser(row: ProfileRow): AppUser {
  return {
    id: row.id,
    name: row.full_name ?? row.email ?? "Citizen",
    email: row.email ?? "",
    role: row.role as UserRole,
    phone: row.phone ?? undefined,
    gender: (row.gender as Gender) ?? undefined,
    age: row.age ?? undefined,
    wardId: row.ward_id ?? undefined,
    areaId: row.area_id ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    language: row.language,
  }
}

export function toWard(row: WardRow): Ward {
  return { id: row.id, name: row.name, code: row.code ?? undefined }
}

export function toArea(row: AreaRow): Area {
  return {
    id: row.id,
    name: row.name,
    wardId: row.ward_id ?? undefined,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
  }
}

export function toDepartment(row: DepartmentRow): Department {
  return { id: row.id, name: row.name, code: row.code ?? undefined, categories: row.categories ?? [] }
}

export function toOfficer(row: OfficerRow & { profiles?: { full_name: string | null } }): Officer {
  return {
    id: row.id,
    profileId: row.profile_id,
    name: row.profiles?.full_name ?? "Officer",
    departmentId: row.department_id ?? undefined,
    designation: row.designation ?? undefined,
    active: row.active,
  }
}

function asStringArray(json: unknown): string[] {
  return Array.isArray(json) ? json.map((v) => String(v)) : []
}

export function toSurvey(row: SurveyRow, questions: SurveyQuestionRow[] = []): Survey {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    active: row.active,
    questions: questions
      .slice()
      .sort((a, b) => a.position - b.position)
      .map(
        (q): SurveyQuestion => ({
          id: q.id,
          prompt: q.prompt,
          type: q.type,
          options: asStringArray(q.options),
          position: q.position,
          required: q.required,
        }),
      ),
  }
}

export function toSurveyResponse(row: SurveyResponseRow, areaName?: string): SurveyResponse {
  return {
    id: row.id,
    surveyId: row.survey_id,
    gender: (row.gender as Gender) ?? undefined,
    age: row.age ?? undefined,
    area: areaName,
    answers: (row.answers as SurveyResponse["answers"]) ?? {},
    createdAt: row.created_at,
  }
}
