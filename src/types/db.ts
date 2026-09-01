// =====================================================================
// Supabase database types (mirror supabase/schema.sql).
// Regenerate with:
//   npx supabase gen types typescript --project-id <ref> > src/types/db.ts
// =====================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type Timestamps = { created_at: string }

export interface ProfileRow extends Timestamps {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: "citizen" | "officer" | "admin" | "super_admin"
  gender: string | null
  age: number | null
  ward_id: string | null
  area_id: string | null
  avatar_url: string | null
  language: string
  updated_at: string
}

export interface ComplaintRow extends Timestamps {
  id: string
  public_id: string | null
  title: string
  category: string
  description: string
  area: string | null
  area_id: string | null
  ward_id: string | null
  landmark: string | null
  lat: number | null
  lng: number | null
  contact_number: string | null
  priority: "Low" | "Medium" | "High" | "Critical"
  anonymous: boolean
  status: string
  reporter_id: string | null
  department_id: string | null
  officer_id: string | null
  archived: boolean
  updated_at: string
  resolved_at: string | null
}

export interface ComplaintHistoryRow extends Timestamps {
  id: string
  complaint_id: string
  status: string
  remarks: string | null
  officer_id: string | null
  actor_name: string | null
}

export interface ComplaintImageRow extends Timestamps {
  id: string
  complaint_id: string
  storage_path: string
  public_url: string | null
}

export interface DepartmentRow extends Timestamps {
  id: string
  name: string
  code: string | null
  categories: string[]
  email: string | null
  phone: string | null
}

export interface OfficerRow extends Timestamps {
  id: string
  profile_id: string
  department_id: string | null
  designation: string | null
  active: boolean
}

export interface WardRow extends Timestamps {
  id: string
  name: string
  code: string | null
}

export interface AreaRow extends Timestamps {
  id: string
  name: string
  ward_id: string | null
  lat: number | null
  lng: number | null
}

export interface NotificationRow extends Timestamps {
  id: string
  user_id: string | null
  role_target: string | null
  title: string
  body: string | null
  type: string | null
  complaint_id: string | null
  read: boolean
}

export interface FeedbackRow extends Timestamps {
  id: string
  user_id: string | null
  complaint_id: string | null
  rating: number
  comment: string | null
  suggestion: string | null
}

export interface SurveyRow extends Timestamps {
  id: string
  title: string
  description: string | null
  active: boolean
  created_by: string | null
}

export interface SurveyQuestionRow {
  id: string
  survey_id: string
  prompt: string
  type: "single" | "multi" | "rating" | "text"
  options: Json
  position: number
  required: boolean
}

export interface SurveyResponseRow extends Timestamps {
  id: string
  survey_id: string
  respondent: string | null
  gender: string | null
  age: number | null
  area_id: string | null
  answers: Json
}

export interface ActivityLogRow extends Timestamps {
  id: string
  actor_id: string | null
  actor_name: string | null
  action: string
  entity: string | null
  entity_id: string | null
  meta: Json
}

type TableConfig<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row
  Insert: Insert
  Update: Update
}

export interface Database {
  public: {
    Tables: {
      profiles: TableConfig<ProfileRow, Partial<ProfileRow> & { id: string }>
      complaints: TableConfig<
        ComplaintRow,
        Partial<ComplaintRow> & { title: string; category: string; description: string }
      >
      complaint_history: TableConfig<
        ComplaintHistoryRow,
        Partial<ComplaintHistoryRow> & { complaint_id: string; status: string }
      >
      complaint_images: TableConfig<
        ComplaintImageRow,
        Partial<ComplaintImageRow> & { complaint_id: string; storage_path: string }
      >
      departments: TableConfig<DepartmentRow, Partial<DepartmentRow> & { name: string }>
      officers: TableConfig<OfficerRow, Partial<OfficerRow> & { profile_id: string }>
      wards: TableConfig<WardRow, Partial<WardRow> & { name: string }>
      areas: TableConfig<AreaRow, Partial<AreaRow> & { name: string }>
      notifications: TableConfig<
        NotificationRow,
        Partial<NotificationRow> & { title: string }
      >
      feedback: TableConfig<FeedbackRow, Partial<FeedbackRow> & { rating: number }>
      surveys: TableConfig<SurveyRow, Partial<SurveyRow> & { title: string }>
      survey_questions: TableConfig<
        SurveyQuestionRow,
        Partial<SurveyQuestionRow> & { survey_id: string; prompt: string }
      >
      survey_responses: TableConfig<
        SurveyResponseRow,
        Partial<SurveyResponseRow> & { survey_id: string }
      >
      activity_logs: TableConfig<
        ActivityLogRow,
        Partial<ActivityLogRow> & { action: string }
      >
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
