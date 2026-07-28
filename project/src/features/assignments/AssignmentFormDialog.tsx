import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { assignmentSchema, type AssignmentInput } from "./schemas";
import { assignmentsApi } from "@/api/assignmentsApi";
import { coursesApi, batchesApi } from "@/api/coursesApi";
import { teachersApi } from "@/api/teachersApi";
import { useAuthStore } from "@/store/authStore";
import type { Course, Batch, Assignment } from "@/types";
import { Loader2, Upload, FileText } from "lucide-react";

interface AssignmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  assignment?: Assignment | null;
}

export function AssignmentFormDialog({ open, onOpenChange, onSaved, assignment }: AssignmentFormDialogProps) {
  const profile = useAuthStore((s) => s.profile);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AssignmentInput>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: assignment?.title ?? "",
      description: assignment?.description ?? "",
      course_id: assignment?.course_id ?? "",
      batch_id: assignment?.batch_id ?? "",
      due_date: assignment?.due_date ? assignment.due_date.slice(0, 10) : "",
    },
  });

  const selectedCourseId = watch("course_id");

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const courseList = await coursesApi.list();
        setCourses(courseList);
      } catch {
        setCourses([]);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!selectedCourseId) {
      setBatches([]);
      return;
    }
    (async () => {
      try {
        const batchList = await batchesApi.list(selectedCourseId);
        setBatches(batchList);
      } catch {
        setBatches([]);
      }
    })();
  }, [selectedCourseId]);

  useEffect(() => {
    reset({
      title: assignment?.title ?? "",
      description: assignment?.description ?? "",
      course_id: assignment?.course_id ?? "",
      batch_id: assignment?.batch_id ?? "",
      due_date: assignment?.due_date ? assignment.due_date.slice(0, 10) : "",
    });
    setFiles([]);
  }, [assignment, open, reset]);

  const onSubmit = async (values: AssignmentInput) => {
    if (!profile) return;
    setSaving(true);
    try {
      let attachmentUrls: string[] = assignment?.attachment_urls ?? [];

      if (assignment) {
        const updated = await assignmentsApi.update(assignment.id, {
          ...values,
          due_date: new Date(values.due_date).toISOString(),
        });
        if (files.length > 0) {
          const uploaded = await Promise.all(files.map((f) => assignmentsApi.uploadAttachment(f, updated.id)));
          attachmentUrls = [...attachmentUrls, ...uploaded];
          await assignmentsApi.update(updated.id, { attachment_urls: attachmentUrls });
        }
        toast.success("Assignment updated");
      } else {
        const teacherRecord = await teachersApi.getByProfileId(profile.id);
        if (!teacherRecord) {
          toast.error("Only users with a teacher profile can create assignments. Sign in as a teacher account.");
          setSaving(false);
          return;
        }
        const created = await assignmentsApi.create({
          ...values,
          teacher_id: teacherRecord.id,
          attachment_urls: [],
          status: "published",
        });
        if (files.length > 0) {
          const uploaded = await Promise.all(files.map((f) => assignmentsApi.uploadAttachment(f, created.id)));
          await assignmentsApi.update(created.id, { attachment_urls: uploaded });
        }
        toast.success("Assignment created");
      }

      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error("Could not save assignment. Make sure Supabase schema is applied and a teacher profile exists.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{assignment ? "Edit Assignment" : "New Assignment"}</DialogTitle>
          <DialogDescription>
            {assignment ? "Update assignment details." : "Create an assignment for a course batch."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Database Normalization Exercise" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} placeholder="Assignment instructions..." {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Course</Label>
              <Controller
                name="course_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">No courses yet</div>
                      ) : (
                        courses.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.course_id && <p className="text-sm text-destructive">{errors.course_id.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Batch</Label>
              <Controller
                name="batch_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">No batches for this course</div>
                      ) : (
                        batches.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.batch_id && <p className="text-sm text-destructive">{errors.batch_id.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due date</Label>
            <Input id="due_date" type="date" {...register("due_date")} />
            {errors.due_date && <p className="text-sm text-destructive">{errors.due_date.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Attachments (PDF / Images)</Label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground hover:bg-accent">
              <Upload className="h-4 w-4" />
              {files.length > 0 ? `${files.length} file(s) selected` : "Click to choose files"}
              <input
                type="file"
                multiple
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />
            </label>
            {files.length > 0 && (
              <ul className="space-y-1">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" /> {f.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {assignment ? "Save changes" : "Create assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
