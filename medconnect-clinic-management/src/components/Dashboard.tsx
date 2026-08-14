import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { Appointment, Patient, Prescription, StaffMember } from '@/lib/types';
import { Avatar, RiskBadge, StatusBadge, Spinner } from '@/components/ui';
import { formatTime, formatDate, riskLevel, cn } from '@/lib/utils';
import {
  Users, CalendarClock, Pill, ClipboardList, TrendingUp, Video, Phone, MapPin,
  Clock, AlertTriangle, ArrowRight, Stethoscope, Activity,
} from 'lucide-react';
import type { View } from '@/components/AppShell';

export function Dashboard({ setView }: { setView: (v: View) => void }) {
  const { staff, clinic } = useAuth();
  const [loading, setLoading] = useState(true);
  const [todayAppts, setTodayAppts] = useState<Appointment[]>([]);
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [patientCount, setPatientCount] = useState(0);
  const [refillCount, setRefillCount] = useState(0);
  const [intakeCount, setIntakeCount] = useState(0);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  useEffect(() => {
    if (!clinic) return;
    (async () => {
      const today = new Date();
      const startToday = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endToday = new Date(today.getTime() + 86_400_000).toISOString();

      const [apptsToday, apptsUpcoming, patients, refills, intakes, staffRes] = await Promise.all([
        supabase
          .from('appointments')
          .select('*, patient:patients(*), staff:clinic_staff(*)')
          .eq('clinic_id', clinic.id)
          .gte('start_time', startToday)
          .lt('start_time', endToday)
          .order('start_time'),
        supabase
          .from('appointments')
          .select('*, patient:patients(*), staff:clinic_staff(*)')
          .eq('clinic_id', clinic.id)
          .gte('start_time', endToday)
          .order('start_time')
          .limit(5),
        supabase.from('patients').select('id', { count: 'exact', head: true }).eq('clinic_id', clinic.id),
        supabase
          .from('prescriptions')
          .select('id', { count: 'exact', head: true })
          .eq('clinic_id', clinic.id)
          .eq('status', 'refill_requested'),
        supabase
          .from('intake_forms')
          .select('id', { count: 'exact', head: true })
          .eq('clinic_id', clinic.id)
          .eq('status', 'submitted'),
        supabase.from('clinic_staff').select('*').eq('clinic_id', clinic.id),
      ]);

      setTodayAppts((apptsToday.data ?? []) as Appointment[]);
      setUpcoming((apptsUpcoming.data ?? []) as Appointment[]);
      setPatientCount(patients.count ?? 0);
      setRefillCount(refills.count ?? 0);
      setIntakeCount(intakes.count ?? 0);
      setStaffList((staffRes.data ?? []) as StaffMember[]);
      setLoading(false);
    })();
  }, [clinic]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-7 w-7 text-brand-500" />
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const completedCount = todayAppts.filter((a) => a.status === 'completed').length;
  const scheduledCount = todayAppts.filter((a) => a.status === 'scheduled').length;

  const kpis = [
    { label: 'Total Patients', value: patientCount, icon: Users, gradient: 'from-blue-500 to-blue-600', iconBg: 'bg-blue-500/10 text-blue-600', view: 'patients' as View, trend: '+12%' },
    { label: "Today's Appointments", value: todayAppts.length, icon: CalendarClock, gradient: 'from-brand-500 to-brand-600', iconBg: 'bg-brand-500/10 text-brand-600', view: 'appointments' as View, trend: `${scheduledCount} scheduled` },
    { label: 'Refill Requests', value: refillCount, icon: Pill, gradient: 'from-amber-500 to-orange-500', iconBg: 'bg-amber-500/10 text-amber-600', view: 'prescriptions' as View, trend: 'Pending' },
    { label: 'Intake Forms', value: intakeCount, icon: ClipboardList, gradient: 'from-violet-500 to-purple-500', iconBg: 'bg-violet-500/10 text-violet-600', view: 'intake' as View, trend: 'Awaiting review' },
  ];

  const highRisk = todayAppts.filter((a) => a.no_show_risk >= 0.5 && a.status === 'scheduled');

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Hero welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 p-6 md:p-8 text-white">
        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-brand-300/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md">
              <Activity className="h-3.5 w-3.5" />
              {clinic?.name}
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              {greeting}, {staff?.full_name.split(' ')[0]}.
            </h2>
            <p className="mt-1.5 text-sm text-brand-100">
              {todayAppts.length > 0
                ? `You have ${todayAppts.length} appointments today — ${completedCount} completed, ${scheduledCount} scheduled.`
                : 'No appointments scheduled for today.'}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3">
            <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-md text-center">
              <div className="font-display text-2xl font-bold">{completedCount}</div>
              <div className="text-[11px] text-brand-100">Completed</div>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-md text-center">
              <div className="font-display text-2xl font-bold">{scheduledCount}</div>
              <div className="text-[11px] text-brand-100">Scheduled</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <button
            key={k.label}
            onClick={() => setView(k.view)}
            className="stat-card group p-5 text-left animate-fade-up"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            {/* Gradient bar at top */}
            <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100', k.gradient)} />

            <div className="flex items-start justify-between">
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110', k.iconBg)}>
                <k.icon className="h-5 w-5" />
              </div>
              <span className="text-3xl font-bold text-ink-800">{k.value}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-medium text-ink-500">{k.label}</span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-ink-400 group-hover:text-brand-600 transition-colors">
                {k.trend}
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* High risk alert */}
      {highRisk.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/50 p-4 flex items-center gap-4 animate-fade-up">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-amber-800">
              {highRisk.length} appointment{highRisk.length > 1 ? 's' : ''} at high risk of no-show today
            </div>
            <div className="text-xs text-amber-700">Consider sending reminders to reduce no-shows.</div>
          </div>
          <button
            onClick={() => setView('appointments')}
            className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-700 shrink-0"
          >
            Review
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's schedule */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <CalendarClock className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-ink-800">Today's schedule</h3>
            </div>
            <button
              onClick={() => setView('appointments')}
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {todayAppts.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-100 text-ink-300 mb-3">
                <CalendarClock className="h-6 w-6" />
              </div>
              <div className="text-sm text-ink-400">No appointments today.</div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayAppts.map((a) => (
                <AppointmentRow key={a.id} appt={a} compact />
              ))}
            </div>
          )}
        </div>

        {/* Side column */}
        <div className="space-y-6">
          {/* Upcoming */}
          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-ink-800">Upcoming</h3>
            </div>
            {upcoming.length === 0 ? (
              <div className="py-6 text-center text-sm text-ink-400">Nothing upcoming.</div>
            ) : (
              <div className="space-y-3">
                {upcoming.slice(0, 4).map((a) => (
                  <div key={a.id} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-ink-50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-ink-800">
                        {a.patient?.first_name} {a.patient?.last_name}
                      </div>
                      <div className="text-xs text-ink-400">{formatDate(a.start_time)} · {formatTime(a.start_time)}</div>
                    </div>
                    <TypeIcon type={a.type} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* On duty */}
          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Stethoscope className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-ink-800">Clinicians</h3>
            </div>
            <div className="space-y-3">
              {staffList.map((s) => (
                <div key={s.id} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-ink-50">
                  <Avatar name={s.full_name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink-800">{s.full_name}</div>
                    <div className="text-xs capitalize text-ink-400">{s.role}</div>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-brand-600">
                    <span className="h-2 w-2 rounded-full bg-brand-500" />
                    On duty
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypeIcon({ type }: { type: string }) {
  const map = {
    video: { icon: Video, cls: 'text-violet-600 bg-violet-50' },
    phone: { icon: Phone, cls: 'text-blue-600 bg-blue-50' },
    in_person: { icon: MapPin, cls: 'text-brand-600 bg-brand-50' },
  };
  const m = map[type as keyof typeof map] ?? map.in_person;
  return (
    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', m.cls)}>
      <m.icon className="h-4 w-4" />
    </div>
  );
}

export function AppointmentRow({ appt, compact }: { appt: Appointment; compact?: boolean }) {
  const r = riskLevel(appt.no_show_risk);
  const p = appt.patient as Patient | undefined;
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border transition-all duration-200',
        appt.status === 'completed' ? 'border-ink-100 bg-ink-50/50' : 'border-ink-100 bg-white hover:border-ink-200 hover:shadow-soft',
        compact ? 'p-3' : 'p-4',
      )}
    >
      <div className="text-center shrink-0 w-14">
        <div className="text-sm font-bold text-ink-800">{formatTime(appt.start_time)}</div>
        <div className="text-[10px] text-ink-400">{appt.duration_minutes}min</div>
      </div>
      <div className={cn('h-10 w-px rounded-full', appt.status === 'completed' ? 'bg-ink-200' : r.bar)} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-ink-800">
            {p?.first_name} {p?.last_name}
          </span>
          <StatusBadge status={appt.status} />
        </div>
        <div className="truncate text-xs text-ink-500">{appt.reason}</div>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        {appt.status === 'scheduled' && <RiskBadge risk={appt.no_show_risk} />}
        <TypeIcon type={appt.type} />
      </div>
    </div>
  );
}
