import { useEffect, useState } from "react";
import { coursesApi, batchesApi } from "@/api/coursesApi";
import type { Course, Batch } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { BookOpen, Plus, Layers } from "lucide-react";
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
  const [loading, setLoading] = useState(true);

  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");

  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [batchCourseId, setBatchCourseId] = useState("");
  const [batchName, setBatchName] = useState("");
  const [batchTiming, setBatchTiming] = useState("");
  const [batchStart, setBatchStart] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [c, b] = await Promise.all([coursesApi.list(), batchesApi.list()]);
      setCourses(c);
      setBatches(b);
    } catch {
      setCourses([]);
      setBatches([]);
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
                    <span>{b.name}</span>
                    <span className="text-muted-foreground">{b.timing}</span>
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
    </div>
  );
}
