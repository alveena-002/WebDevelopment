export type ClinicType = 'gp' | 'dental' | 'physio';
export type StaffRole = 'admin' | 'doctor' | 'receptionist';
export type AppointmentType = 'in_person' | 'video' | 'phone';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';
export type IntakeStatus = 'pending' | 'submitted' | 'reviewed';
export type PrescriptionStatus =
  | 'active'
  | 'refill_requested'
  | 'refill_approved'
  | 'refill_denied'
  | 'completed';

export interface Clinic {
  id: string;
  name: string;
  type: ClinicType;
  address: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
}

export interface StaffMember {
  id: string;
  user_id: string;
  clinic_id: string;
  full_name: string;
  role: StaffRole;
  created_at: string;
}

export interface Patient {
  id: string;
  clinic_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  nhs_number: string | null;
  allergies: string | null;
  medical_conditions: string | null;
  notes: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  clinic_id: string;
  patient_id: string;
  staff_id: string;
  start_time: string;
  duration_minutes: number;
  type: AppointmentType;
  reason: string | null;
  status: AppointmentStatus;
  no_show_risk: number;
  reminder_sent: boolean;
  notes: string | null;
  created_at: string;
  patient?: Patient;
  staff?: StaffMember;
}

export interface IntakeForm {
  id: string;
  clinic_id: string;
  patient_id: string;
  appointment_id: string | null;
  data: Record<string, unknown>;
  status: IntakeStatus;
  submitted_at: string | null;
  created_at: string;
  patient?: Patient;
}

export interface Prescription {
  id: string;
  clinic_id: string;
  patient_id: string;
  staff_id: string;
  medication: string;
  dosage: string | null;
  frequency: string | null;
  quantity: string | null;
  status: PrescriptionStatus;
  refill_requested_at: string | null;
  notes: string | null;
  created_at: string;
  patient?: Patient;
  staff?: StaffMember;
}

export interface RotaEntry {
  id: string;
  clinic_id: string;
  staff_id: string;
  rota_date: string;
  shift_start: string;
  shift_end: string;
  working: boolean;
  staff?: StaffMember;
}

export interface PerformanceLog {
  id: string;
  clinic_id: string;
  staff_id: string;
  log_date: string;
  patients_seen: number;
  satisfaction_avg: number;
  notes: string | null;
  staff?: StaffMember;
}
