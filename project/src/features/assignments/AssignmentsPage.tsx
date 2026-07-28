import { useEffect, useState } from "react";
import { assignmentsApi } from "@/api/assignmentsApi";
import { useAuthStore } from "@/store/authStore";
import type { Assignment } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { ClipboardList, Download, Upload, Plus, Pencil, Trash2 } from "lucide-react";
import { AssignmentFormDialog } from "./AssignmentFormDialog";

export default function AssignmentsPage() {
  const profile = useAuthStore((s) => s.profile);
  const isStaff = profile?.role === "teacher" || profile?.role === "admin" || profile?.role === "super_admin";
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await assignmentsApi.list();
      setAssignments(data);
    } catch {
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (a: Assignment) => {
    setEditing(a);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this assignment? This cannot be undone.")) return;
    try {
      await assignmentsApi.remove(id);
      toast.success("Assignment deleted");
      load();
    } catch {
      toast.error("Could not delete assignment");
    }
  };

  const handleSubmit = async (assignmentId: string, file: File) => {
    if (!profile) return;
    try {
      const url = await assignmentsApi.uploadAttachment(file, assignmentId);
      await assignmentsApi.submit({
        assignment_id: assignmentId,
        student_id: profile.id,
        file_urls: [url],
        remarks: null,
        status: "submitted",
        submitted_at: new Date().toISOString(),
        grade: null,
      });
      toast.success("Assignment submitted");
    } catch {
      toast.error("Submission failed. Check Supabase Storage setup.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Assignments</h1>
          <p className="text-sm text-muted-foreground">
            {isStaff ? "Create, edit and track submissions." : "View, download and submit your assignments."}
          </p>
        </div>
        {isStaff && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New Assignment
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <ClipboardList className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No assignments yet</p>
            <p className="text-sm text-muted-foreground">
              {isStaff
                ? "Create your first assignment to get started. You'll need at least one Course and Batch set up first."
                : "Check back soon — new assignments will show up here."}
            </p>
            {isStaff && (
              <Button className="mt-2" onClick={openCreate}>
                <Plus className="h-4 w-4" /> New Assignment
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {assignments.map((a) => {
            const isLate = new Date(a.due_date) < new Date();
            return (
              <Card key={a.id}>
                <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{a.title}</p>
                      {isLate && <Badge variant="destructive">Due passed</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Due {formatDate(a.due_date)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {a.attachment_urls?.[0] && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={a.attachment_urls[0]} target="_blank" rel="noreferrer">
                          <Download className="h-4 w-4" /> Download
                        </a>
                      </Button>
                    )}
                    {!isStaff && (
                      <label>
                        <Button variant="secondary" size="sm" asChild>
                          <span>
                            <Upload className="h-4 w-4" /> Submit
                          </span>
                        </Button>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleSubmit(a.id, file);
                          }}
                        />
                      </label>
                    )}
                    {isStaff && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => openEdit(a)}>
                          <Pencil className="h-4 w-4" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(a.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AssignmentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={load}
        assignment={editing}
      />
    </div>
  );
}
