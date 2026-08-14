import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import type { Appointment, Patient, StaffMember, AppointmentType, AppointmentStatus } from '@/lib/types';
import { Spinner, EmptyState, StatusBadge, Modal, RiskBadge } from '@/components/ui';
import { AppointmentRow } from '@/components/Dashboard';
import { cn, formatTime, formatDate, riskLevel, addDays, toYMD } from '@/lib/utils';
import { CalendarClock, Plus, Bell, Video, Phone, MapPin, Check, X, Calendar, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

type FilterKey = 'all' | 'today' | 'scheduled' | 'completed' | 'no_show';

export function Appointments() {
  const { clinic, staff } = useAuth();
  const { show } = useToast();
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('today');
  const [showBook, setShowBook] = useState(false);
  const [reminderAppt, setReminderAppt] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!clinic) return;
    (async () => {
      const [{ data: a }, { data: p }, { data: s }] = await Promise.all([
        supabase
          .from('appointments')
          .select('*, patient:patients(*), staff:clinic_staff(*)')
          .eq('clinic_id', clinic.id)
          .order('start_time', { ascending: true }),
        supabase.from('patients').select('*').eq('clinic_id', clinic.id).order('last_name'),
        supabase.from('clinic_staff').select('*').eq('clinic_id', clinic.id),
      ]);
      setAppts((a ?? []) as Appointment[]);
      setPatients((p ?? []) as Patient[]);
      setStaffList((s ?? []) as StaffMember[]);
      setLoading(false);
    })();
  }, [clinic]);

  const filtered = useMemo(() => {
    const now = new Date();
    const startToday = new Date(now.setHours(0, 0, 0, 0));
    const endToday = addDays(startToday, 1);
    switch (filter) {
      case 'today':
        return appts.filter((a) => new Date(a.start_time) >= startToday && new Date(a.start_time) < endToday);
      case 'scheduled':
        return appts.filter((a) => a.status === 'scheduled');
      case 'completed':
        return appts.filter((a) => a.status === 'completed');
      case 'no_show':
        return appts.filter((a) => a.status === 'no_show');
      default:
        return appts;
    }
  }, [appts, filter]);

  async function updateStatus(id: string, status: AppointmentStatus) {
    setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) show('Could not update status', 'error');
    else show(`Marked as ${status.replace('_', '-')}`);
  }

  async function sendReminder(appt: Appointment) {
    setAppts((prev) => prev.map((a) => (a.id === appt.id ? { ...a, reminder_sent: true } : a)));
    const { error } = await supabase.from('appointments').update({ reminder_sent: true }).eq('id', appt.id);
    if (error) { show('Could not send reminder', 'error'); return; }
    setReminderAppt(appt);
    show('Reminder sent via SMS');
  }

  async function bookAppt(data: {
    patient_id: string;
    staff_id: string;
    start_time: string;
    type: AppointmentType;
    reason: string;
  }) {
    if (!clinic) return;
    const leadHours = (new Date(data.start_time).getTime() - Date.now()) / 3_600_000;
    const risk = computeRisk({ leadHours, hasHistory: appts.some((a) => a.patient_id === data.patient_id && a.status === 'completed') });
    const { data: row, error } = await supabase
      .from('appointments')
      .insert({ ...data, clinic_id: clinic.id, no_show_risk: risk })
      .select('*, patient:patients(*), staff:clinic_staff(*)')
      .single();
    if (error) { show('Could not book appointment', 'error'); return; }
    setAppts((prev) => [...prev, row as Appointment].sort((a, b) => +new Date(a.start_time) - +new Date(b.start_time)));
    setShowBook(false);
    show('Appointment booked');
  }

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Spinner className="h-7 w-7 text-brand-500" /></div>;
  }

  const todayAppts = appts.filter((a) => {
    const d = new Date(a.start_time);
    const now = new Date();
    return d.toDateString() === new Date().toDateString() && a.status === 'scheduled';
  });
  const avgRisk = todayAppts.length ? todayAppts.reduce((s, a) => s + a.no_show_risk, 0) / todayAppts.length : 0;
  const pendingReminders = todayAppts.filter((a) => !a.reminder_sent).length;

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'completed', label: 'Completed' },
    { key: 'no_show', label: 'No-shows' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<CalendarClock className="h-5 w-5" />} label="Today" value={todayAppts.length} color="bg-brand-50 text-brand-600" />
        <StatCard icon={<Bell className="h-5 w-5" />} label="Reminders pending" value={pendingReminders} color="bg-amber-50 text-amber-600" />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Avg no-show risk" value={`${Math.round(avgRisk * 100)}%`} color="bg-blue-50 text-blue-600" />
        <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="High risk" value={todayAppts.filter((a) => a.no_show_risk >= 0.5).length} color="bg-red-50 text-red-600" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-white border border-ink-100 p-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                filter === f.key ? 'bg-brand-600 text-white' : 'text-ink-500 hover:bg-ink-100',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowBook(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> Book appointment
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={<CalendarClock className="h-7 w-7" />} title="No appointments" description="Book a new appointment to fill the schedule." />
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((a) => (
            <div key={a.id} className="card p-4 group">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-center shrink-0 w-16">
                    <div className="text-sm font-bold text-ink-800">{formatTime(a.start_time)}</div>
                    <div className="text-[10px] text-ink-400">{formatDate(a.start_time, { day: 'numeric', month: 'short' })}</div>
                  </div>
                  <div className={cn('h-10 w-px', riskLevel(a.no_show_risk).bar)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-ink-800">
                        {a.patient?.first_name} {a.patient?.last_name}
                      </span>
                      <StatusBadge status={a.status} />
                      {a.status === 'scheduled' && <RiskBadge risk={a.no_show_risk} />}
                    </div>
                    <div className="text-xs text-ink-500 mt-0.5">{a.reason}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-ink-400">
                      <TypeChip type={a.type} />
                      <span>· {a.staff?.full_name}</span>
                      {a.reminder_sent && <span className="text-brand-600">· Reminder sent</span>}
                    </div>
                  </div>
                </div>

                {a.status === 'scheduled' && (
                  <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    {!a.reminder_sent && (
                      <button onClick={() => sendReminder(a)} className="btn-ghost text-xs" title="Send SMS reminder">
                        <Bell className="h-3.5 w-3.5" /> Remind
                      </button>
                    )}
                    <button onClick={() => updateStatus(a.id, 'completed')} className="btn-ghost text-xs text-brand-600" title="Mark completed">
                      <Check className="h-3.5 w-3.5" /> Complete
                    </button>
                    <button onClick={() => updateStatus(a.id, 'no_show')} className="btn-ghost text-xs text-red-600" title="Mark no-show">
                      <X className="h-3.5 w-3.5" /> No-show
                    </button>
                    {a.type === 'video' && (
                      <button onClick={() => updateStatus(a.id, 'completed')} className="btn-secondary text-xs">
                        <Video className="h-3.5 w-3.5" /> Join
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showBook && (
        <BookModal
          patients={patients}
          staffList={staffList}
          defaultStaff={staff?.id}
          onClose={() => setShowBook(false)}
          onBook={bookAppt}
        />
      )}

      {reminderAppt && <ReminderSentModal appt={reminderAppt} onClose={() => setReminderAppt(null)} />}
    </div>
  );
}

function computeRisk({ leadHours, hasHistory }: { leadHours: number; hasHistory: boolean }): number {
  let r = 0.25;
  if (leadHours < 24) r += 0.15;
  else if (leadHours > 168) r += 0.2;
  if (!hasHistory) r += 0.2;
  r += Math.random() * 0.15;
  return Math.min(0.9, Math.max(0.05, r));
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', color)}>{icon}</div>
      <div>
        <div className="text-xl font-bold text-ink-800">{value}</div>
        <div className="text-xs text-ink-400">{label}</div>
      </div>
    </div>
  );
}

function TypeChip({ type }: { type: string }) {
  const map = {
    video: { icon: Video, label: 'Video' },
    phone: { icon: Phone, label: 'Phone' },
    in_person: { icon: MapPin, label: 'In person' },
  };
  const m = map[type as keyof typeof map] ?? map.in_person;
  return <span className="inline-flex items-center gap-1"><m.icon className="h-3 w-3" />{m.label}</span>;
}

function BookModal({
  patients,
  staffList,
  defaultStaff,
  onClose,
  onBook,
}: {
  patients: Patient[];
  staffList: StaffMember[];
  defaultStaff?: string;
  onClose: () => void;
  onBook: (d: { patient_id: string; staff_id: string; start_time: string; type: AppointmentType; reason: string }) => void;
}) {
  const [patientId, setPatientId] = useState('');
  const [staffId, setStaffId] = useState(defaultStaff ?? staffList[0]?.id ?? '');
  const [date, setDate] = useState(toYMD(addDays(new Date(), 1)));
  const [time, setTime] = useState('09:30');
  const [type, setType] = useState<AppointmentType>('in_person');
  const [reason, setReason] = useState('');

  function submit() {
    const start_time = new Date(`${date}T${time}`).toISOString();
    onBook({ patient_id: patientId, staff_id: staffId, start_time, type, reason });
  }

  return (
    <Modal open onClose={onClose} title="Book appointment" size="lg">
      <div className="space-y-4">
        <div>
          <label className="label">Patient</label>
          <select className="input" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
            <option value="">Select patient…</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Clinician</label>
          <select className="input" value={staffId} onChange={(e) => setStaffId(e.target.value)}>
            {staffList.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={date} min={toYMD(new Date())} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Time</label>
            <input type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Consultation type</label>
          <div className="grid grid-cols-3 gap-2">
            {(['in_person', 'video', 'phone'] as AppointmentType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium capitalize transition-all',
                  type === t ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-500 hover:border-ink-300',
                )}
              >
                {t === 'in_person' && <MapPin className="h-4 w-4" />}
                {t === 'video' && <Video className="h-4 w-4" />}
                {t === 'phone' && <Phone className="h-4 w-4" />}
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Reason for visit</label>
          <input className="input" placeholder="e.g. Asthma review" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submit} disabled={!patientId} className="btn-primary">Book appointment</button>
        </div>
      </div>
    </Modal>
  );
}

function ReminderSentModal({ appt, onClose }: { appt: Appointment; onClose: () => void }) {
  return (
    <Modal open onClose={onClose} title="Reminder sent" size="sm">
      <div className="flex flex-col items-center text-center py-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-ink-800">SMS reminder sent</h3>
        <p className="mt-1.5 text-sm text-ink-500">
          A reminder has been sent to {appt.patient?.first_name} {appt.patient?.last_name} for their appointment on {formatDate(appt.start_time)} at {formatTime(appt.start_time)}.
        </p>
        <div className="mt-4 w-full rounded-xl bg-ink-50 p-3 text-left text-xs text-ink-500">
          <div className="font-medium text-ink-700 mb-1">Twilio SMS preview</div>
          Thames Medical Centre: Reminder — you have an appointment on {formatDate(appt.start_time)} at {formatTime(appt.start_time)}. Reply C to confirm or R to reschedule.
        </div>
        <button onClick={onClose} className="btn-primary mt-5 w-full">Done</button>
      </div>
    </Modal>
  );
}
