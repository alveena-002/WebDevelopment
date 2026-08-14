import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import type { Patient, Appointment, Prescription, IntakeForm } from '@/lib/types';
import { Avatar, Spinner, EmptyState, StatusBadge, Modal, RiskBadge } from '@/components/ui';
import { age, formatDate, formatTime, cn } from '@/lib/utils';
import { AppointmentRow } from '@/components/Dashboard';
import { Search, UserPlus, Users, Phone, Mail, MapPin, Calendar, AlertCircle, FileText, Pill, X } from 'lucide-react';

export function Patients() {
  const { clinic } = useAuth();
  const { show } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Patient | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (!clinic) return;
    (async () => {
      const { data } = await supabase
        .from('patients')
        .select('*')
        .eq('clinic_id', clinic.id)
        .order('created_at', { ascending: false });
      setPatients((data ?? []) as Patient[]);
      setLoading(false);
    })();
  }, [clinic]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return patients;
    return patients.filter((p) =>
      `${p.first_name} ${p.last_name} ${p.email ?? ''} ${p.phone ?? ''} ${p.nhs_number ?? ''}`.toLowerCase().includes(q),
    );
  }, [patients, search]);

  async function addPatient(p: Partial<Patient>) {
    if (!clinic) return;
    const { data, error } = await supabase
      .from('patients')
      .insert({ ...p, clinic_id: clinic.id })
      .select()
      .single();
    if (error) { show('Could not add patient', 'error'); return; }
    setPatients((prev) => [data as Patient, ...prev]);
    setShowAdd(false);
    show('Patient added');
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-7 w-7 text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            className="input pl-10"
            placeholder="Search by name, NHS number, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <UserPlus className="h-4 w-4" />
          Add patient
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<Users className="h-7 w-7" />}
            title={search ? 'No patients found' : 'No patients yet'}
            description={search ? 'Try a different search term.' : 'Add your first patient to get started.'}
            action={!search && <button onClick={() => setShowAdd(true)} className="btn-primary"><UserPlus className="h-4 w-4" />Add patient</button>}
          />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="grid grid-cols-12 gap-4 border-b border-ink-100 bg-ink-50/50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
            <div className="col-span-5">Patient</div>
            <div className="col-span-2 hidden sm:block">Age</div>
            <div className="col-span-3 hidden md:block">Contact</div>
            <div className="col-span-2 hidden lg:block">Conditions</div>
          </div>
          <div className="divide-y divide-ink-100">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="grid w-full grid-cols-12 items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-ink-50"
              >
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <Avatar name={`${p.first_name} ${p.last_name}`} size="sm" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-ink-800">{p.first_name} {p.last_name}</div>
                    <div className="truncate text-xs text-ink-400">NHS {p.nhs_number ?? '—'}</div>
                  </div>
                </div>
                <div className="col-span-2 hidden sm:block text-sm text-ink-600">{age(p.date_of_birth) ?? '—'}</div>
                <div className="col-span-3 hidden md:block min-w-0">
                  <div className="truncate text-sm text-ink-600">{p.phone ?? '—'}</div>
                  <div className="truncate text-xs text-ink-400">{p.email ?? ''}</div>
                </div>
                <div className="col-span-2 hidden lg:block">
                  {p.allergies && p.allergies !== 'None' ? (
                    <span className="badge bg-red-50 text-red-600"><AlertCircle className="h-3 w-3" />{p.allergies}</span>
                  ) : (
                    <span className="text-xs text-ink-400">{p.medical_conditions ?? 'No conditions'}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selected && <PatientDrawer patient={selected} onClose={() => setSelected(null)} />}
      {showAdd && <AddPatientModal onClose={() => setShowAdd(false)} onSave={addPatient} />}
    </div>
  );
}

