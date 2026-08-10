import { useEffect, useState } from "react";
import { studentsApi } from "@/api/studentsApi";
import { assignmentsApi } from "@/api/assignmentsApi";
import { coursesApi, batchesApi } from "@/api/coursesApi";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, BarChart3, Users, ClipboardList, CalendarCheck2 } from "lucide-react";
import { toast } from "sonner";

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ students: 0, assignments: 0, submissions: 0, attendanceRecords: 0 });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [students, assignments, submissions, attendance] = await Promise.all([
          supabase.from("students").select("*", { count: "exact", head: true }),
          supabase.from("assignments").select("*", { count: "exact", head: true }),
          supabase.from("assignment_submissions").select("*", { count: "exact", head: true }),
          supabase.from("attendance").select("*", { count: "exact", head: true }),
        ]);
        setCounts({
          students: students.count ?? 0,
          assignments: assignments.count ?? 0,
          submissions: submissions.count ?? 0,
          attendanceRecords: attendance.count ?? 0,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const exportStudents = async () => {
    try {
      const [students, courses, batches] = await Promise.all([
        studentsApi.list(),
        coursesApi.list(),
        batchesApi.list(),
      ]);
      const rows: (string | number)[][] = [
        ["Name", "Email", "Application ID", "Father Name", "Phone", "Course", "Batch", "Enrollment Date"],
        ...students.map((s) => [
          s.profiles?.full_name ?? "",
          s.profiles?.email ?? "",
          s.application_id,
          s.father_name,
          s.profiles?.phone ?? "",
          courses.find((c) => c.id === s.course_id)?.name ?? "",
          batches.find((b) => b.id === s.batch_id)?.name ?? "",
          s.enrollment_date,
        ]),
      ];
      downloadCsv("students.csv", rows);
      toast.success("Students exported");
    } catch {
      toast.error("Could not export students");
    }
  };

  const exportAssignments = async () => {
    try {
      const assignments = await assignmentsApi.list();
      const rows: (string | number)[][] = [
        ["Title", "Due Date", "Status"],
        ...assignments.map((a) => [a.title, a.due_date, a.status]),
      ];
      downloadCsv("assignments.csv", rows);
      toast.success("Assignments exported");
    } catch {
      toast.error("Could not export assignments");
    }
  };

  const exportAttendance = async () => {
    try {
      const { data, error } = await supabase.from("attendance").select("date, status, student_id");
      if (error) throw error;
      const rows: (string | number)[][] = [
        ["Date", "Student ID", "Status"],
        ...(data ?? []).map((r: any) => [r.date, r.student_id, r.status]),
      ];
      downloadCsv("attendance.csv", rows);
      toast.success("Attendance exported");
    } catch {
      toast.error("Could not export attendance");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">Institute-wide numbers and CSV exports.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-semibold">{counts.students}</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <ClipboardList className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-semibold">{counts.assignments}</p>
                <p className="text-sm text-muted-foreground">Assignments</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-semibold">{counts.submissions}</p>
                <p className="text-sm text-muted-foreground">Submissions</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <CalendarCheck2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-semibold">{counts.attendanceRecords}</p>
                <p className="text-sm text-muted-foreground">Attendance Records</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Export Data</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={exportStudents}>
            <Download className="h-4 w-4" /> Export Students CSV
          </Button>
          <Button variant="outline" onClick={exportAssignments}>
            <Download className="h-4 w-4" /> Export Assignments CSV
          </Button>
          <Button variant="outline" onClick={exportAttendance}>
            <Download className="h-4 w-4" /> Export Attendance CSV
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
