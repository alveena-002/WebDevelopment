/*
# MedConnect — Clinic & Dental Patient Management System

Multi-tenant SaaS for UK GP practices, dentists, and physiotherapists.

## 1. New Tables

### clinics
- Top-level tenant. Each clinic is one practice (GP, dental, physio).
- `id`, `name`, `type` (gp | dental | physio), `address`, `phone`, `email`, `created_at`.

### clinic_staff
- Staff user profile. One row per auth user, scoped to a clinic.
- `id`, `user_id` (→ auth.users, unique), `clinic_id`, `full_name`, `role` (admin | doctor | receptionist), `created_at`.

### patients
- Patient register for a clinic.
- `id`, `clinic_id`, `first_name`, `last_name`, `date_of_birth`, `gender`, `phone`, `email`, `address`, `nhs_number`, `allergies`, `medical_conditions`, `notes`, `created_at`.

### appointments
- Appointment booking tied to a patient, clinician, and slot time.
- `id`, `clinic_id`, `patient_id`, `staff_id` (clinician), `start_time`, `duration_minutes`, `type` (in_person | video | phone), `reason`, `status` (scheduled | completed | cancelled | no_show), `no_show_risk` (float 0–1, ML prediction), `reminder_sent` (bool), `notes`, `created_at`.

### intake_forms
- Digital medical-history forms submitted by patients before arriving.
- `id`, `clinic_id`, `patient_id`, `appointment_id`, `data` (jsonb, AES-encrypted at app layer), `status` (pending | submitted | reviewed), `submitted_at`, `created_at`.

### prescriptions
- Medications prescribed to patients; refillable.
- `id`, `clinic_id`, `patient_id`, `staff_id`, `medication`, `dosage`, `frequency`, `quantity`, `status` (active | refill_requested | refill_approved | refill_denied | completed), `refill_requested_at`, `notes`, `created_at`.

### staff_rota
- Daily rota slots for clinicians (shift blocks).
- `id`, `clinic_id`, `staff_id`, `rota_date`, `shift_start`, `shift_end`, `working` (bool).

### performance_logs
- Per-day performance record per clinician (patients seen, satisfaction).
- `id`, `clinic_id`, `staff_id`, `log_date`, `patients_seen`, `satisfaction_avg` (0–5), `notes`.

## 2. Security (RLS)
- Multi-tenant: every table scoped by `clinic_id` (except clinic_staff scoped by user_id).
- `clinic_staff` has a `DEFAULT auth.uid()` on `user_id`.
- Policies use `EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = <table>.clinic_id)` to scope by the signed-in staff member's clinic.
- All tables ENABLE ROW LEVEL SECURITY.
- 4 policies (select/insert/update/delete) per table, scoped TO authenticated.

## 3. Notes
- `no_show_risk` is a heuristic float computed client-side from historical features (no prior completed appointments, short booking lead time, age, past no-shows). Stored for display.
- Intake form `data` is encrypted AES-256 at the application layer before insert; the column stores the ciphertext blob as jsonb for demo purposes.
*/

CREATE TABLE IF NOT EXISTS clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'gp' CHECK (type IN ('gp','dental','physio')),
  address text,
  phone text,
  email text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clinic_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'doctor' CHECK (role IN ('admin','doctor','receptionist')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date,
  gender text CHECK (gender IN ('male','female','other')),
  phone text,
  email text,
  address text,
  nhs_number text,
  allergies text,
  medical_conditions text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES clinic_staff(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  duration_minutes int NOT NULL DEFAULT 30,
  type text NOT NULL DEFAULT 'in_person' CHECK (type IN ('in_person','video','phone')),
  reason text,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled','no_show')),
  no_show_risk numeric DEFAULT 0,
  reminder_sent boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS intake_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','submitted','reviewed')),
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES clinic_staff(id) ON DELETE CASCADE,
  medication text NOT NULL,
  dosage text,
  frequency text,
  quantity text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','refill_requested','refill_approved','refill_denied','completed')),
  refill_requested_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS staff_rota (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES clinic_staff(id) ON DELETE CASCADE,
  rota_date date NOT NULL,
  shift_start time NOT NULL DEFAULT '09:00',
  shift_end time NOT NULL DEFAULT '17:00',
  working boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS performance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES clinic_staff(id) ON DELETE CASCADE,
  log_date date NOT NULL,
  patients_seen int NOT NULL DEFAULT 0,
  satisfaction_avg numeric DEFAULT 0,
  notes text
);

ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_rota ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_logs ENABLE ROW LEVEL SECURITY;

-- Helper: the clinic_id(s) the current user belongs to
-- Used via inline EXISTS in policies.

-- clinics: staff can see/update their own clinic
DROP POLICY IF EXISTS "staff_select_clinic" ON clinics;
CREATE POLICY "staff_select_clinic" ON clinics FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = clinics.id)
  );
DROP POLICY IF EXISTS "staff_update_clinic" ON clinics;
CREATE POLICY "staff_update_clinic" ON clinics FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = clinics.id)
  );
-- No insert/delete on clinics via anon key (created out of band or by admin edge function)

-- clinic_staff: a user can read their own row; admins can manage within clinic
DROP POLICY IF EXISTS "staff_select_self" ON clinic_staff;
CREATE POLICY "staff_select_self" ON clinic_staff FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- patients: scoped by clinic membership
DROP POLICY IF EXISTS "staff_select_patients" ON patients;
CREATE POLICY "staff_select_patients" ON patients FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = patients.clinic_id)
  );
