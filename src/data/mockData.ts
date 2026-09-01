import type {
  Complaint,
  CommunityUpdate,
  FaqItem,
  Notification,
  Survey,
} from "../types"

// Demo fallback data (used only when Supabase keys are not configured).
export const mockComplaints: Complaint[] = [
  {
    uuid: "demo-1",
    id: "NGS-2026-000412",
    title: "Overflowing garbage bin near market",
    category: "Garbage",
    description:
      "The community garbage bin outside the vegetable market has not been cleared for four days and is overflowing onto the road.",
    area: "Ward 12 – Shivaji Nagar",
    ward: "Ward 12",
    landmark: "Opposite Subzi Mandi",
    lat: 19.079,
    lng: 72.881,
    imageUrls: [],
    contactNumber: "9800000010",
    priority: "High",
    anonymous: false,
    archived: false,
    status: "Work Started",
    createdAt: "2026-07-14T09:20:00Z",
    updatedAt: "2026-07-19T11:00:00Z",
    assignedTo: "Solid Waste Department",
    timeline: [
      { status: "Reported", at: "2026-07-14T09:20:00Z", actor: "Citizen" },
      { status: "Verified", at: "2026-07-15T10:00:00Z", actor: "Control Room" },
      { status: "Assigned", at: "2026-07-16T08:30:00Z", actor: "Solid Waste Department" },
      { status: "Work Started", at: "2026-07-19T11:00:00Z", actor: "Field Team", note: "Truck dispatched" },
    ],
  },
  {
    uuid: "demo-2",
    id: "NGS-2026-000388",
    title: "Broken street light on main road",
    category: "Street Lights",
    description:
      "Two street lights near the bus stop have been non-functional for a week, making the area unsafe at night.",
    area: "Ward 08 – Gandhi Road",
    ward: "Ward 08",
    landmark: "Near City Bus Stop",
    lat: 19.071,
    lng: 72.874,
    imageUrls: [],
    priority: "Medium",
    anonymous: true,
    archived: false,
    status: "Resolved",
    createdAt: "2026-07-02T18:00:00Z",
    updatedAt: "2026-07-10T14:00:00Z",
    resolvedAt: "2026-07-10T14:00:00Z",
    assignedTo: "Electrical Department",
    timeline: [
      { status: "Reported", at: "2026-07-02T18:00:00Z" },
      { status: "Verified", at: "2026-07-03T09:00:00Z" },
      { status: "Assigned", at: "2026-07-04T09:00:00Z" },
      { status: "Work Started", at: "2026-07-07T09:00:00Z" },
      { status: "Resolved", at: "2026-07-10T14:00:00Z", note: "Both lights replaced" },
    ],
  },
  {
    uuid: "demo-3",
    id: "NGS-2026-000355",
    title: "Pothole causing traffic near school",
    category: "Road Damage",
    description:
      "A large pothole has formed after the rains and is causing two-wheeler accidents near the school gate.",
    area: "Ward 15 – Nehru Colony",
    ward: "Ward 15",
    landmark: "Adarsh School Gate",
    lat: 19.065,
    lng: 72.89,
    imageUrls: [],
    contactNumber: "9700000022",
    priority: "Critical",
    anonymous: false,
    archived: false,
    status: "Verified",
    createdAt: "2026-07-18T07:45:00Z",
    updatedAt: "2026-07-19T09:00:00Z",
    timeline: [
      { status: "Reported", at: "2026-07-18T07:45:00Z" },
      { status: "Verified", at: "2026-07-19T09:00:00Z" },
    ],
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Complaint NGS-2026-000412 updated",
    body: "Status changed to Work Started. A field team has been dispatched.",
    at: "2026-07-19T11:05:00Z",
    read: false,
  },
  {
    id: "n2",
    title: "Complaint NGS-2026-000388 resolved",
    body: "Your reported street light issue has been resolved. Please share feedback.",
    at: "2026-07-10T14:05:00Z",
    read: true,
  },
]

