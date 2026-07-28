import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

import AdminDashboard from "@/features/dashboard/AdminDashboard";
import TeacherDashboard from "@/features/dashboard/TeacherDashboard";
import StudentDashboard from "@/features/dashboard/StudentDashboard";
import RoleDashboardRouter from "@/features/dashboard/RoleDashboardRouter";

import AssignmentsPage from "@/features/assignments/AssignmentsPage";
import AttendancePage from "@/features/attendance/AttendancePage";
import StudentsPage from "@/features/students/StudentsPage";
import CoursesPage from "@/features/courses/CoursesPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<RoleDashboardRouter />} />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]} />
            }
          >
            <Route index element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin", "super_admin"]} />}>
            <Route path="/courses" element={<CoursesPage />} />
          </Route>

          <Route
            element={<ProtectedRoute allowedRoles={["admin", "super_admin", "teacher"]} />}
          >
            <Route path="/students" element={<StudentsPage />} />
          </Route>

          <Route
            element={<ProtectedRoute allowedRoles={["admin", "super_admin", "teacher", "student"]} />}
          >
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
