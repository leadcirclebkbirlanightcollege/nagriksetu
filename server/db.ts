import fs from "fs"
import path from "path"
import bcrypt from "bcryptjs"

export interface UserRecord {
  id: string
  name: string
  email: string
  passwordHash: string
  role: "citizen" | "officer" | "admin" | "super_admin"
  phone?: string
  ward?: string
  address?: string
  gender?: "Male" | "Female" | "Other" | "Prefer not to say"
  status: "Active" | "Suspended"
  createdAt: string
  updatedAt: string
}

export interface ComplaintTimelineEntry {
  status: string
  at: string
  actor: string
  note?: string
}

export interface ComplaintRecord {
  uuid: string
  id: string // e.g. "NS-2026-000412"
  title: string
  category: string
  description: string
  area: string
  ward?: string
  landmark?: string
  lat?: number
  lng?: number
  imageUrls: string[]
  contactNumber?: string
  priority: "Low" | "Medium" | "High" | "Critical"
  anonymous: boolean
  archived: boolean
  status: "Reported" | "Verified" | "Assigned" | "Officer Accepted" | "Work Started" | "Inspection" | "Resolved" | "Citizen Verified" | "Closed"
  reporterId?: string | null
  reporterName?: string | null
  departmentId?: string | null
  departmentName?: string | null
  officerId?: string | null
  assignedTo?: string | null
  createdAt: string
  updatedAt: string
  resolvedAt?: string | null
  timeline: ComplaintTimelineEntry[]
}

export interface NotificationRecord {
  id: string
  userId?: string | null
  roleTarget?: "citizen" | "officer" | "admin" | "super_admin" | null
  title: string
  body: string
  type: string
  complaintId?: string | null
  read: boolean
  createdAt: string
}

export interface FeedbackRecord {
  id: string
  userId?: string | null
  userName?: string | null
  complaintId?: string | null
  rating: number // 1 to 5
  comment?: string | null
  suggestion?: string | null
  createdAt: string
}

export interface SurveyQuestion {
  id: string
  prompt: string
  type: "single" | "multi" | "rating" | "text"
  options?: string[]
  required: boolean
}

export interface SurveyRecord {
  id: string
  title: string
  description: string
  active: boolean
  questions: SurveyQuestion[]
  createdAt: string
}

export interface SurveyResponseRecord {
  id: string
  surveyId: string
  respondentId?: string | null
  respondentName?: string | null
  answers: Record<string, string | string[] | number>
  createdAt: string
}

export interface DepartmentRecord {
  id: string
  name: string
  code: string
  categories: string[]
  email?: string
  phone?: string
}

export interface WardRecord {
  id: string
  name: string
  code: string
}

export interface AreaRecord {
  id: string
  name: string
  ward: string
  lat: number
  lng: number
}

export interface ActivityLogRecord {
  id: string
  actorId?: string | null
  actorName: string
  action: string
  entity: string
  entityId?: string | null
  meta?: Record<string, unknown>
  createdAt: string
}

export interface DatabaseSchema {
  users: UserRecord[]
  complaints: ComplaintRecord[]
  complaintSeq: number
  notifications: NotificationRecord[]
  feedback: FeedbackRecord[]
  surveys: SurveyRecord[]
  surveyResponses: SurveyResponseRecord[]
  departments: DepartmentRecord[]
  wards: WardRecord[]
  areas: AreaRecord[]
  categories: string[]
  activityLogs: ActivityLogRecord[]
}

