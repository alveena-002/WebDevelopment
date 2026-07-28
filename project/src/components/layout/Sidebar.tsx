import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  CalendarCheck,
  Bell,
  Settings,
  GraduationCap,
  BarChart3,
} from "lucide-react";

const navByRole: Record<string, { to: string; label: string; icon: any }[]> = {
  super_admin: [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/users", label: "Manage Users", icon: Users },
    { to: "/courses", label: "Courses & Batches", icon: BookOpen },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ],
  admin: [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/users", label: "Manage Users", icon: Users },
    { to: "/courses", label: "Courses & Batches", icon: BookOpen },
    { to: "/assignments", label: "Assignments", icon: ClipboardCheck },
    { to: "/attendance", label: "Attendance", icon: CalendarCheck },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ],
  teacher: [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/students", label: "My Students", icon: Users },
    { to: "/assignments", label: "Assignments", icon: ClipboardCheck },
    { to: "/attendance", label: "Attendance", icon: CalendarCheck },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: Settings },
  ],
  student: [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/profile", label: "My Profile", icon: Users },
    { to: "/assignments", label: "Assignments", icon: ClipboardCheck },
    { to: "/attendance", label: "My Attendance", icon: CalendarCheck },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: Settings },
  ],
};

export function Sidebar() {
  const role = useAuthStore((s) => s.profile?.role) ?? "student";
  const items = navByRole[role] ?? navByRole.student;

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card md:block">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">EduManage</span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
