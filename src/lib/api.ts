import type { Complaint, ComplaintPriority, ComplaintStatus, AppUser, UserRole } from "../types"

const TOKEN_KEY = "ns_auth_token"

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(path, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMsg = `Request failed (${response.status})`
    try {
      const data = await response.json()
      errorMsg = data.error || errorMsg
    } catch {
      // ignore
    }
    throw new Error(errorMsg)
  }

  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>
  }
  return response.text() as unknown as Promise<T>
}

// -------------------------------------------------------------
// Auth API
// -------------------------------------------------------------
export interface AuthResponse {
  token: string
  user: AppUser
}

export async function apiRegister(data: {
  name: string
  email: string
  password: string
  phone?: string
  ward?: string
  address?: string
}): Promise<AuthResponse> {
  const res = await request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
  setToken(res.token)
  return res
}

export async function apiLogin(email: string, password: string, role?: UserRole): Promise<AuthResponse> {
  const res = await request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
  })
  setToken(res.token)
  return res
}

export async function apiGetMe(): Promise<AppUser> {
  return request<AppUser>("/api/auth/me")
}

export async function apiUpdateProfile(data: {
  name?: string
  phone?: string
  ward?: string
  address?: string
  gender?: string
}): Promise<AppUser> {
  return request<AppUser>("/api/auth/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function apiForgotPassword(email: string): Promise<{ message: string }> {
  return request<{ message: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function apiResetPassword(email: string, password: string): Promise<{ message: string }> {
  return request<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

// -------------------------------------------------------------
// File Upload API
// -------------------------------------------------------------
export async function apiUploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData()
  for (const file of files) {
    formData.append("images", file)
  }
  const res = await request<{ urls: string[] }>("/api/upload", {
    method: "POST",
    body: formData,
  })
  return res.urls
}

// -------------------------------------------------------------
// Complaints API
// -------------------------------------------------------------
export interface ComplaintFilters {
  status?: string
  category?: string
  area?: string
  ward?: string
  priority?: string
  departmentId?: string
  officerId?: string
  reporterId?: string
  search?: string
  archived?: boolean
  fromDate?: string
  toDate?: string
}

export async function apiListComplaints(filters: ComplaintFilters = {}): Promise<Complaint[]> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "All") {
      params.append(key, String(value))
    }
  })
  const qs = params.toString()
  return request<Complaint[]>(`/api/complaints${qs ? `?${qs}` : ""}`)
}

export async function apiGetComplaint(id: string): Promise<Complaint> {
  return request<Complaint>(`/api/complaints/${encodeURIComponent(id)}`)
}

export async function apiTrackComplaint(query: string): Promise<Complaint[]> {
  return request<Complaint[]>(`/api/complaints/track/${encodeURIComponent(query.trim())}`)
}

export interface CreateComplaintPayload {
  title: string
  category: string
  description: string
  area: string
  ward?: string
  landmark?: string
  lat?: number
  lng?: number
  imageUrls?: string[]
  contactNumber?: string
  priority?: ComplaintPriority
  anonymous?: boolean
}