const DATA_DIR = path.join(process.cwd(), "data")
const DB_FILE = path.join(DATA_DIR, "nagriksetu.json")

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Initial seed data with authentic Indian municipal departments, wards, and admin accounts
function getInitialData(): DatabaseSchema {
  const adminPasswordHash = bcrypt.hashSync("Admin@12345", 10)
  const officerPasswordHash = bcrypt.hashSync("Officer@12345", 10)
  const citizenPasswordHash = bcrypt.hashSync("Citizen@12345", 10)

  const now = new Date().toISOString()
  const pastDate1 = new Date(Date.now() - 5 * 86400000).toISOString()
  const pastDate2 = new Date(Date.now() - 12 * 86400000).toISOString()
  const pastDate3 = new Date(Date.now() - 2 * 86400000).toISOString()

  return {
    complaintSeq: 415,
    users: [
      {
        id: "usr-admin-01",
        name: "Municipal Chief Administrator",
        email: "admin@nagriksetu.gov.in",
        passwordHash: adminPasswordHash,
        role: "admin",
        phone: "9820011223",
        ward: "Central Ward 01",
        status: "Active",
        createdAt: pastDate2,
        updatedAt: now,
      },
      {
        id: "usr-officer-01",
        name: "Shri Rajesh Sharma (Sanitation Officer)",
        email: "sanitation@nagriksetu.gov.in",
        passwordHash: officerPasswordHash,
        role: "officer",
        phone: "9820044556",
        ward: "Ward 12",
        status: "Active",
        createdAt: pastDate2,
        updatedAt: now,
      },
      {
        id: "usr-officer-02",
        name: "Smt. Sunita Patil (Electrical Officer)",
        email: "electrical@nagriksetu.gov.in",
        passwordHash: officerPasswordHash,
        role: "officer",
        phone: "9820077889",
        ward: "Ward 08",
        status: "Active",
        createdAt: pastDate2,
        updatedAt: now,
      },
      {
        id: "usr-citizen-01",
        name: "Aarav Sharma",
        email: "aarav@example.com",
        passwordHash: citizenPasswordHash,
        role: "citizen",
        phone: "9800000010",
        ward: "Ward 12",
        address: "Flat 402, Shiv Darshan CHS, Shivaji Nagar",
        status: "Active",
        createdAt: pastDate2,
        updatedAt: now,
      },
      {
        id: "usr-citizen-02",
        name: "Meera Nair",
        email: "meera@example.com",
        passwordHash: citizenPasswordHash,
        role: "citizen",
        phone: "9800000020",
        ward: "Ward 08",
        address: "House 12, Gandhi Road Extension",
        status: "Active",
        createdAt: pastDate2,
        updatedAt: now,
      },
    ],
    categories: [
      "Garbage",
      "Street Lights",
      "Road Damage",
      "Water Supply",
      "Drainage",
      "Parks & Open Spaces",
      "Traffic & Parking",
      "Stray Animals",
      "Encroachment",
      "Noise Pollution",
      "Other",
    ],
    departments: [
      {
        id: "dept-swm",
        name: "Solid Waste Management Dept.",
        code: "SWM",
        categories: ["Garbage", "Stray Animals"],
        email: "swm@nagriksetu.gov.in",
        phone: "022-22620101",
      },
      {
        id: "dept-elec",
        name: "Electrical & Street Lighting Dept.",
        code: "ELEC",
        categories: ["Street Lights"],
        email: "electrical@nagriksetu.gov.in",
        phone: "022-22620102",
      },
      {
        id: "dept-roads",
        name: "Roads & Infrastructure Dept.",
        code: "ROADS",
        categories: ["Road Damage", "Traffic & Parking", "Encroachment"],
        email: "roads@nagriksetu.gov.in",
        phone: "022-22620103",
      },
      {
        id: "dept-water",
        name: "Hydraulic Engineer & Water Supply Dept.",
        code: "WATER",
        categories: ["Water Supply"],
        email: "water@nagriksetu.gov.in",
        phone: "022-22620104",
      },
      {
        id: "dept-drain",
        name: "Storm Water Drains & Sewerage Dept.",
        code: "DRAIN",
        categories: ["Drainage"],
        email: "drainage@nagriksetu.gov.in",
        phone: "022-22620105",
      },
      {
        id: "dept-parks",
        name: "Gardens & Tree Authority Dept.",
        code: "PARKS",
        categories: ["Parks & Open Spaces", "Noise Pollution", "Other"],
        email: "gardens@nagriksetu.gov.in",
        phone: "022-22620106",
      },
    ],
    wards: [
      { id: "ward-01", name: "Ward 01 – Fort & Colaba", code: "W01" },
      { id: "ward-04", name: "Ward 04 – Byculla & Parel", code: "W04" },
      { id: "ward-08", name: "Ward 08 – Gandhi Road & Dadar", code: "W08" },
      { id: "ward-12", name: "Ward 12 – Shivaji Nagar & Kurla", code: "W12" },
      { id: "ward-15", name: "Ward 15 – Nehru Colony & Ghatkopar", code: "W15" },
      { id: "ward-18", name: "Ward 18 – Andheri East", code: "W18" },
      { id: "ward-21", name: "Ward 21 – Borivali West", code: "W21" },
    ],
    areas: [
      { id: "area-01", name: "Shivaji Nagar", ward: "Ward 12", lat: 19.079, lng: 72.881 },
      { id: "area-02", name: "Gandhi Road", ward: "Ward 08", lat: 19.071, lng: 72.874 },
      { id: "area-03", name: "Nehru Colony", ward: "Ward 15", lat: 19.065, lng: 72.89 },
      { id: "area-04", name: "Subzi Mandi", ward: "Ward 12", lat: 19.082, lng: 72.879 },
      { id: "area-05", name: "Station Road", ward: "Ward 18", lat: 19.113, lng: 72.869 },
      { id: "area-06", name: "Market Yard", ward: "Ward 04", lat: 19.012, lng: 72.845 },
    ],
    complaints: [
      {
        uuid: "c-1001",
        id: "NS-2026-000412",
        title: "Overflowing community garbage bin near vegetable market",
        category: "Garbage",
        description: "The community garbage bin outside the vegetable market has not been cleared for four days and is overflowing onto the main road causing severe stench and stray animal menace.",
        area: "Ward 12 – Shivaji Nagar",
        ward: "Ward 12",
        landmark: "Opposite Subzi Mandi, Main Road",
        lat: 19.079,
        lng: 72.881,
        imageUrls: [],
        contactNumber: "9800000010",
        priority: "High",
        anonymous: false,
        archived: false,
        status: "Work Started",
        reporterId: "usr-citizen-01",
        reporterName: "Aarav Sharma",
        departmentId: "dept-swm",
        departmentName: "Solid Waste Management Dept.",
        officerId: "usr-officer-01",
        assignedTo: "Shri Rajesh Sharma (Sanitation Officer)",
        createdAt: pastDate1,
        updatedAt: now,
        timeline: [
          { status: "Reported", at: pastDate1, actor: "Aarav Sharma (Citizen)" },
          { status: "Verified", at: new Date(Date.now() - 4 * 86400000).toISOString(), actor: "Municipal Control Room", note: "Inspection verified severity high." },
          { status: "Assigned", at: new Date(Date.now() - 3 * 86400000).toISOString(), actor: "Admin", note: "Assigned to Solid Waste Management Dept." },
          { status: "Work Started", at: new Date(Date.now() - 1 * 86400000).toISOString(), actor: "Shri Rajesh Sharma", note: "Sanitation compaction vehicle dispatched." },
        ],
      },
      {
        uuid: "c-1002",
        id: "NS-2026-000388",
        title: "Broken street lights on Gandhi Road bus stop stretch",
        category: "Street Lights",
        description: "Two street lights near the bus stop have been non-functional for a week, making the whole stretch completely dark and unsafe for commuters at night.",
        area: "Ward 08 – Gandhi Road",
        ward: "Ward 08",
        landmark: "Near City Bus Stop, Gandhi Road",
        lat: 19.071,
        lng: 72.874,
        imageUrls: [],
        contactNumber: "9800000020",
        priority: "Medium",
        anonymous: false,
        archived: false,
        status: "Resolved",
        reporterId: "usr-citizen-02",
        reporterName: "Meera Nair",
        departmentId: "dept-elec",
        departmentName: "Electrical & Street Lighting Dept.",
        officerId: "usr-officer-02",
        assignedTo: "Smt. Sunita Patil (Electrical Officer)",
        createdAt: pastDate2,
        updatedAt: pastDate1,
        resolvedAt: pastDate1,
        timeline: [
          { status: "Reported", at: pastDate2, actor: "Meera Nair (Citizen)" },
          { status: "Verified", at: new Date(Date.now() - 10 * 86400000).toISOString(), actor: "Municipal Control Room" },
          { status: "Assigned", at: new Date(Date.now() - 8 * 86400000).toISOString(), actor: "Admin", note: "Assigned to Electrical Dept." },
          { status: "Work Started", at: new Date(Date.now() - 6 * 86400000).toISOString(), actor: "Smt. Sunita Patil" },
          { status: "Resolved", at: pastDate1, actor: "Smt. Sunita Patil", note: "New LED fixture and underground cable replaced. Fully illuminated." },
        ],
      },
      {
        uuid: "c-1003",
        id: "NS-2026-000355",
        title: "Deep pothole causing traffic and skidding near school gate",
        category: "Road Damage",
        description: "A deep 2-foot pothole has formed after the monsoon rains right at the entrance of Adarsh School, causing two-wheeler skidding during morning hours.",
        area: "Ward 15 – Nehru Colony",
        ward: "Ward 15",
        landmark: "Adarsh School Gate No. 2",
        lat: 19.065,
        lng: 72.89,
        imageUrls: [],
        contactNumber: "9820011223",
        priority: "Critical",
        anonymous: false,
        archived: false,
        status: "Verified",
        reporterId: "usr-citizen-01",
        reporterName: "Aarav Sharma",
        departmentId: "dept-roads",
        departmentName: "Roads & Infrastructure Dept.",
        createdAt: pastDate3,
        updatedAt: now,
        timeline: [
          { status: "Reported", at: pastDate3, actor: "Aarav Sharma (Citizen)" },
          { status: "Verified", at: now, actor: "Municipal Control Room", note: "Prioritized for quick bitumen cold-mix patch." },
        ],
      },
    ],
    notifications: [
      {
        id: "notif-01",
        userId: "usr-citizen-01",
        title: "Complaint NS-2026-000412 status updated",
        body: "Status changed to Work Started. Sanitation vehicle dispatched to Ward 12.",
        type: "status_update",
        complaintId: "c-1001",
        read: false,
        createdAt: now,
      },
      {
        id: "notif-02",
        userId: "usr-citizen-02",
        title: "Complaint NS-2026-000388 Resolved",
        body: "Your street lighting issue has been resolved by Electrical Dept.",
        type: "status_update",
        complaintId: "c-1002",
        read: true,
        createdAt: pastDate1,
      },
    ],
    feedback: [
      {
        id: "fb-01",
        userId: "usr-citizen-02",
        userName: "Meera Nair",
        complaintId: "c-1002",
        rating: 5,
        comment: "Excellent response time! The street lights on Gandhi Road are working perfectly now.",
        suggestion: "Keep up the prompt action for public safety.",
        createdAt: pastDate1,
      },
    ],
    surveys: [
      {
        id: "survey-civic-2026",
        title: "Citizen Civic Priorities Survey 2026",
        description: "Help the municipal administration prioritize ward budgets and infrastructure improvements.",
        active: true,
        createdAt: pastDate2,
        questions: [
          {
            id: "q1",
            prompt: "Which civic issue needs the most urgent attention in your ward?",
            type: "single",
            options: ["Garbage Management", "Road & Pothole Repair", "Water Supply Quality", "Drainage & Sewage", "Street Lighting"],
            required: true,
          },
          {
            id: "q2",
            prompt: "What civic facilities do you use most frequently?",
            type: "multi",
            options: ["Public Parks & Playgrounds", "Community Health Centers", "Public Libraries", "Municipal Markets"],
            required: true,
          },
          {
            id: "q3",
            prompt: "How satisfied are you with overall municipal response times?",
            type: "rating",
            required: true,
          },
          {
            id: "q4",
            prompt: "Any specific suggestions for municipal digital services?",
            type: "text",
            required: false,
          },
        ],
      },
    ],
    surveyResponses: [
      {
        id: "resp-01",
        surveyId: "survey-civic-2026",
        respondentId: "usr-citizen-01",
        respondentName: "Aarav Sharma",
        answers: {
          q1: "Garbage Management",
          q2: ["Public Parks & Playgrounds", "Municipal Markets"],
          q3: 4,
          q4: "Please add WhatsApp status updates for complaints.",
        },
        createdAt: pastDate1,
      },
      {
        id: "resp-02",
        surveyId: "survey-civic-2026",
        respondentId: "usr-citizen-02",
        respondentName: "Meera Nair",
        answers: {
          q1: "Street Lighting",
          q2: ["Public Parks & Playgrounds"],
          q3: 5,
          q4: "NagrikSetu portal is very easy to use.",
        },
        createdAt: pastDate1,
      },
    ],
    activityLogs: [
      {
        id: "act-01",
        actorName: "Municipal Control Room",
        action: "Verified complaint NS-2026-000355",
        entity: "complaint",
        entityId: "NS-2026-000355",
        createdAt: now,
      },
      {
        id: "act-02",
        actorName: "Shri Rajesh Sharma",
        action: "Updated NS-2026-000412 status to Work Started",
        entity: "complaint",
        entityId: "NS-2026-000412",
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: "act-03",
        actorName: "Smt. Sunita Patil",
        action: "Resolved complaint NS-2026-000388",
        entity: "complaint",
        entityId: "NS-2026-000388",
        createdAt: pastDate1,
      },
    ],
  }
}

