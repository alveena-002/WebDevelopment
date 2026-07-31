import { useEffect, useState } from "react";
import { coursesApi, batchesApi, teacherBatchesApi } from "@/api/coursesApi";
import { teachersApi } from "@/api/teachersApi";
import type { Course, Batch, TeacherProfile, Profile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { BookOpen, Plus, Layers, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [teachers, setTeachers] = useState<(TeacherProfile & { profiles: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");

  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [batchCourseId, setBatchCourseId] = useState("");
  const [batchName, setBatchName] = useState("");
  const [batchTiming, setBatchTiming] = useState("");
  const [batchStart, setBatchStart] = useState("");

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignBatch, setAssignBatch] = useState<Batch | null>(null);
  const [assignTeacherId, setAssignTeacherId] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [c, b, t] = await Promise.all([coursesApi.list(), batchesApi.list(), teachersApi.list()]);
      setCourses(c);
      setBatches(b);
      setTeachers(t);
    } catch {
      setCourses([]);
      setBatches([]);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddCourse = async () => {
    if (!courseName || !courseCode) {
      toast.error("Name and code are required");
      return;
    }
    try {
      await coursesApi.create({ name: courseName, code: courseCode, description: null });
      toast.success("Course added");
      setCourseDialogOpen(false);
      setCourseName("");
      setCourseCode("");
      load();
    } catch {
      toast.error("Could not add course");
    }
  };

  const handleAddBatch = async () => {
    if (!batchCourseId || !batchName || !batchTiming || !batchStart) {
      toast.error("All fields are required");
      return;
    }
    try {
      await batchesApi.create({
        course_id: batchCourseId,
        name: batchName,
        timing: batchTiming,
        start_date: batchStart,
        end_date: null,
      });
      toast.success("Batch added");
      setBatchDialogOpen(false);
      setBatchName("");
      setBatchTiming("");
      setBatchStart("");
      load();
    } catch {
      toast.error("Could not add batch");
    }
  };

  const openAssign = (batch: Batch) => {
    setAssignBatch(batch);
    setAssignTeacherId("");
    setAssignDialogOpen(true);
  };

  const handleAssignTeacher = async () => {
    if (!assignBatch || !assignTeacherId) return;
    try {
      await teacherBatchesApi.assign(assignTeacherId, assignBatch.id);
      toast.success("Teacher assigned to batch");
      setAssignDialogOpen(false);
    } catch {
      toast.error("Could not assign teacher (they may already be assigned to this batch)");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Courses & Batches</h1>
        <p className="text-sm text-muted-foreground">Set these up first — assignments and students are linked to them.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4" /> Courses
            </CardTitle>
            <Button size="sm" onClick={() => setCourseDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-20" />
            ) : courses.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No courses yet.</p>
            ) : (
              <ul className="space-y-2">
                {courses.map((c) => (
                  <li key={c.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                    <span>{c.name}</span>
                    <span className="text-muted-foreground">{c.code}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4" /> Batches
            </CardTitle>
            <Button size="sm" onClick={() => setBatchDialogOpen(true)} disabled={courses.length === 0}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-20" />
            ) : batches.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {courses.length === 0 ? "Add a course first." : "No batches yet."}
              </p>
            ) : (
              <ul className="space-y-2">
                {batches.map((b) => (
                  <li key={b.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                    <div>
                      <span>{b.name}</span>
                      <span className="ml-2 text-muted-foreground">{b.timing}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => openAssign(b)}>
                      <UserPlus className="h-4 w-4" /> Assign Teacher
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Course name</Label>
              <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="e.g. Web Development" />
            </div>
            <div className="space-y-2">
              <Label>Course code</Label>
              <Input value={courseCode} onChange={(e) => setCourseCode(e.target.value)} placeholder="e.g. WD-101" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCourse}>Add course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Batch</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Course</Label>
              <Select onValueChange={setBatchCourseId} value={batchCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Batch name</Label>
              <Input value={batchName} onChange={(e) => setBatchName(e.target.value)} placeholder="e.g. Morning Batch A" />
            </div>
            <div className="space-y-2">
              <Label>Timing</Label>
              <Input value={batchTiming} onChange={(e) => setBatchTiming(e.target.value)} placeholder="e.g. 9:00 AM - 11:00 AM" />
            </div>
            <div className="space-y-2">
              <Label>Start date</Label>
              <Input type="date" value={batchStart} onChange={(e) => setBatchStart(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddBatch}>Add batch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Teacher to {assignBatch?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Teacher</Label>
            <Select onValueChange={setAssignTeacherId} value={assignTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">No teacher accounts yet</div>
                ) : (
                  teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.profiles?.full_name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignTeacher} disabled={!assignTeacherId}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