export const mockUpdates: CommunityUpdate[] = [
  {
    id: "u1",
    title: "City-wide monsoon drainage drive begins",
    summary: "Municipal teams start pre-monsoon cleaning of major drains across 24 wards.",
    date: "2026-07-16",
    tag: "Drainage",
  },
  {
    id: "u2",
    title: "1,240 street lights repaired this quarter",
    summary: "Electrical department completes Q2 maintenance targets ahead of schedule.",
    date: "2026-07-11",
    tag: "Street Lights",
  },
  {
    id: "u3",
    title: "New waste segregation guidelines published",
    summary: "Citizens are requested to separate wet and dry waste for faster collection.",
    date: "2026-07-05",
    tag: "Garbage",
  },
]

export const faqItems: FaqItem[] = [
  {
    q: "How do I report a civic issue?",
    a: "Click 'Report Issue', fill in the issue title, category, description, area and (optionally) attach photos and your GPS location, then submit. You will receive a Complaint ID.",
  },
  {
    q: "Can I report an issue without logging in?",
    a: "You can track any complaint publicly using the Complaint ID or mobile number. To submit a new complaint and receive updates you should log in as a citizen, though anonymous reporting is supported.",
  },
  {
    q: "How do I track my complaint?",
    a: "Go to 'Track Complaint' and search by Complaint ID or the mobile number used while reporting. You will see the full status timeline.",
  },
  {
    q: "Who resolves the reported issues?",
    a: "Complaints are routed to the relevant municipal department (Solid Waste, Electrical, Water, Public Works, etc.) and monitored until closure.",
  },
  {
    q: "Is my personal information safe?",
    a: "Yes. Personal data is protected, and you can choose anonymous reporting so your identity is not shown publicly.",
  },
]

export const mockSurvey: Survey = {
  id: "svy-civic-2026",
  title: "Civic Priorities Survey 2026",
  description:
    "Help your municipality prioritise civic work in your area. This short survey takes about 2 minutes.",
  questions: [
    {
      id: "q1",
      prompt: "Which civic problem affects your area the most?",
      type: "single",
      options: ["Garbage", "Road Damage", "Water Supply", "Drainage", "Street Lights"],
    },
    {
      id: "q2",
      prompt: "Which services need urgent improvement? (select all that apply)",
      type: "multi",
      options: ["Public Toilets", "Parks", "Trees", "Water Leakage", "Public Property"],
    },
    {
      id: "q3",
      prompt: "How satisfied are you with civic issue resolution so far?",
      type: "rating",
    },
  ],
}

// Aggregate analytics used by the Community & Admin dashboards (demo fallback).
export const categoryStats = [
  { category: "Garbage", count: 320 },
  { category: "Road Damage", count: 268 },
  { category: "Water Supply", count: 205 },
  { category: "Drainage", count: 176 },
  { category: "Street Lights", count: 154 },
  { category: "Water Leakage", count: 121 },
  { category: "Public Toilets", count: 88 },
  { category: "Parks", count: 63 },
  { category: "Trees", count: 47 },
  { category: "Others", count: 59 },
]

export const areaStats = [
  { area: "Shivaji Nagar", reported: 210, resolved: 168 },
  { area: "Gandhi Road", reported: 184, resolved: 150 },
  { area: "Nehru Colony", reported: 166, resolved: 121 },
  { area: "Patel Ward", reported: 142, resolved: 118 },
  { area: "Subhash Nagar", reported: 133, resolved: 97 },
]

export const monthlyTrends = [
  { month: "Feb", reported: 180, resolved: 150 },
  { month: "Mar", reported: 220, resolved: 190 },
  { month: "Apr", reported: 260, resolved: 210 },
  { month: "May", reported: 310, resolved: 250 },
  { month: "Jun", reported: 340, resolved: 300 },
  { month: "Jul", reported: 290, resolved: 240 },
]

export const heatPoints: [number, number, number][] = [
  [19.079, 72.881, 0.9],
  [19.071, 72.874, 0.6],
  [19.065, 72.89, 0.8],
  [19.083, 72.868, 0.5],
  [19.058, 72.877, 0.7],
  [19.09, 72.885, 0.4],
  [19.076, 72.895, 0.65],
]

export const communityTotals = {
  total: 1560,
  resolved: 1124,
  pending: 436,
  avgDays: 6.2,
}
