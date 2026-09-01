// =====================================================================
// NagrikSetu – shared domain types
// =====================================================================

// ---- Roles -----------------------------------------------------------
export type UserRole = "citizen" | "officer" | "admin" | "super_admin"
export const STAFF_ROLES: UserRole[] = ["officer", "admin", "super_admin"]
export const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"]

// ---- Complaint status (9-step lifecycle) -----------------------------
export type ComplaintStatus =
  | "Reported"
  | "Verified"
  | "Assigned"
  | "Officer Accepted"
  | "Work Started"
  | "Inspection"
  | "Resolved"
  | "Citizen Verified"
  | "Closed"

export const COMPLAINT_STATUSES: ComplaintStatus[] = [
  "Reported",
  "Verified",
  "Assigned",
  "Officer Accepted",
  "Work Started",
  "Inspection",
  "Resolved",
  "Citizen Verified",
  "Closed",
]

// Statuses that count as "open / pending".
export const PENDING_STATUSES: ComplaintStatus[] = COMPLAINT_STATUSES.filter(
  (s) => s !== "Resolved" && s !== "Citizen Verified" && s !== "Closed",
)
export const RESOLVED_STATUSES: ComplaintStatus[] = ["Resolved", "Citizen Verified", "Closed"]

// ---- Priority --------------------------------------------------------
export type ComplaintPriority = "Low" | "Medium" | "High" | "Critical"
export const PRIORITIES: ComplaintPriority[] = ["Low", "Medium", "High", "Critical"]

// ---- Categories ------------------------------------------------------
export type IssueCategory =
  | "Garbage"
  | "Road Damage"
  | "Water Leakage"
  | "Water Supply"
  | "Drainage"
  | "Street Lights"
  | "Public Toilets"
  | "Parks"
  | "Trees"
  | "Public Property Damage"
  | "Others"

export const ISSUE_CATEGORIES: IssueCategory[] = [
  "Garbage",
  "Road Damage",
  "Water Leakage",
  "Water Supply",
  "Drainage",
  "Street Lights",
  "Public Toilets",
  "Parks",
  "Trees",
  "Public Property Damage",
  "Others",
]

// Category -> department display name (server-side routing lives in DB).
export const CATEGORY_DEPARTMENT: Record<string, string> = {
  Garbage: "Solid Waste Department",
  "Street Lights": "Electrical Department",
  "Road Damage": "Public Works Department",
  "Public Property Damage": "Public Works Department",
  Drainage: "Drainage Department",
  "Water Leakage": "Water Department",
  "Water Supply": "Water Department",
  Trees: "Garden Department",
  Parks: "Garden Department",
  "Public Toilets": "Health Department",
  Others: "General Administration",
}

export type Gender = "Male" | "Female" | "Other" | "Prefer not to say"
export const GENDERS: Gender[] = ["Male", "Female", "Other", "Prefer not to say"]

// ---- Timeline event --------------------------------------------------
export interface ComplaintEvent {
  status: ComplaintStatus
  note?: string
  actor?: string
  at: string // ISO date
}

// ---- Complaint -------------------------------------------------------
export interface Complaint {
  uuid: string // DB primary key (internal)
  id: string // public display id, e.g. NGS-2026-000123
  title: string
  category: IssueCategory
  description: string
  area: string
  ward?: string
  landmark?: string
  lat?: number
  lng?: number
  contactNumber?: string
  priority: ComplaintPriority
  anonymous: boolean
  status: ComplaintStatus
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  assignedTo?: string // department / officer display name
  departmentId?: string
  officerId?: string
  reporterId?: string
  reporterName?: string
  archived: boolean
  imageUrls: string[]
  timeline: ComplaintEvent[]
}

// ---- Notifications ---------------------------------------------------
export interface Notification {
  id: string
  title: string
  body: string
  at: string
  read: boolean
  type?: string
  complaintId?: string
}

// ---- Content / misc --------------------------------------------------
export interface CommunityUpdate {
  id: string
  title: string
  summary: string
  date: string
  tag: string
}

export interface FaqItem {
  q: string
  a: string
}

// ---- Surveys ---------------------------------------------------------
export type SurveyQuestionType = "single" | "multi" | "rating" | "text"

export interface SurveyQuestion {
  id: string
  prompt: string
  type: SurveyQuestionType
  options?: string[]
  position?: number
  required?: boolean
}

export interface Survey {
  id: string
  title: string
  description: string
  active?: boolean
  questions: SurveyQuestion[]
}

export interface SurveyResponse {
  id: string
  surveyId: string
  gender?: Gender
  age?: number
  area?: string
  answers: Record<string, string | string[] | number>
  createdAt: string
}

// ---- Reference data --------------------------------------------------
export interface Ward {
  id: string
  name: string
  code?: string
}

export interface Area {
  id: string
  name: string
  wardId?: string
  lat?: number
  lng?: number
}

export interface Department {
  id: string
  name: string
  code?: string
  categories: string[]
}

export interface Officer {
  id: string
  profileId: string
  name: string
  departmentId?: string
  designation?: string
  active: boolean
}

// ---- User ------------------------------------------------------------
export interface AppUser {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  gender?: Gender
  age?: number
  wardId?: string
  areaId?: string
  avatarUrl?: string
  language?: string
}
