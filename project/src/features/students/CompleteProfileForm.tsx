import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { studentProfileSchema, type StudentProfileInput } from "./schemas";
import { studentsApi } from "@/api/studentsApi";
import { coursesApi, batchesApi } from "@/api/coursesApi";
import { supabase } from "@/lib/supabase";
import { activityApi } from "@/api/activityApi";
import { useAuthStore } from "@/store/authStore";
import type { Course, Batch } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Loader2, Upload, UserCircle } from "lucide-react";

export function CompleteProfileForm({ onComplete }: { onComplete: () => void }) {
  const profile = useAuthStore((s) => s.profile);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url ?? null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<StudentProfileInput>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: { enrollment_date: new Date().toISOString().slice(0, 10) },
  });

  const selectedCourseId = watch("course_id");

  useEffect(() => {
    (async () => {
      try {
        setCourses(await coursesApi.list());
      } catch {
        setCourses([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      setBatches([]);
      return;
    }
    (async () => {
      try {
        setBatches(await batchesApi.list(selectedCourseId));
      } catch {
        setBatches([]);
      }
    })();
  }, [selectedCourseId]);

  const onAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: StudentProfileInput) => {
    if (!profile) return;
    setSaving(true);
    try {
      if (avatarFile) {
        await studentsApi.uploadAvatar(avatarFile, profile.id);
      }
      const { phone, ...studentFields } = values;
      await supabase.from("profiles").update({ phone }).eq("id", profile.id);
      await studentsApi.create({
        profile_id: profile.id,
        ...studentFields,
      });
      await activityApi.log(profile.id, `${profile.full_name} joined as a student`);
      toast.success("Profile completed");
      onComplete();
    } catch (err) {
      toast.error("Could not save profile. Ask your admin to add a Course and Batch first.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Complete your student profile</CardTitle>
        <CardDescription>
          We need a few more details before you can see your assignments and attendance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-4">
            {avatarPreview ? (
              <Avatar src={avatarPreview} name={profile?.full_name ?? ""} size="xl" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <UserCircle className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <label>
              <Button type="button" variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4" /> Upload photo
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onAvatarChange(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="father_name">Father's name</Label>
              <Input id="father_name" {...register("father_name")} />
              {errors.father_name && <p className="text-sm text-destructive">{errors.father_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="03xx-xxxxxxx" {...register("phone")} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="application_id">Application ID</Label>
            <Input id="application_id" placeholder="e.g. FA23-BCS-002" {...register("application_id")} />
            {errors.application_id && <p className="text-sm text-destructive">{errors.application_id.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
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
                      {batches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name} ({b.timing})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.batch_id && <p className="text-sm text-destructive">{errors.batch_id.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="enrollment_date">Enrollment date</Label>
            <Input id="enrollment_date" type="date" {...register("enrollment_date")} />
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
