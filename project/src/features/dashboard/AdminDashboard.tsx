import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GraduationCap, ClipboardList, CheckCircle2, CalendarCheck2, Activity } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  pendingAssignments: number;
  submittedAssignments: number;
  attendanceRate: number;
}

interface ActivityItem {
  id: string;
  action: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [students, teachers, pending, submitted, activityLog] = await Promise.all([
        supabase.from("students").select("*", { count: "exact", head: true }),
        supabase.from("teachers").select("*", { count: "exact", head: true }),
        supabase.from("assignment_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("assignment_submissions").select("*", { count: "exact", head: true }).eq("status", "submitted"),
        supabase.from("activity_logs").select("id, action, created_at").order("created_at", { ascending: false }).limit(6),
      ]);

      setStats({
        totalStudents: students.count ?? 0,
        totalTeachers: teachers.count ?? 0,
        pendingAssignments: pending.count ?? 0,
        submittedAssignments: submitted.count ?? 0,
        attendanceRate: 0,
      });
      setActivity((activityLog.data as ActivityItem[]) ?? []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">Institute-wide snapshot of students, teachers and activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={stats?.totalStudents ?? 0} icon={GraduationCap} accent="primary" />
        <StatCard label="Total Teachers" value={stats?.totalTeachers ?? 0} icon={Users} accent="primary" />
        <StatCard label="Pending Assignments" value={stats?.pendingAssignments ?? 0} icon={ClipboardList} accent="warning" />
        <StatCard label="Submitted Assignments" value={stats?.submittedAssignments ?? 0} icon={CheckCircle2} accent="success" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarCheck2 className="h-4 w-4" /> Attendance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats?.attendanceRate ?? 0}%</p>
            <p className="text-sm text-muted-foreground">Average attendance across all batches this month.</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No recent activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {activity.map((item) => (
                  <li key={item.id} className="flex items-center justify-between border-b pb-2 text-sm last:border-0">
                    <span>{item.action}</span>
                    <span className="text-muted-foreground">{formatDate(item.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
