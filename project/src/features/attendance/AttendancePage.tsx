import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { attendanceApi } from "@/api/attendanceApi";
import type { AttendanceStatus } from "@/types";
import { toast } from "sonner";
import { CalendarCheck2 } from "lucide-react";

const statusOptions: { value: AttendanceStatus; label: string; variant: "success" | "destructive" | "warning" | "secondary" }[] = [
  { value: "present", label: "Present", variant: "success" },
  { value: "absent", label: "Absent", variant: "destructive" },
  { value: "late", label: "Late", variant: "warning" },
  { value: "leave", label: "Leave", variant: "secondary" },
];

interface Row {
  studentId: string;
  name: string;
  status: AttendanceStatus;
}

export default function AttendancePage() {
  const profile = useAuthStore((s) => s.profile);
  const isTeacherOrAdmin = profile?.role === "teacher" || profile?.role === "admin" || profile?.role === "super_admin";
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState<Row[]>([]);
  const [saving, setSaving] = useState(false);

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setRows((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)));
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await attendanceApi.markBulk(
        rows.map((r) => ({
          student_id: r.studentId,
          batch_id: "", // set from selected batch in a full implementation
          date,
          status: r.status,
          marked_by: profile.id,
        }))
      );
      toast.success("Attendance saved");
    } catch {
      toast.error("Could not save attendance. Check Supabase schema is applied.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            {isTeacherOrAdmin ? "Mark attendance for your batch." : "Your attendance history."}
          </p>
        </div>
        {isTeacherOrAdmin && (
          <div className="flex items-center gap-2">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" />
            <Button onClick={handleSave} disabled={saving || rows.length === 0}>
              Save
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarCheck2 className="h-4 w-4" /> {isTeacherOrAdmin ? "Class Roster" : "Recent Records"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Select a batch to load students, or no attendance records exist yet.
            </p>
          ) : (
            <div className="divide-y">
              {rows.map((r) => (
                <div key={r.studentId} className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium">{r.name}</span>
                  {isTeacherOrAdmin ? (
                    <div className="flex gap-2">
                      {statusOptions.map((opt) => (
                        <button key={opt.value} onClick={() => setStatus(r.studentId, opt.value)}>
                          <Badge variant={r.status === opt.value ? opt.variant : "outline"}>{opt.label}</Badge>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <Badge variant={statusOptions.find((o) => o.value === r.status)?.variant}>
                      {statusOptions.find((o) => o.value === r.status)?.label}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
