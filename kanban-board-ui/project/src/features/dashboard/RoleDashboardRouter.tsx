import { useAuthStore } from "@/store/authStore";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";

export default function RoleDashboardRouter() {
  const role = useAuthStore((s) => s.profile?.role);

  if (role === "admin" || role === "super_admin") return <AdminDashboard />;
  if (role === "teacher") return <TeacherDashboard />;
  return <StudentDashboard />;
}