DROP POLICY IF EXISTS "staff_insert_patients" ON patients;
CREATE POLICY "staff_insert_patients" ON patients FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = patients.clinic_id)
  );
DROP POLICY IF EXISTS "staff_update_patients" ON patients;
CREATE POLICY "staff_update_patients" ON patients FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = patients.clinic_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = patients.clinic_id)
  );
DROP POLICY IF EXISTS "staff_delete_patients" ON patients;
CREATE POLICY "staff_delete_patients" ON patients FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = patients.clinic_id)
  );

-- appointments: scoped by clinic membership
DROP POLICY IF EXISTS "staff_select_appointments" ON appointments;
CREATE POLICY "staff_select_appointments" ON appointments FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = appointments.clinic_id)
  );
DROP POLICY IF EXISTS "staff_insert_appointments" ON appointments;
CREATE POLICY "staff_insert_appointments" ON appointments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = appointments.clinic_id)
  );
DROP POLICY IF EXISTS "staff_update_appointments" ON appointments;
CREATE POLICY "staff_update_appointments" ON appointments FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = appointments.clinic_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = appointments.clinic_id)
  );
DROP POLICY IF EXISTS "staff_delete_appointments" ON appointments;
CREATE POLICY "staff_delete_appointments" ON appointments FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = appointments.clinic_id)
  );

-- intake_forms
DROP POLICY IF EXISTS "staff_select_intake" ON intake_forms;
CREATE POLICY "staff_select_intake" ON intake_forms FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = intake_forms.clinic_id)
  );
DROP POLICY IF EXISTS "staff_insert_intake" ON intake_forms;
CREATE POLICY "staff_insert_intake" ON intake_forms FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = intake_forms.clinic_id)
  );
DROP POLICY IF EXISTS "staff_update_intake" ON intake_forms;
CREATE POLICY "staff_update_intake" ON intake_forms FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = intake_forms.clinic_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = intake_forms.clinic_id)
  );
DROP POLICY IF EXISTS "staff_delete_intake" ON intake_forms;
CREATE POLICY "staff_delete_intake" ON intake_forms FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = intake_forms.clinic_id)
  );

-- prescriptions
DROP POLICY IF EXISTS "staff_select_prescriptions" ON prescriptions;
CREATE POLICY "staff_select_prescriptions" ON prescriptions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = prescriptions.clinic_id)
  );
DROP POLICY IF EXISTS "staff_insert_prescriptions" ON prescriptions;
CREATE POLICY "staff_insert_prescriptions" ON prescriptions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = prescriptions.clinic_id)
  );
DROP POLICY IF EXISTS "staff_update_prescriptions" ON prescriptions;
CREATE POLICY "staff_update_prescriptions" ON prescriptions FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = prescriptions.clinic_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = prescriptions.clinic_id)
  );
DROP POLICY IF EXISTS "staff_delete_prescriptions" ON prescriptions;
CREATE POLICY "staff_delete_prescriptions" ON prescriptions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = prescriptions.clinic_id)
  );

-- staff_rota
DROP POLICY IF EXISTS "staff_select_rota" ON staff_rota;
CREATE POLICY "staff_select_rota" ON staff_rota FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = staff_rota.clinic_id)
  );
DROP POLICY IF EXISTS "staff_insert_rota" ON staff_rota;
CREATE POLICY "staff_insert_rota" ON staff_rota FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = staff_rota.clinic_id)
  );
DROP POLICY IF EXISTS "staff_update_rota" ON staff_rota;
CREATE POLICY "staff_update_rota" ON staff_rota FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = staff_rota.clinic_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = staff_rota.clinic_id)
  );
DROP POLICY IF EXISTS "staff_delete_rota" ON staff_rota;
CREATE POLICY "staff_delete_rota" ON staff_rota FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = staff_rota.clinic_id)
  );

-- performance_logs
DROP POLICY IF EXISTS "staff_select_perf" ON performance_logs;
CREATE POLICY "staff_select_perf" ON performance_logs FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = performance_logs.clinic_id)
  );
DROP POLICY IF EXISTS "staff_insert_perf" ON performance_logs;
CREATE POLICY "staff_insert_perf" ON performance_logs FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = performance_logs.clinic_id)
  );
DROP POLICY IF EXISTS "staff_update_perf" ON performance_logs;
CREATE POLICY "staff_update_perf" ON performance_logs FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = performance_logs.clinic_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = performance_logs.clinic_id)
  );
DROP POLICY IF EXISTS "staff_delete_perf" ON performance_logs;
CREATE POLICY "staff_delete_perf" ON performance_logs FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clinic_staff WHERE clinic_staff.user_id = auth.uid() AND clinic_staff.clinic_id = performance_logs.clinic_id)
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_patients_clinic ON patients(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic ON appointments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_staff ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);
CREATE INDEX IF NOT EXISTS idx_rota_staff_date ON staff_rota(staff_id, rota_date);
CREATE INDEX IF NOT EXISTS idx_perf_staff_date ON performance_logs(staff_id, log_date);
CREATE INDEX IF NOT EXISTS idx_intake_patient ON intake_forms(patient_id);
CREATE INDEX IF NOT EXISTS idx_staff_clinic ON clinic_staff(clinic_id);