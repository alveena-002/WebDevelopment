live link

https://edumanage-project.vercel.app/

# EduManage — Student Assignments & Attendance Management

A production-ready full-stack web app for managing student assignments and attendance at an
educational institute. Built with React (Vite + TypeScript), Tailwind CSS, shadcn/ui, and Supabase.

## Tech Stack

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui (Radix primitives)
- React Router v6
- React Hook Form + Zod validation
- Zustand (auth/session state)
- TanStack Table (data tables)
- Supabase (Auth, Postgres, Storage, RLS)

## Folder Structure

```
src/
  api/              # API layer — all Supabase calls live here, not in components
  components/
    ui/             # shadcn/ui primitives (Button, Input, Card, ...)
    layout/         # Sidebar, Navbar, DashboardLayout
  features/
    auth/           # Login, Signup, Forgot/Reset Password + zod schemas
    dashboard/      # Role-specific dashboards
    students/       # Student list + profile
    assignments/    # Assignment CRUD + submission flow
    attendance/      # Attendance marking + reports
  store/            # Zustand stores (authStore)
  routes/           # AppRoutes, ProtectedRoute (role-based guards)
  types/            # Shared TypeScript types
  lib/              # supabase client, utils (cn, formatDate, ...)
supabase/
  schema.sql        # Full normalized schema + RLS policies + storage buckets
```

This structure keeps UI, data-fetching (`api/`), and state (`store/`) separate on purpose —
so the same `api/` and `store/` layers can be reused later if you wrap this app in
**Tauri** or **Electron** for a desktop build; only the routing/shell would change.

## 1. Local Setup

```bash
npm install
cp .env.example .env
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
npm run dev
```

App runs at `http://localhost:5173`.

## 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings → API** and copy the `Project URL` and `anon public` key into `.env`.
3. Open **SQL Editor** and run the entire contents of `supabase/schema.sql`. This creates:
   - All tables: `profiles`, `courses`, `batches`, `teachers`, `students`,
     `assignments`, `assignment_submissions`, `attendance`, `notifications`, `activity_logs`
   - Enums for role/status fields
   - Foreign keys and indexes
   - Row Level Security policies scoped by role (student sees only their own data,
     teacher sees their assigned batches, admin/super_admin sees everything)
   - Storage buckets `assignment-files` and `avatars` with policies
4. Go to **Authentication → Providers** and make sure Email auth is enabled.
5. Under **Authentication → URL Configuration**, set your Site URL and add
   `http://localhost:5173/reset-password` (and your production URL) as a redirect URL —
   required for the "Forgot Password" email link to work.

### Creating your first Super Admin

Sign up normally through the app (role = admin at signup, since `super_admin` isn't
exposed in the UI for security). Then in the SQL Editor, promote that user:

```sql
update profiles set role = 'super_admin' where email = 'you@institute.edu';
```

## 3. Deploying to Vercel

```bash
npm run build   # sanity-check the production build locally
```

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Framework preset: **Vite**.
4. Add environment variables in Vercel's project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. Update your Supabase Auth redirect URLs to include the new Vercel domain.

## 4. What's Implemented

- Full Supabase Auth flow: Login, Signup (with role selection), Forgot Password, Reset Password
- Role-based route protection (`super_admin`, `admin`, `teacher`, `student`)
- Dashboard shell with Sidebar, Navbar, dark mode toggle, search bar
- Role-specific dashboards (Admin/Teacher/Student) wired to live Supabase queries, including
  attendance rate and per-teacher class/student/assignment counts
- **Courses & Batches** management (Admin) — add courses, add batches, assign teachers to batches
- **Students module** — searchable, paginated table with full profile (photo, father name, phone,
  address, application ID, course, batch, enrollment date) and a detail view dialog. Students
  complete their own profile (with photo upload) on first login.
- **Assignments module** — full Create/Edit/Delete form (course + batch selection, due date,
  PDF/image upload), course/batch filters, student submission flow with file upload and remarks,
  automatic late-submission detection, status badges, and a **grading view** for teachers
  (per-student submission list with file download and grade entry)
