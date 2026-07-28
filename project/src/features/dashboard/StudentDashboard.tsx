import { useEffect, useState } from "react";
import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, CalendarCheck2, Bell, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { studentsApi } from "@/api/studentsApi";
import { CompleteProfileForm } from "@/features/students/CompleteProfileForm";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import type { StudentProfile, Profile } from "@/types";

export default function StudentDashboard() {
  const profile = useAuthStore((s) => s.profile);
  const [studentRecord, setStudentRecord] = useState<(StudentProfile & { profiles: Profile }) | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const record = await studentsApi.getByProfileId(profile.id);
      setStudentRecord(record);
    } catch {
      setStudentRecord(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [profile?.id]);

  if (loading) {
    return <Skeleton className="h-64" />;
  }

  if (!studentRecord) {
    return <CompleteProfileForm onComplete={load} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {profile?.full_name ?? "Student"}</h1>
        <p className="text-sm text-muted-foreground">Track your assignments and attendance here.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Pending Assignments" value={0} icon={ClipboardList} accent="warning" />
        <StatCard label="Attendance Rate" value="0%" icon={CalendarCheck2} accent="success" />
        <StatCard label="Notifications" value={0} icon={Bell} accent="primary" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" /> My Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar src={profile?.avatar_url} name={profile?.full_name ?? ""} size="lg" />
              <div>
                <p className="font-medium">{profile?.full_name}</p>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="text-muted-foreground">Father: </span>{studentRecord.father_name}</p>
              <p><span className="text-muted-foreground">Phone: </span>{profile?.phone ?? "—"}</p>
              <p><span className="text-muted-foreground">Application ID: </span>{studentRecord.application_id}</p>
              <p><span className="text-muted-foreground">Enrolled: </span>{formatDate(studentRecord.enrollment_date)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="py-6 text-center text-sm text-muted-foreground">Nothing due right now.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
