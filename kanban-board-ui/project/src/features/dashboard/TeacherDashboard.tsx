import { useEffect, useState } from "react";
import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, CalendarCheck2, Bell } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { teachersApi } from "@/api/teachersApi";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import type { Batch } from "@/types";

export default function TeacherDashboard() {
  const profile = useAuthStore((s) => s.profile);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ classes: 0, students: 0, assignments: 0, attendanceToday: 0 });
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      setLoading(true);
      try {
        const teacherRecord = await teachersApi.getByProfileId(profile.id);
        if (!teacherRecord) {
          setLoading(false);
          return;
        }

        const { data: batchLinks } = await supabase
          .from("teacher_batches")
          .select("batch_id, batches(*)")
          .eq("teacher_id", teacherRecord.id);

        const myBatches = (batchLinks ?? []).map((b: any) => b.batches).filter(Boolean) as Batch[];
        setBatches(myBatches);
        const batchIds = myBatches.map((b) => b.id);

        const [studentsCount, assignmentsCount, attendanceToday] = await Promise.all([
          batchIds.length
            ? supabase.from("students").select("*", { count: "exact", head: true }).in("batch_id", batchIds)
            : Promise.resolve({ count: 0 }),
          supabase.from("assignments").select("*", { count: "exact", head: true }).eq("teacher_id", teacherRecord.id),
          supabase
            .from("attendance")
            .select("*", { count: "exact", head: true })
            .eq("date", new Date().toISOString().slice(0, 10))
            .eq("marked_by", profile.id),
        ]);

        setStats({
          classes: myBatches.length,
          students: studentsCount.count ?? 0,
          assignments: assignmentsCount.count ?? 0,
          attendanceToday: attendanceToday.count ?? 0,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [profile?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {profile?.full_name ?? "Teacher"}</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening in your classes today.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="My Classes" value={stats.classes} icon={Users} accent="primary" />
          <StatCard label="Students" value={stats.students} icon={Users} accent="primary" />
          <StatCard label="Assignments" value={stats.assignments} icon={ClipboardList} accent="warning" />
          <StatCard label="Attendance Marked Today" value={stats.attendanceToday} icon={CalendarCheck2} accent="success" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {batches.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No batches assigned yet. Ask an admin to assign you to a batch.
              </p>
            ) : (
              <ul className="space-y-2">
                {batches.map((b) => (
                  <li key={b.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                    <span>{b.name}</span>
                    <span className="text-muted-foreground">{b.timing}</span>
                  </li>
                ))}
              </ul>
            )}
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
