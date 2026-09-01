import { Routes, Route } from "react-router-dom"
import PublicLayout from "./components/layout/PublicLayout"
import CitizenLayout from "./components/layout/CitizenLayout"
import AdminLayout from "./components/layout/AdminLayout"
import RequireAuth from "./components/RequireAuth"

import Home from "./pages/Home"
import ReportIssue from "./pages/ReportIssue"
import TrackComplaint from "./pages/TrackComplaint"
import CommunityDashboard from "./pages/CommunityDashboard"
import Survey from "./pages/Survey"
import { Guidelines, About, Contact, NotFound } from "./pages/InfoPages"
import Login from "./pages/auth/Login"
import AdminLogin from "./pages/auth/AdminLogin"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"

import CitizenDashboard from "./pages/citizen/CitizenDashboard"
import MyComplaints from "./pages/citizen/MyComplaints"
import CitizenReport from "./pages/citizen/CitizenReport"
import ComplaintStatus from "./pages/citizen/ComplaintStatus"
import Notifications from "./pages/citizen/Notifications"
import Profile from "./pages/citizen/Profile"
import Feedback from "./pages/citizen/Feedback"

import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminComplaints from "./pages/admin/AdminComplaints"
import UserManagement from "./pages/admin/UserManagement"
import SurveyAnalytics from "./pages/admin/SurveyAnalytics"
import CategoryManagement from "./pages/admin/CategoryManagement"
import AreaManagement from "./pages/admin/AreaManagement"
import Reports from "./pages/admin/Reports"
import ActivityLogs from "./pages/admin/ActivityLogs"

function Public({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>
}

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<Public><Home /></Public>} />
      <Route path="/report" element={<Public><ReportIssue /></Public>} />
      <Route path="/track" element={<Public><TrackComplaint /></Public>} />
      <Route path="/community" element={<Public><CommunityDashboard /></Public>} />
      <Route path="/survey" element={<Public><Survey /></Public>} />
      <Route path="/guidelines" element={<Public><Guidelines /></Public>} />
      <Route path="/about" element={<Public><About /></Public>} />
      <Route path="/contact" element={<Public><Contact /></Public>} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Citizen portal */}
      <Route
        path="/citizen"
        element={
          <RequireAuth role="citizen">
            <CitizenLayout />
          </RequireAuth>
        }
      >
        <Route index element={<CitizenDashboard />} />
        <Route path="complaints" element={<MyComplaints />} />
        <Route path="report" element={<CitizenReport />} />
        <Route path="status" element={<ComplaintStatus />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>

      {/* Admin console */}
      <Route
        path="/admin"
        element={
          <RequireAuth role="admin">
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="surveys" element={<SurveyAnalytics />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="areas" element={<AreaManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="logs" element={<ActivityLogs />} />
      </Route>

      <Route path="*" element={<Public><NotFound /></Public>} />
    </Routes>
  )
}