class Database {
  private cache: DatabaseSchema | null = null

  private read(): DatabaseSchema {
    ensureDataDir()
    if (this.cache) return this.cache
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData()
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8")
      this.cache = initial
      return initial
    }
    try {
      const raw = fs.readFileSync(DB_FILE, "utf8")
      const parsed = JSON.parse(raw) as DatabaseSchema
      this.cache = parsed
      return parsed
    } catch (e) {
      console.error("Failed to read DB file, resetting to initial data", e)
      const initial = getInitialData()
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8")
      this.cache = initial
      return initial
    }
  }

  private write(data: DatabaseSchema) {
    ensureDataDir()
    this.cache = data
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8")
  }

  // Users
  getUsers(): UserRecord[] {
    return this.read().users
  }

  getUserById(id: string): UserRecord | undefined {
    return this.read().users.find((u) => u.id === id)
  }

  getUserByEmail(email: string): UserRecord | undefined {
    const clean = email.toLowerCase().trim()
    return this.read().users.find((u) => u.email.toLowerCase().trim() === clean)
  }

  createUser(user: Omit<UserRecord, "id" | "createdAt" | "updatedAt">): UserRecord {
    const db = this.read()
    const now = new Date().toISOString()
    const newUser: UserRecord = {
      ...user,
      id: "usr-" + Math.random().toString(36).substring(2, 10),
      createdAt: now,
      updatedAt: now,
    }
    db.users.push(newUser)
    this.write(db)
    return newUser
  }

  updateUser(id: string, patch: Partial<UserRecord>): UserRecord {
    const db = this.read()
    const idx = db.users.findIndex((u) => u.id === id)
    if (idx === -1) throw new Error("User not found")
    const now = new Date().toISOString()
    db.users[idx] = { ...db.users[idx], ...patch, updatedAt: now }
    this.write(db)
    return db.users[idx]
  }

  // Complaints
  getComplaints(): ComplaintRecord[] {
    return this.read().complaints
  }

  getComplaintByUuid(uuid: string): ComplaintRecord | undefined {
    return this.read().complaints.find((c) => c.uuid === uuid)
  }

  getComplaintByPublicId(publicId: string): ComplaintRecord | undefined {
    const clean = publicId.trim().toUpperCase()
    return this.read().complaints.find((c) => c.id.toUpperCase() === clean)
  }

  findComplaintsByContact(contact: string): ComplaintRecord[] {
    const clean = contact.trim()
    return this.read().complaints.filter((c) => c.contactNumber === clean)
  }

  nextComplaintPublicId(): string {
    const db = this.read()
    db.complaintSeq = (db.complaintSeq || 415) + 1
    this.write(db)
    const year = new Date().getFullYear()
    return `NS-${year}-${String(db.complaintSeq).padStart(6, "0")}`
  }

  createComplaint(complaint: Omit<ComplaintRecord, "uuid" | "id" | "createdAt" | "updatedAt" | "timeline"> & { timeline?: ComplaintTimelineEntry[] }): ComplaintRecord {
    const db = this.read()
    const now = new Date().toISOString()
    const publicId = this.nextComplaintPublicId()
    const uuid = "c-" + Math.random().toString(36).substring(2, 10)

    const initialTimeline: ComplaintTimelineEntry[] = complaint.timeline && complaint.timeline.length > 0
      ? complaint.timeline
      : [{ status: "Reported", at: now, actor: complaint.reporterName || "Citizen" }]

    const newRecord: ComplaintRecord = {
      ...complaint,
      uuid,
      id: publicId,
      createdAt: now,
      updatedAt: now,
      timeline: initialTimeline,
    }

    db.complaints.unshift(newRecord)
    this.write(db)
    return newRecord
  }

  updateComplaint(uuid: string, patch: Partial<ComplaintRecord>): ComplaintRecord {
    const db = this.read()
    const idx = db.complaints.findIndex((c) => c.uuid === uuid || c.id === uuid)
    if (idx === -1) throw new Error("Complaint not found")
    const now = new Date().toISOString()
    const existing = db.complaints[idx]
    
    // If status is transitioning to Resolved or Closed, record resolvedAt
    let resolvedAt = patch.resolvedAt !== undefined ? patch.resolvedAt : existing.resolvedAt
    if ((patch.status === "Resolved" || patch.status === "Closed") && !resolvedAt) {
      resolvedAt = now
    }

    db.complaints[idx] = {
      ...existing,
      ...patch,
      resolvedAt,
      updatedAt: now,
    }
    this.write(db)
    return db.complaints[idx]
  }

  deleteComplaint(uuid: string): void {
    const db = this.read()
    db.complaints = db.complaints.filter((c) => c.uuid !== uuid && c.id !== uuid)
    this.write(db)
  }

  // Notifications
  getNotifications(userId?: string, role?: string): NotificationRecord[] {
    const db = this.read()
    return db.notifications
      .filter((n) => {
        if (userId && n.userId === userId) return true
        if (role && n.roleTarget === role) return true
        if (!userId && !role) return true
        return false
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  createNotification(notif: Omit<NotificationRecord, "id" | "createdAt" | "read">): NotificationRecord {
    const db = this.read()
    const newRecord: NotificationRecord = {
      ...notif,
      id: "notif-" + Math.random().toString(36).substring(2, 10),
      read: false,
      createdAt: new Date().toISOString(),
    }
    db.notifications.unshift(newRecord)
    this.write(db)
    return newRecord
  }

  markNotificationRead(id: string): void {
    const db = this.read()
    const n = db.notifications.find((item) => item.id === id)
    if (n) {
      n.read = true
      this.write(db)
    }
  }

  markAllNotificationsRead(userId?: string): void {
    const db = this.read()
    db.notifications.forEach((n) => {
      if (!userId || n.userId === userId) {
        n.read = true
      }
    })
    this.write(db)
  }

  // Feedback
  getFeedback(): FeedbackRecord[] {
    return this.read().feedback.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  createFeedback(fb: Omit<FeedbackRecord, "id" | "createdAt">): FeedbackRecord {
    const db = this.read()
    const newRecord: FeedbackRecord = {
      ...fb,
      id: "fb-" + Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
    }
    db.feedback.unshift(newRecord)
    this.write(db)
    return newRecord
  }

  // Surveys
  getSurveys(): SurveyRecord[] {
    return this.read().surveys
  }

  getSurveyById(id: string): SurveyRecord | undefined {
    return this.read().surveys.find((s) => s.id === id)
  }

  getSurveyResponses(surveyId?: string): SurveyResponseRecord[] {
    const db = this.read()
    if (!surveyId) return db.surveyResponses
    return db.surveyResponses.filter((r) => r.surveyId === surveyId)
  }

  createSurveyResponse(resp: Omit<SurveyResponseRecord, "id" | "createdAt">): SurveyResponseRecord {
    const db = this.read()
    const newRecord: SurveyResponseRecord = {
      ...resp,
      id: "resp-" + Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
    }
    db.surveyResponses.unshift(newRecord)
    this.write(db)
    return newRecord
  }

  // Reference tables: Categories, Departments, Wards, Areas
  getCategories(): string[] {
    return this.read().categories
  }

  addCategory(category: string): string[] {
    const db = this.read()
    const clean = category.trim()
    if (clean && !db.categories.includes(clean)) {
      db.categories.push(clean)
      this.write(db)
    }
    return db.categories
  }

  removeCategory(category: string): string[] {
    const db = this.read()
    db.categories = db.categories.filter((c) => c !== category)
    this.write(db)
    return db.categories
  }

  getDepartments(): DepartmentRecord[] {
    return this.read().departments
  }

  getWards(): WardRecord[] {
    return this.read().wards
  }

  getAreas(): AreaRecord[] {
    return this.read().areas
  }

  // Activity Logs
  getActivityLogs(): ActivityLogRecord[] {
    return this.read().activityLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  recordActivity(log: Omit<ActivityLogRecord, "id" | "createdAt">): ActivityLogRecord {
    const db = this.read()
    const newRecord: ActivityLogRecord = {
      ...log,
      id: "act-" + Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
    }
    db.activityLogs.unshift(newRecord)
    if (db.activityLogs.length > 200) {
      db.activityLogs = db.activityLogs.slice(0, 200)
    }
    this.write(db)
    return newRecord
  }
}

export const db = new Database()