function PatientDrawer({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const { clinic } = useAuth();
  const [tab, setTab] = useState<'overview' | 'appointments' | 'prescriptions' | 'intake'>('overview');
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [rx, setRx] = useState<Prescription[]>([]);
  const [intakes, setIntakes] = useState<IntakeForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clinic) return;
    (async () => {
      const [a, r, i] = await Promise.all([
        supabase
          .from('appointments')
          .select('*, patient:patients(*), staff:clinic_staff(*)')
          .eq('patient_id', patient.id)
          .order('start_time', { ascending: false }),
        supabase
          .from('prescriptions')
          .select('*, staff:clinic_staff(*)')
          .eq('patient_id', patient.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('intake_forms')
          .select('*')
          .eq('patient_id', patient.id)
          .order('created_at', { ascending: false }),
      ]);
      setAppts((a.data ?? []) as Appointment[]);
      setRx((r.data ?? []) as Prescription[]);
      setIntakes((i.data ?? []) as IntakeForm[]);
      setLoading(false);
    })();
  }, [patient, clinic]);

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'appointments' as const, label: `Appointments (${appts.length})` },
    { id: 'prescriptions' as const, label: `Prescriptions (${rx.length})` },
    { id: 'intake' as const, label: `Intake (${intakes.length})` },
  ];

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-ink-900/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white shadow-float animate-slide-in overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-ink-100 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={`${patient.first_name} ${patient.last_name}`} size="lg" />
              <div>
                <h2 className="font-display text-lg font-bold text-ink-800">{patient.first_name} {patient.last_name}</h2>
                <div className="text-sm text-ink-400">
                  {age(patient.date_of_birth)} yrs · {patient.gender ?? '—'} · NHS {patient.nhs_number ?? '—'}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  tab === t.id ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-ink-100',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12"><Spinner className="h-6 w-6 text-brand-500" /></div>
          ) : tab === 'overview' ? (
            <div className="space-y-5">
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={patient.phone} />
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={patient.email} />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address" value={patient.address} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date of birth" value={patient.date_of_birth ? formatDate(patient.date_of_birth) : null} />
              <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
                  <AlertCircle className="h-4 w-4" /> Allergies
                </div>
                <div className="mt-1 text-sm text-red-600">{patient.allergies || 'None recorded'}</div>
              </div>
              <div className="rounded-xl border border-ink-100 bg-ink-50/50 p-4">
                <div className="text-sm font-semibold text-ink-700">Medical conditions</div>
                <div className="mt-1 text-sm text-ink-600">{patient.medical_conditions || 'None recorded'}</div>
              </div>
              {patient.notes && (
                <div className="rounded-xl border border-ink-100 p-4">
                  <div className="text-sm font-semibold text-ink-700">Notes</div>
                  <div className="mt-1 text-sm text-ink-600">{patient.notes}</div>
                </div>
              )}
            </div>
          ) : tab === 'appointments' ? (
            <div className="space-y-2.5">
              {appts.length === 0 ? <EmptyState title="No appointments" /> : appts.map((a) => <AppointmentRow key={a.id} appt={a} />)}
            </div>
          ) : tab === 'prescriptions' ? (
            <div className="space-y-2.5">
              {rx.length === 0 ? <EmptyState title="No prescriptions" /> : rx.map((r) => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <Pill className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-ink-800">{r.medication}</div>
                        <div className="text-xs text-ink-500">{r.dosage} · {r.frequency} · {r.quantity}</div>
                      </div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  {r.notes && <div className="mt-2 text-xs text-ink-400">{r.notes}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {intakes.length === 0 ? <EmptyState title="No intake forms" /> : intakes.map((i) => (
                <div key={i.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-ink-800">Intake form</div>
                        <div className="text-xs text-ink-400">{i.submitted_at ? `Submitted ${formatDate(i.submitted_at)}` : 'Pending'}</div>
                      </div>
                    </div>
                    <StatusBadge status={i.status} />
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {Object.entries(i.data).slice(0, 4).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="capitalize text-ink-400">{k.replace(/_/g, ' ')}</span>
                        <span className="font-medium text-ink-700">{Array.isArray(v) ? v.join(', ') : String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-100 text-ink-500">{icon}</div>
      <div className="flex-1">
        <div className="text-xs text-ink-400">{label}</div>
        <div className="text-sm text-ink-800">{value || '—'}</div>
      </div>
    </div>
  );
}

function AddPatientModal({ onClose, onSave }: { onClose: () => void; onSave: (p: Partial<Patient>) => void }) {
  const [form, setForm] = useState({
    first_name: '', last_name: '', date_of_birth: '', gender: 'female',
    phone: '', email: '', address: '', nhs_number: '', allergies: '', medical_conditions: '', notes: '',
  });

  return (
    <Modal open onClose={onClose} title="Add patient" size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">First name</label>
            <input className="input" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </div>
          <div>
            <label className="label">Last name</label>
            <input className="input" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Date of birth</label>
            <input type="date" className="input" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
          </div>
          <div>
            <label className="label">Gender</label>
            <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label">NHS number</label>
          <input className="input" value={form.nhs_number} onChange={(e) => setForm({ ...form, nhs_number: e.target.value })} />
        </div>
        <div>
          <label className="label">Address</label>
          <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Allergies</label>
            <input className="input" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} />
          </div>
          <div>
            <label className="label">Medical conditions</label>
            <input className="input" value={form.medical_conditions} onChange={(e) => setForm({ ...form, medical_conditions: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.first_name || !form.last_name}
            className="btn-primary"
          >
            Save patient
          </button>
        </div>
      </div>
    </Modal>
  );
}
