import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { RotaEntry, PerformanceLog, StaffMember } from '@/lib/types';
import { Spinner, EmptyState, Avatar } from '@/components/ui';
import { cn, formatDate, addDays, startOfWeek, toYMD } from '@/lib/utils';
import { CalendarRange, TrendingUp, Users, Star, Award, Clock } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function StaffRota() {
  const { clinic } = useAuth();
  const [rota, setRota] = useState<RotaEntry[]>([]);
  const [perf, setPerf] = useState<PerformanceLog[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState(startOfWeek());

  useEffect(() => {
    if (!clinic) return;
    (async () => {
      const [r, p, s] = await Promise.all([
        supabase.from('staff_rota').select('*, staff:clinic_staff(*)').eq('clinic_id', clinic.id),
        supabase.from('performance_logs').select('*, staff:clinic_staff(*)').eq('clinic_id', clinic.id).order('log_date', { ascending: false }),
        supabase.from('clinic_staff').select('*').eq('clinic_id', clinic.id),
      ]);
      setRota((r.data ?? []) as RotaEntry[]);
      setPerf((p.data ?? []) as PerformanceLog[]);
      setStaffList((s.data ?? []) as StaffMember[]);
      setLoading(false);
    })();
  }, [clinic]);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const rotaByStaffDay = useMemo(() => {
    const map = new Map<string, RotaEntry>();
    rota.forEach((r) => {
      const key = `${r.staff_id}-${toYMD(new Date(r.rota_date))}`;
      map.set(key, r);
    });
    return map;
  }, [rota]);

  // Aggregate performance per staff
  const perfByStaff = useMemo(() => {
    const map = new Map<string, { total: number; avgSat: number; days: number }>();
    perf.forEach((p) => {
      const cur = map.get(p.staff_id) ?? { total: 0, avgSat: 0, days: 0 };
      cur.total += p.patients_seen;
      cur.avgSat = (cur.avgSat * cur.days + p.satisfaction_avg) / (cur.days + 1);
      cur.days += 1;
      map.set(p.staff_id, cur);
    });
    return map;
  }, [perf]);

  // Recent performance (last 5 entries for chart)
  const recentPerf = useMemo(() => {
    return perf.slice(0, 10).reverse();
  }, [perf]);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Spinner className="h-7 w-7 text-brand-500" /></div>;
  }

  const totalPatients = Array.from(perfByStaff.values()).reduce((s, v) => s + v.total, 0);
  const clinicAvgSat = Array.from(perfByStaff.values()).reduce((s, v) => s + v.avgSat, 0) / (perfByStaff.size || 1);

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="h-5 w-5" />} label="Clinicians" value={staffList.length} color="bg-blue-50 text-blue-600" />
        <StatCard icon={<CalendarRange className="h-5 w-5" />} label="Patients seen (7d)" value={totalPatients} color="bg-brand-50 text-brand-600" />
        <StatCard icon={<Star className="h-5 w-5" />} label="Avg satisfaction" value={`${clinicAvgSat.toFixed(1)}/5`} color="bg-amber-50 text-amber-600" />
        <StatCard icon={<Award className="h-5 w-5" />} label="Top performer" value={getTopPerformer(perfByStaff, staffList)} color="bg-violet-50 text-violet-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Rota */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink-800">Weekly rota</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="btn-ghost px-2 py-1 text-sm">‹</button>
              <span className="text-sm font-medium text-ink-600">
                {formatDate(weekStart, { day: 'numeric', month: 'short' })} — {formatDate(addDays(weekStart, 6), { day: 'numeric', month: 'short' })}
              </span>
              <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="btn-ghost px-2 py-1 text-sm">›</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100">
                  <th className="text-left py-2 pr-3 font-medium text-ink-400 text-xs uppercase tracking-wide">Clinician</th>
                  {weekDays.map((d, i) => (
                    <th key={i} className="py-2 px-1 text-center font-medium text-ink-400 text-xs">
                      <div>{DAYS[i]}</div>
                      <div className="text-ink-600 text-sm font-semibold">{d.getDate()}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staffList.map((s) => (
                  <tr key={s.id} className="border-b border-ink-50 last:border-0">
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={s.full_name} size="sm" />
                        <div className="min-w-0">
                          <div className="truncate text-xs font-medium text-ink-800">{s.full_name}</div>
                          <div className="text-[10px] capitalize text-ink-400">{s.role}</div>
                        </div>
                      </div>
                    </td>
                    {weekDays.map((d, i) => {
                      const entry = rotaByStaffDay.get(`${s.id}-${toYMD(d)}`);
                      return (
                        <td key={i} className="px-1 py-2.5 text-center">
                          {entry ? (
                            <div className={cn(
                              'rounded-lg py-1.5 text-[10px] font-medium',
                              entry.working ? 'bg-brand-50 text-brand-700' : 'bg-ink-100 text-ink-400',
                            )}>
                              {entry.working ? `${entry.shift_start.slice(0, 5)}` : 'Off'}
                            </div>
                          ) : (
                            <div className="rounded-lg py-1.5 text-[10px] text-ink-300">—</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance leaderboard */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-brand-600" />
            <h3 className="font-semibold text-ink-800">Performance</h3>
          </div>
          <div className="space-y-3">
            {staffList.map((s) => {
              const p = perfByStaff.get(s.id);
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <Avatar name={s.full_name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink-800">{s.full_name}</div>
                    <div className="flex items-center gap-1 text-xs text-ink-400">
                      <Users className="h-3 w-3" /> {p?.total ?? 0} patients
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-semibold text-ink-800">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      {p?.avgSat.toFixed(1) ?? '—'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance chart */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-brand-600" />
          <h3 className="font-semibold text-ink-800">Recent activity</h3>
        </div>
        {recentPerf.length === 0 ? (
          <EmptyState title="No performance data yet" />
        ) : (
          <div className="space-y-2.5">
            {recentPerf.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <Avatar name={p.staff?.full_name ?? 'Staff'} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium text-ink-800">{p.staff?.full_name}</div>
                  <div className="text-xs text-ink-400">{formatDate(p.log_date)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-ink-800">{p.patients_seen}</div>
                    <div className="text-[10px] text-ink-400">patients</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-semibold text-ink-800">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      {p.satisfaction_avg.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-ink-400">satisfaction</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getTopPerformer(
  map: Map<string, { total: number; avgSat: number; days: number }>,
  staff: StaffMember[],
): string {
  let best = '';
  let bestScore = -1;
  map.forEach((v, k) => {
    const s = v.avgSat;
    if (s > bestScore) {
      bestScore = s;
      best = staff.find((st) => st.id === k)?.full_name.split(' ')[0] ?? '';
    }
  });
  return best || '—';
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', color)}>{icon}</div>
      <div className="min-w-0">
        <div className="text-lg font-bold text-ink-800 truncate">{value}</div>
        <div className="text-xs text-ink-400">{label}</div>
      </div>
    </div>
  );
}