- **Attendance module** — teacher selects a batch + date, loads the real class roster, marks
  Present/Absent/Late/Leave, saves to Supabase; a 30-day per-student attendance % report renders
  below the roster; students see their own attendance history
- **Manage Users** (Admin) — view all users, change roles
- **Reports** — live counts (students, assignments, submissions, attendance records) plus CSV
  export for Students, Assignments, and Attendance
- **Settings** — edit profile + photo, change password, theme toggle
- **Notifications** — auto-created when a new assignment is posted (to the batch's students), when
  a student submits (to the assignment's teacher), and when a submission is graded (to the
  student); list view with mark as read / mark all as read
- **Activity Log** — real actions (student joined, assignment created/updated, attendance marked,
  submissions) feed the Admin dashboard's Recent Activity panel
- Loading skeletons, empty states, retry-able error states, and toast notifications throughout

## 5. Suggested Next Steps

This covers the full feature list from the original spec at a working level. A few things worth
polishing before a real production rollout:

- Bulk student import (CSV) for admins, instead of one-by-one self-signup
- Supabase Edge Functions for server-side logic (e.g. emailing on new assignment)
- Code-splitting (the bundle is a single ~775KB chunk — fine for a student project, but worth
  splitting with `React.lazy()` per route before a larger production deployment)
- Generate real Supabase types: `npx supabase gen types typescript --project-id <id> > src/types/database.ts`

## 6. Known one-time setup gotchas

If you signed up teacher/student accounts **before** applying the latest schema, their
`teachers` / `students` rows may not exist yet (older code paths didn't create them). If a
teacher gets "Only users with a teacher profile can create assignments," or a student's profile
won't save, run:

```sql
-- backfill a missing teacher row
insert into teachers (profile_id) select id from profiles where email = 'the-email@example.com';
```

New signups after this schema don't need this — it's handled automatically.

## License

Use freely for your institute's project.

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/a51eb2ee-83fd-4040-adc0-32f2d93e4f2e" />


<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/33f63a68-0645-4ca5-9b4a-672e495276fc" />


<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/b0f4d781-c90d-456d-b759-490b01c19ddb" />


<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/b9fae189-a099-4fe4-ae98-ea2a837bd531" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/ed72fa10-e296-4b99-92fe-1c65ce5ba103" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/b9586e61-b8dc-419f-b55a-a0fe5da9c2cb" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/be62f144-dc49-46bb-9322-cb4bfb6e595b" />


<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/7bae7dd5-336c-440d-8962-6491acd8cfbc" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/99dd158d-1f7f-43ee-b4ff-dfff84f341ea" />


<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/4cc82744-7aa0-4d49-b39a-2fd92f2ad931" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/70f9e197-dbb7-40f3-b30a-9d0f87ac26b1" />


<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/ca63ea45-3d5b-44cf-922b-6392acf2a641" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/cfcc8863-2db1-4220-b07d-d7ad34f7417e" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/01292c87-8218-4f5d-914a-866894b71d39" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/4eae605c-5ffb-4998-83c9-03f0458d7dcc" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/ed975032-7585-4e26-a8e2-9c3501fef9df" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/009309a0-f27b-4baa-a457-cf832bdff3a3" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/a7b45648-72b5-4ea9-a7c9-295be0041ba5" />
<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/f15b1e87-e278-449d-bb18-1abd0fff1d88" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/85aecb58-7b3c-4c0c-8f0e-1d228511fd1b" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/8a646f74-7b15-499e-b19a-075d3ed3eb49" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/23c29b5b-67a8-464d-be69-51da8b69bb52" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/5a7be4f4-3d0c-4611-a568-e6e2d04d70fa" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/1bcb630f-fa5f-4773-8106-b1a544a203bd" />


<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/21bdba4f-b381-45b3-994b-51e6671710a9" />


<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/9bfce46d-568e-4a8b-a261-c7dcaa8abf58" />


<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/d19f4ef8-77a2-4aea-aa17-d20ea22f2779" />



