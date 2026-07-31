import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { attendanceApi } from "@/api/attendanceApi";
import { studentsApi } from "@/api/studentsApi";
import { coursesApi, batchesApi } from "@/api/coursesApi";
import { activityApi } from "@/api/activityApi";
import type { AttendanceStatus, Batch, StudentProfile, Profile, AttendanceRecord } from "@/types";
import { toast } from "sonner";
import { CalendarCheck2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

const statusOptions: { value: AttendanceStatus; label: string; variant: "success" | "destructive" | "warning" | "secondary" }[] = [
  { value: "present", label: "Present", variant: "success" },
  { value: "absent", label: "Absent", variant: "destructive" },
  { value: "late", label: "Late", variant: "warning" },
  { value: "leave", label: "Leave", variant: "secondary" },
];

interface Row {
  studentId: string;
  name: string;
  avatarUrl: string | null;
  status: AttendanceStatus;
}

export default function AttendancePage() {
  const profile = useAuthStore((s) => s.profile);
  const isStaff = profile?.role === "teacher" || profile?.role === "admin" || profile?.role === "super_admin";
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reportRows, setReportRows] = useState<{ name: string; total: number; present: number }[]>([]);
  const [reportLoading, setReportLoading] = useState(false);

  const [studentHistory, setStudentHistory] = useState<AttendanceRecord[]>([]);
  const [studentRecordId, setStudentRecordId] = useState<string | null>(null);

  useEffect(() => {
    if (isStaff) {
      (async () => {
        try {
          const list = await batchesApi.list();
          setBatches(list);
        } catch {
          setBatches([]);
        }
      })();
    } else if (profile) {
      (async () => {
        setLoading(true);
        try {
          const record = await studentsApi.getByProfileId(profile.id);
          if (record) {
            setStudentRecordId(record.id);
            const from = new Date();
            from.setMonth(from.getMonth() - 1);
            const history = await attendanceApi.studentReport(
              record.id,
              from.toISOString().slice(0, 10),
              new Date().toISOString().slice(0, 10)
            );
            setStudentHistory(history.sort((a, b) => (a.date < b.date ? 1 : -1)));
          }
        } catch {
          setStudentHistory([]);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isStaff, profile?.id]);

  useEffect(() => {
    if (!isStaff || !selectedBatch) {
      setRows([]);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const [students, existing] = await Promise.all([
          studentsApi.list(selectedBatch),
          attendanceApi.listByBatchAndDate(selectedBatch, date),
        ]);
        const existingMap = new Map(existing.map((r) => [r.student_id, r.status]));
        setRows(
          students.map((s) => ({
            studentId: s.id,
            name: s.profiles?.full_name ?? "Unnamed",
            avatarUrl: s.profiles?.avatar_url ?? null,
            status: existingMap.get(s.id) ?? "present",
          }))
        );
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [isStaff, selectedBatch, date]);

  useEffect(() => {
    if (!isStaff || !selectedBatch) {
      setReportRows([]);
      return;
    }
    (async () => {
      setReportLoading(true);
      try {
        const from = new Date();
        from.setDate(from.getDate() - 30);
        const [students, records] = await Promise.all([
          studentsApi.list(selectedBatch),
          attendanceApi.batchReport(selectedBatch, from.toISOString().slice(0, 10), new Date().toISOString().slice(0, 10)),
        ]);
        setReportRows(
          students.map((s) => {
            const studentRecords = records.filter((r) => r.student_id === s.id);
            const present = studentRecords.filter((r) => r.status === "present").length;
            return {
              name: s.profiles?.full_name ?? "Unnamed",
              total: studentRecords.length,
              present,
            };
          })
        );
      } catch {
        setReportRows([]);
      } finally {
        setReportLoading(false);
      }
    })();
  }, [isStaff, selectedBatch]);

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setRows((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)));
  };

  const handleSave = async () => {
    if (!profile || !selectedBatch) return;
    setSaving(true);
    try {
      await attendanceApi.markBulk(
        rows.map((r) => ({
          student_id: r.studentId,
          batch_id: selectedBatch,
          date,
          status: r.status,
          marked_by: profile.id,
        }))
      );
      await activityApi.log(
        profile.id,
        `${profile.full_name} marked attendance for ${rows.length} student(s) on ${formatDate(date)}`
      );
      toast.success("Attendance saved");

      // Refresh the 30-day report to reflect today's update.
      try {
        const from = new Date();
        from.setDate(from.getDate() - 30);
        const [students, records] = await Promise.all([
          studentsApi.list(selectedBatch),
          attendanceApi.batchReport(selectedBatch, from.toISOString().slice(0, 10), new Date().toISOString().slice(0, 10)),
        ]);
        setReportRows(
          students.map((s) => {
            const studentRecords = records.filter((r) => r.student_id === s.id);
            const present = studentRecords.filter((r) => r.status === "present").length;
            return { name: s.profiles?.full_name ?? "Unnamed", total: studentRecords.length, present };
          })
        );
      } catch {
        // Non-critical refresh, ignore.
      }
    } catch {
      toast.error("Could not save attendance.");
    } finally {
      setSaving(false);
    }
  };

  if (!isStaff) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">My Attendance</h1>
          <p className="text-sm text-muted-foreground">Your attendance record for the last 30 days.</p>
        </div>
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            ) : !studentRecordId ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Complete your profile first to see attendance.</p>
            ) : studentHistory.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No attendance records yet.</p>
            ) : (
              <div className="divide-y">
                {studentHistory.map((r) => (
                  <div key={r.id} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span>{formatDate(r.date)}</span>
                    <Badge variant={statusOptions.find((o) => o.value === r.status)?.variant}>
                      {statusOptions.find((o) => o.value === r.status)?.label}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Attendance</h1>
          <p className="text-sm text-muted-foreground">Select a batch and date, then mark attendance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">No batches yet</div>
              ) : (
                batches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" />
          <Button onClick={handleSave} disabled={saving || rows.length === 0}>
            Save
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarCheck2 className="h-4 w-4" /> Class Roster
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedBatch ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Select a batch to load its students.</p>
          ) : loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No students enrolled in this batch yet.</p>
          ) : (
            <div className="divide-y">
              {rows.map((r) => (
                <div key={r.studentId} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={r.avatarUrl} name={r.name} size="sm" />
                    <span className="text-sm font-medium">{r.name}</span>
                  </div>
                  <div className="flex gap-2">
                    {statusOptions.map((opt) => (
                      <button key={opt.value} onClick={() => setStatus(r.studentId, opt.value)}>
                        <Badge variant={r.status === opt.value ? opt.variant : "outline"}>{opt.label}</Badge>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedBatch && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">30-Day Attendance Report</CardTitle>
          </CardHeader>
          <CardContent>
            {reportLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8" />
                ))}
              </div>
            ) : reportRows.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No attendance data in the last 30 days.</p>
            ) : (
              <div className="space-y-2">
                {reportRows.map((r) => {
                  const pct = r.total > 0 ? Math.round((r.present / r.total) * 100) : 0;
                  return (
                    <div key={r.name} className="flex items-center gap-3">
                      <span className="w-32 shrink-0 truncate text-sm">{r.name}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${pct >= 75 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-destructive"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-12 shrink-0 text-right text-sm text-muted-foreground">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
