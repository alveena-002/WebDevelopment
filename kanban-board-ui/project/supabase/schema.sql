-- ============================================================
-- EduManage — Supabase Schema (Tables + RLS Policies)
-- Run this in Supabase SQL Editor after creating your project.
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- ROLE TYPE
-- ============================================================
do $$ begin
  create type user_role as enum ('super_admin', 'admin', 'teacher', 'student');
exception when duplicate_object then null; end $$;

do $$ begin
  create type assignment_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type submission_status as enum ('pending', 'submitted', 'late', 'graded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type attendance_status as enum ('present', 'absent', 'late', 'leave');
exception when duplicate_object then null; end $$;

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role user_role not null default 'student',
  avatar_url text,
  phone text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- COURSES
-- ============================================================
create table if not exists courses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  code text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- BATCHES
-- ============================================================
create table if not exists batches (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references courses(id) on delete cascade,
  name text not null,
  timing text not null,
  start_date date not null,
  end_date date,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TEACHERS
-- ============================================================
create table if not exists teachers (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  specialization text,
  created_at timestamptz not null default now()
);

-- Batch <-> Teacher assignment (many-to-many)
create table if not exists teacher_batches (
  teacher_id uuid not null references teachers(id) on delete cascade,
  batch_id uuid not null references batches(id) on delete cascade,
  primary key (teacher_id, batch_id)
);

-- ============================================================
-- STUDENTS
-- ============================================================
create table if not exists students (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  father_name text not null,
  address text,
  application_id text not null unique,
  course_id uuid not null references courses(id),
  batch_id uuid not null references batches(id),
  enrollment_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ASSIGNMENTS
-- ============================================================
create table if not exists assignments (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  course_id uuid not null references courses(id),
  batch_id uuid not null references batches(id),
  teacher_id uuid not null references teachers(id),
  due_date timestamptz not null,
  attachment_urls text[] not null default '{}',
  status assignment_status not null default 'published',
  created_at timestamptz not null default now()
);

-- ============================================================
-- ASSIGNMENT SUBMISSIONS
-- ============================================================
create table if not exists assignment_submissions (
  id uuid primary key default uuid_generate_v4(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  file_urls text[] not null default '{}',
  remarks text,
  status submission_status not null default 'pending',
  submitted_at timestamptz,
  grade text,
  created_at timestamptz not null default now(),
  unique (assignment_id, student_id)
);

-- ============================================================
-- ATTENDANCE
-- ============================================================
create table if not exists attendance (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references students(id) on delete cascade,
  batch_id uuid not null references batches(id),
  date date not null,
  status attendance_status not null,
  marked_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  unique (student_id, date)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ACTIVITY LOGS
-- ============================================================
create table if not exists activity_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_students_batch on students(batch_id);
create index if not exists idx_assignments_batch on assignments(batch_id);
create index if not exists idx_submissions_assignment on assignment_submissions(assignment_id);
create index if not exists idx_attendance_student_date on attendance(student_id, date);
create index if not exists idx_notifications_user on notifications(user_id);

-- ============================================================
-- HELPER FUNCTION: get current user's role
-- ============================================================
create or replace function auth_role() returns user_role
language sql security definer stable as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function is_admin() returns boolean
language sql security definer stable as $$
  select auth_role() in ('admin', 'super_admin');
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table courses enable row level security;
alter table batches enable row level security;
alter table teachers enable row level security;
alter table teacher_batches enable row level security;
alter table students enable row level security;
alter table assignments enable row level security;
alter table assignment_submissions enable row level security;
alter table attendance enable row level security;
alter table notifications enable row level security;
alter table activity_logs enable row level security;

-- PROFILES: users see their own profile; admins see all
create policy "profiles_select_own_or_admin" on profiles for select
  using (id = auth.uid() or is_admin());
create policy "profiles_insert_self" on profiles for insert
  with check (id = auth.uid());
create policy "profiles_update_own_or_admin" on profiles for update
  using (id = auth.uid() or is_admin());

-- COURSES / BATCHES: everyone authenticated can read; only admins write
create policy "courses_select_all" on courses for select using (auth.uid() is not null);
create policy "courses_write_admin" on courses for insert with check (is_admin());
create policy "courses_update_admin" on courses for update using (is_admin());
create policy "courses_delete_admin" on courses for delete using (is_admin());

create policy "batches_select_all" on batches for select using (auth.uid() is not null);
create policy "batches_write_admin" on batches for insert with check (is_admin());
create policy "batches_update_admin" on batches for update using (is_admin());
create policy "batches_delete_admin" on batches for delete using (is_admin());

-- TEACHERS
create policy "teachers_select_all" on teachers for select using (auth.uid() is not null);
create policy "teachers_write_self_or_admin" on teachers for insert with check (
  profile_id = auth.uid() or is_admin()
);
create policy "teachers_update_self_or_admin" on teachers for update
  using (profile_id = auth.uid() or is_admin());

create policy "teacher_batches_select_all" on teacher_batches for select using (auth.uid() is not null);
create policy "teacher_batches_write_admin" on teacher_batches for insert with check (is_admin());

-- STUDENTS: student sees own row; teacher sees their batch students; admin sees all
create policy "students_select_scoped" on students for select using (
  profile_id = auth.uid()
  or is_admin()
  or exists (
    select 1 from teachers t
    join teacher_batches tb on tb.teacher_id = t.id
    where t.profile_id = auth.uid() and tb.batch_id = students.batch_id
  )
);
create policy "students_write_self_or_admin" on students for insert with check (
  profile_id = auth.uid() or is_admin()
);
create policy "students_update_self_or_admin" on students for update
  using (profile_id = auth.uid() or is_admin());

-- ASSIGNMENTS: batch students + assigned teacher + admin can read; teacher/admin write
create policy "assignments_select_scoped" on assignments for select using (
  is_admin()
  or teacher_id in (select id from teachers where profile_id = auth.uid())
  or batch_id in (select batch_id from students where profile_id = auth.uid())
);
create policy "assignments_write_staff" on assignments for insert with check (
  is_admin() or auth_role() = 'teacher'
);
create policy "assignments_update_owner_or_admin" on assignments for update using (
  is_admin() or teacher_id in (select id from teachers where profile_id = auth.uid())
);
create policy "assignments_delete_owner_or_admin" on assignments for delete using (
  is_admin() or teacher_id in (select id from teachers where profile_id = auth.uid())
);

-- SUBMISSIONS: student manages own; teacher/admin see submissions for their batch
create policy "submissions_select_scoped" on assignment_submissions for select using (
  student_id in (select id from students where profile_id = auth.uid())
  or is_admin()
  or exists (
    select 1 from assignments a
    join teachers t on t.id = a.teacher_id
    where a.id = assignment_submissions.assignment_id and t.profile_id = auth.uid()
  )
);
create policy "submissions_insert_own" on assignment_submissions for insert with check (
  student_id in (select id from students where profile_id = auth.uid())
);
create policy "submissions_update_own_or_staff" on assignment_submissions for update using (
  student_id in (select id from students where profile_id = auth.uid())
  or is_admin()
  or exists (
    select 1 from assignments a
    join teachers t on t.id = a.teacher_id
    where a.id = assignment_submissions.assignment_id and t.profile_id = auth.uid()
  )
);

-- ATTENDANCE: student sees own; teacher/admin manage their batch
create policy "attendance_select_scoped" on attendance for select using (
  student_id in (select id from students where profile_id = auth.uid())
  or is_admin()
  or exists (
    select 1 from teachers t
    join teacher_batches tb on tb.teacher_id = t.id
    where t.profile_id = auth.uid() and tb.batch_id = attendance.batch_id
  )
);
create policy "attendance_write_staff" on attendance for insert with check (
  is_admin() or auth_role() = 'teacher'
);
create policy "attendance_update_staff" on attendance for update using (
  is_admin() or auth_role() = 'teacher'
);

-- NOTIFICATIONS: only the recipient (or admin) can read
create policy "notifications_select_own_or_admin" on notifications for select using (
  user_id = auth.uid() or is_admin()
);
create policy "notifications_update_own" on notifications for update using (user_id = auth.uid());
create policy "notifications_insert_staff" on notifications for insert with check (
  is_admin() or auth_role() = 'teacher'
);

-- ACTIVITY LOGS: admin only
create policy "activity_logs_select_admin" on activity_logs for select using (is_admin());
create policy "activity_logs_insert_any_authenticated" on activity_logs for insert with check (auth.uid() is not null);

-- ============================================================
-- STORAGE BUCKETS (run once)
-- ============================================================
insert into storage.buckets (id, name, public) values ('assignment-files', 'assignment-files', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
  on conflict (id) do nothing;

create policy "assignment_files_read" on storage.objects for select using (bucket_id = 'assignment-files');
create policy "assignment_files_write_authenticated" on storage.objects for insert with check (
  bucket_id = 'assignment-files' and auth.uid() is not null
);

create policy "avatars_read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_write_authenticated" on storage.objects for insert with check (
  bucket_id = 'avatars' and auth.uid() is not null
);
