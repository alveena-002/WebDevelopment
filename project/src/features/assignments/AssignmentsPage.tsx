import { useEffect, useMemo, useState } from "react";
import { assignmentsApi } from "@/api/assignmentsApi";
import { coursesApi, batchesApi } from "@/api/coursesApi";
import { useAuthStore } from "@/store/authStore";
import type { Assignment, Course, Batch } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { ClipboardList, Download, Upload, Plus, Pencil, Trash2, Users2, AlertCircle } from "lucide-react";
import { AssignmentFormDialog } from "./AssignmentFormDialog";
import { SubmissionDialog } from "./SubmissionDialog";
import { SubmissionsDialog } from "./SubmissionsDialog";

export default function AssignmentsPage() {
  const profile = useAuthStore((s) => s.profile);
  const isStaff = profile?.role === "teacher" || profile?.role === "admin" || profile?.role === "super_admin";
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [submittingFor, setSubmittingFor] = useState<Assignment | null>(null);
  const [viewingSubmissionsFor, setViewingSubmissionsFor] = useState<Assignment | null>(null);

  const load = async () => {
    setLoading(true);
    setErrored(false);
    try {
      const [data, courseList, batchList] = await Promise.all([
        assignmentsApi.list(),
        coursesApi.list(),
        batchesApi.list(),
      ]);
      setAssignments(data);
      setCourses(courseList);
      setBatches(batchList);
    } catch {
      setAssignments([]);
      setErrored(true);
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

  const filteredBatches = courseFilter === "all" ? batches : batches.filter((b) => b.course_id === courseFilter);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      if (courseFilter !== "all" && a.course_id !== courseFilter) return false;
      if (batchFilter !== "all" && a.batch_id !== batchFilter) return false;
      return true;
    });
  }, [assignments, courseFilter, batchFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

      {(courses.length > 0 || batches.length > 0) && (
        <div className="flex flex-wrap gap-2">
          <Select
            value={courseFilter}
            onValueChange={(v) => {
              setCourseFilter(v);
              setBatchFilter("all");
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={batchFilter} onValueChange={setBatchFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All batches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All batches</SelectItem>
              {filteredBatches.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : errored ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="font-medium">Could not load assignments</p>
            <p className="text-sm text-muted-foreground">Check your connection and Supabase configuration, then try again.</p>
            <Button variant="outline" className="mt-2" onClick={load}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <ClipboardList className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No assignments{assignments.length > 0 ? " match this filter" : " yet"}</p>
            <p className="text-sm text-muted-foreground">
              {isStaff && assignments.length === 0
                ? "Create your first assignment to get started. You'll need at least one Course and Batch set up first."
                : "Check back soon — new assignments will show up here."}
            </p>
            {isStaff && assignments.length === 0 && (
              <Button className="mt-2" onClick={openCreate}>
                <Plus className="h-4 w-4" /> New Assignment
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredAssignments.map((a) => {
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
                      <Button variant="secondary" size="sm" onClick={() => setSubmittingFor(a)}>
                        <Upload className="h-4 w-4" /> Submit
                      </Button>
                    )}
                    {isStaff && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setViewingSubmissionsFor(a)}>
                          <Users2 className="h-4 w-4" /> Submissions
                        </Button>
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
      <SubmissionDialog
        assignment={submittingFor}
        open={!!submittingFor}
        onOpenChange={(open) => !open && setSubmittingFor(null)}
        onSubmitted={load}
      />
      <SubmissionsDialog
        assignment={viewingSubmissionsFor}
        open={!!viewingSubmissionsFor}
        onOpenChange={(open) => !open && setViewingSubmissionsFor(null)}
      />
    </div>
  );
}
