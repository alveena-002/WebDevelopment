export type UserRole = "super_admin" | "admin" | "teacher" | "student";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string | null;
  created_at: string;
}

export interface Batch {
  id: string;
  course_id: string;
  name: string;
  timing: string;
  start_date: string;
  end_date: string | null;
}

export interface StudentProfile {
  id: string;
  profile_id: string;
  father_name: string;
  address: string | null;
  application_id: string;
  course_id: string;
  batch_id: string;
  enrollment_date: string;
}

export interface TeacherProfile {
  id: string;
  profile_id: string;
  specialization: string | null;
}

export type AssignmentStatus = "draft" | "published";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  course_id: string;
  batch_id: string;
  teacher_id: string;
  due_date: string;
  attachment_urls: string[];
  status: AssignmentStatus;
  created_at: string;
}

export type SubmissionStatus = "pending" | "submitted" | "late" | "graded";

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_urls: string[];
  remarks: string | null;
  status: SubmissionStatus;
  submitted_at: string | null;
  grade: string | null;
}

export type AttendanceStatus = "present" | "absent" | "late" | "leave";

export interface AttendanceRecord {
  id: string;
  student_id: string;
  batch_id: string;
  date: string;
  status: AttendanceStatus;
  marked_by: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
