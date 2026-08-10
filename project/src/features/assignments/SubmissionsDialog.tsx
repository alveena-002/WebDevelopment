import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { assignmentsApi } from "@/api/assignmentsApi";
import { studentsApi } from "@/api/studentsApi";
import { notificationsApi } from "@/api/notificationsApi";
import { supabase } from "@/lib/supabase";
import type { Assignment, AssignmentSubmission } from "@/types";
import { toast } from "sonner";
import { Download, FileText, Save } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SubmissionsDialogProps {
  assignment: Assignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Row extends AssignmentSubmission {
  studentName: string;
  studentAvatar: string | null;
  gradeDraft: string;
}

const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  submitted: "success",
  late: "warning",
  pending: "secondary",
  graded: "success",
};

export function SubmissionsDialog({ assignment, open, onOpenChange }: SubmissionsDialogProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !assignment) return;
    (async () => {
      setLoading(true);
      try {
        const [submissions, batchStudents] = await Promise.all([
          assignmentsApi.listSubmissions(assignment.id),
          studentsApi.list(assignment.batch_id),
        ]);
        const studentMap = new Map(batchStudents.map((s) => [s.id, s]));
        setRows(
          submissions.map((sub) => {
            const student = studentMap.get(sub.student_id);
            return {
              ...sub,
              studentName: student?.profiles?.full_name ?? "Unknown student",
              studentAvatar: student?.profiles?.avatar_url ?? null,
              gradeDraft: sub.grade ?? "",
            };
          })
        );
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, assignment]);

  const setGradeDraft = (id: string, value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, gradeDraft: value } : r)));
  };

  const handleSaveGrade = async (row: Row) => {
    setSavingId(row.id);
    try {
      await supabase.from("assignment_submissions").update({ grade: row.gradeDraft, status: "graded" }).eq("id", row.id);
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, grade: row.gradeDraft, status: "graded" } : r)));
      try {
        const student = await studentsApi.getById(row.student_id);
        await notificationsApi.create({
          user_id: student.profile_id,
          title: "Assignment graded",
          message: `${assignment?.title}: grade "${row.gradeDraft}"`,
        });
      } catch {
        // best-effort
      }
      toast.success("Grade saved");
    } catch {
      toast.error("Could not save grade");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submissions — {assignment?.title}</DialogTitle>
          <DialogDescription>Review files, remarks, and assign grades.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No submissions yet.</p>
        ) : (
          <div className="max-h-[60vh] space-y-3 overflow-y-auto">
            {rows.map((r) => (
              <div key={r.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar src={r.studentAvatar} name={r.studentName} size="sm" />
                    <div>
                      <p className="text-sm font-medium">{r.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.submitted_at ? formatDate(r.submitted_at) : "Not submitted"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusVariant[r.status] ?? "secondary"}>{r.status}</Badge>
                </div>
                {r.remarks && <p className="mt-2 text-sm text-muted-foreground">"{r.remarks}"</p>}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {r.file_urls?.[0] && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={r.file_urls[0]} target="_blank" rel="noreferrer">
                        <Download className="h-4 w-4" /> Download file
                      </a>
                    </Button>
                  )}
                  <Input
                    placeholder="Grade (e.g. A, 85/100)"
                    value={r.gradeDraft}
                    onChange={(e) => setGradeDraft(r.id, e.target.value)}
                    className="h-9 w-40"
                  />
                  <Button size="sm" onClick={() => handleSaveGrade(r)} disabled={savingId === r.id}>
                    <Save className="h-4 w-4" /> Save grade
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