export async function apiCreateComplaint(payload: CreateComplaintPayload): Promise<Complaint> {
  return request<Complaint>("/api/complaints", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function apiUpdateStatus(
  id: string,
  status: ComplaintStatus,
  remarks?: string,
  assignedTo?: string,
  officerId?: string
): Promise<Complaint> {
  return request<Complaint>(`/api/complaints/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, remarks, assignedTo, officerId }),
  })
}

export async function apiAssignComplaint(
  id: string,
  payload: { assignedTo?: string; officerId?: string; departmentId?: string; departmentName?: string; note?: string }
): Promise<Complaint> {
  return request<Complaint>(`/api/complaints/${encodeURIComponent(id)}/assign`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function apiUpdatePriority(id: string, priority: ComplaintPriority): Promise<Complaint> {
  return request<Complaint>(`/api/complaints/${encodeURIComponent(id)}/priority`, {
    method: "PATCH",
    body: JSON.stringify({ priority }),
  })
}

export async function apiDeleteComplaint(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/complaints/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
}

// -------------------------------------------------------------
// Analytics API
// -------------------------------------------------------------
export interface AnalyticsData {
  total: number
  resolved: number
  pending: number
  todaysCount: number
  resolutionRate: number
  avgResolutionDays: number
  categoryStats: Array<{ category: string; count: number }>
  areaStats: Array<{ area: string; reported: number; resolved: number }>
  monthlyTrends: Array<{ month: string; reported: number; resolved: number }>
  departmentPerformance: Array<{
    id: string
    name: string
    code: string
    total: number
    resolved: number
    pending: number
    rate: number
  }>
  heatmapPoints: Array<{
    id: string
    title: string
    category: string
    status: string
    area: string
    lat: number
    lng: number
    weight: number
  }>
}

export async function apiGetAnalytics(): Promise<AnalyticsData> {
  return request<AnalyticsData>("/api/analytics")
}

// -------------------------------------------------------------
// Notifications API
// -------------------------------------------------------------
export interface AppNotification {
  id: string
  userId?: string | null
  title: string
  body: string
  type: string
  complaintId?: string | null
  read: boolean
  createdAt: string
}

export async function apiGetNotifications(): Promise<AppNotification[]> {
  return request<AppNotification[]>("/api/notifications")
}

export async function apiMarkNotificationRead(id: string): Promise<void> {
  await request(`/api/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH" })
}

export async function apiMarkAllNotificationsRead(): Promise<void> {
  await request("/api/notifications/read-all", { method: "PATCH" })
}

// -------------------------------------------------------------
// Feedback API
// -------------------------------------------------------------
export interface AppFeedback {
  id: string
  userId?: string | null
  userName?: string | null
  complaintId?: string | null
  rating: number
  comment?: string | null
  suggestion?: string | null
  createdAt: string
}

export async function apiGetFeedback(): Promise<AppFeedback[]> {
  return request<AppFeedback[]>("/api/feedback")
}

export async function apiSubmitFeedback(payload: {
  rating: number
  comment?: string
  suggestion?: string
  complaintId?: string
}): Promise<AppFeedback> {
  return request<AppFeedback>("/api/feedback", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// -------------------------------------------------------------
// Surveys API
// -------------------------------------------------------------
export interface SurveyQuestion {
  id: string
  prompt: string
  type: "single" | "multi" | "rating" | "text"
  options?: string[]
  required: boolean
}

export interface Survey {
  id: string
  title: string
  description: string
  active: boolean
  questions: SurveyQuestion[]
  createdAt: string
}

export interface SurveyAnalyticsData {
  totalResponses: number
  topProblems: Array<{ problem: string; responses: number }>
  satisfaction: Array<{ name: string; value: number }>
}

export async function apiGetSurveys(): Promise<Survey[]> {
  return request<Survey[]>("/api/surveys")
}

export async function apiGetSurvey(id: string): Promise<Survey> {
  return request<Survey>(`/api/surveys/${encodeURIComponent(id)}`)
}

export async function apiSubmitSurveyResponse(
  surveyId: string,
  answers: Record<string, string | string[] | number>
): Promise<{ id: string }> {
  return request<{ id: string }>(`/api/surveys/${encodeURIComponent(surveyId)}/responses`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  })
}

export async function apiGetSurveyAnalytics(): Promise<SurveyAnalyticsData> {
  return request<SurveyAnalyticsData>("/api/surveys/analytics/aggregate")
}

// -------------------------------------------------------------
// Admin Management API
// -------------------------------------------------------------
export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: "Active" | "Suspended"
  phone?: string
  ward?: string
  complaintsCount: number
  createdAt: string
}

export interface AdminAreaStat {
  id: string
  area: string
  ward: string
  reported: number
  resolved: number
  pending: number
  lat: number
  lng: number
}

export interface ActivityLog {
  id: string
  actorId?: string | null
  actorName: string
  action: string
  entity: string
  entityId?: string | null
  createdAt: string
}

export async function apiGetAdminUsers(): Promise<AdminUser[]> {
  return request<AdminUser[]>("/api/admin/users")
}

export async function apiUpdateAdminUser(
  id: string,
  patch: { role?: UserRole; status?: "Active" | "Suspended" }
): Promise<AdminUser> {
  return request<AdminUser>(`/api/admin/users/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  })
}

export async function apiGetAdminCategories(): Promise<string[]> {
  return request<string[]>("/api/admin/categories")
}

export async function apiAddAdminCategory(name: string): Promise<string[]> {
  return request<string[]>("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  })
}

export async function apiRemoveAdminCategory(name: string): Promise<string[]> {
  return request<string[]>(`/api/admin/categories/${encodeURIComponent(name)}`, {
    method: "DELETE",
  })
}

export async function apiGetAdminAreas(): Promise<AdminAreaStat[]> {
  return request<AdminAreaStat[]>("/api/admin/areas")
}

export async function apiGetAdminActivityLogs(): Promise<ActivityLog[]> {
  return request<ActivityLog[]>("/api/admin/activity-logs")
}

export function getAdminExportCsvUrl(): string {
  return "/api/admin/export"
}
