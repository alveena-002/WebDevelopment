import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { assignmentsApi } from "@/api/assignmentsApi";
import { notificationsApi } from "@/api/notificationsApi";
import { activityApi } from "@/api/activityApi";
import { studentsApi } from "@/api/studentsApi";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Loader2, Upload, FileText } from "lucide-react";
import type { Assignment } from "@/types";

interface SubmissionDialogProps {
  assignment: Assignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}

export function SubmissionDialog({ assignment, open, onOpenChange, onSubmitted }: SubmissionDialogProps) {
  const profile = useAuthStore((s) => s.profile);
  const [file, setFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!profile || !assignment || !file) {
      toast.error("Please choose a file to submit");
      return;
    }
    setSaving(true);
    try {
      const studentRecord = await studentsApi.getByProfileId(profile.id);
      if (!studentRecord) {
        toast.error("Complete your student profile before submitting assignments.");
        setSaving(false);
        return;
      }

      const url = await assignmentsApi.uploadAttachment(file, assignment.id);
      const isLate = new Date() > new Date(assignment.due_date);
      await assignmentsApi.submit({
        assignment_id: assignment.id,
        student_id: studentRecord.id,
        file_urls: [url],
        remarks: remarks || null,
        status: isLate ? "late" : "submitted",
        submitted_at: new Date().toISOString(),
        grade: null,
      });

      await activityApi.log(profile.id, `${profile.full_name} submitted "${assignment.title}"`);

      // Notify the teacher who owns this assignment.
      try {
        const { data: teacherRow } = await supabase
          .from("teachers")
          .select("profile_id")
          .eq("id", assignment.teacher_id)
          .maybeSingle();
        if (teacherRow?.profile_id) {
          await notificationsApi.create({
            user_id: teacherRow.profile_id,
            title: "New submission",
            message: `${profile.full_name} submitted "${assignment.title}".`,
          });
        }
      } catch {
        // Best-effort notification; ignore failures.
      }

      toast.success("Assignment submitted");
      setFile(null);
      setRemarks("");
      onSubmitted();
      onOpenChange(false);
    } catch {
      toast.error("Submission failed. Check Supabase Storage setup.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit: {assignment?.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>File (PDF or Image)</Label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground hover:bg-accent">
              <Upload className="h-4 w-4" />
              {file ? file.name : "Click to choose a file"}
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {file && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" /> {file.name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Remarks (optional)</Label>
            <Textarea
              rows={3}
              placeholder="Any notes for your teacher..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
