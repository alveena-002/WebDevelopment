import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, CalendarCheck2, Bell } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function TeacherDashboard() {
  const profile = useAuthStore((s) => s.profile);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {profile?.full_name ?? "Teacher"}</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening in your classes today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My Classes" value={0} icon={Users} accent="primary" />
        <StatCard label="Students" value={0} icon={Users} accent="primary" />
        <StatCard label="Assignments" value={0} icon={ClipboardList} accent="warning" />
        <StatCard label="Attendance Marked Today" value={0} icon={CalendarCheck2} accent="success" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="py-6 text-center text-sm text-muted-foreground">
              Your assigned batches will appear here.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="py-6 text-center text-sm text-muted-foreground">No new notifications.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
