import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import type { Prescription, Patient, StaffMember, PrescriptionStatus } from '@/lib/types';
import { Spinner, EmptyState, StatusBadge, Modal, Avatar } from '@/components/ui';
import { cn, formatDate, relativeTime } from '@/lib/utils';
import { Pill, Plus, Check, X, Search, CheckCircle2 } from 'lucide-react';

type FilterKey = 'all' | 'refill_requested' | 'active' | 'completed' | 'denied';

export function Prescriptions() {
  const { clinic, staff } = useAuth();
  const { show } = useToast();
  const [rx, setRx] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('refill_requested');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [confirmAppt, setConfirmAppt] = useState<{ rx: Prescription; action: 'approve' | 'deny' } | null>(null);

  useEffect(() => {
    if (!clinic) return;
    (async () => {
      const [{ data: r }, { data: p }] = await Promise.all([
        supabase
          .from('prescriptions')
          .select('*, patient:patients(*), staff:clinic_staff(*)')
          .eq('clinic_id', clinic.id)
          .order('created_at', { ascending: false }),
        supabase.from('patients').select('*').eq('clinic_id', clinic.id).order('last_name'),
      ]);
      setRx((r ?? []) as Prescription[]);
      setPatients((p ?? []) as Patient[]);
      setLoading(false);
    })();
  }, [clinic]);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? rx : rx.filter((r) => r.status === (filter === 'denied' ? 'refill_denied' : filter));
    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter((r) =>
        `${r.medication} ${r.patient?.first_name} ${r.patient?.last_name}`.toLowerCase().includes(q),
      );
    }
    return list;
  }, [rx, filter, search]);

  const refillCount = rx.filter((r) => r.status === 'refill_requested').length;

  async function doAction(action: 'approve' | 'deny') {
    if (!confirmAppt) return;
    const status: PrescriptionStatus = action === 'approve' ? 'refill_approved' : 'refill_denied';
    const { error } = await supabase
      .from('prescriptions')
      .update({ status })
      .eq('id', confirmAppt.rx.id);
    if (error) { show('Could not update prescription', 'error'); return; }
    setRx((prev) => prev.map((r) => (r.id === confirmAppt.rx.id ? { ...r, status } : r)));
    setConfirmAppt(null);
    show(action === 'approve' ? 'Refill approved' : 'Refill denied');
  }

  async function addPrescription(data: {
    patient_id: string;
    medication: string;
    dosage: string;
    frequency: string;
    quantity: string;
    notes: string;
  }) {
    if (!clinic || !staff) return;
    const { data: row, error } = await supabase
      .from('prescriptions')
      .insert({ ...data, clinic_id: clinic.id, staff_id: staff.id, status: 'active' })
      .select('*, patient:patients(*), staff:clinic_staff(*)')
      .single();
    if (error) { show('Could not add prescription', 'error'); return; }
    setRx((prev) => [row as Prescription, ...prev]);
    setShowAdd(false);
    show('Prescription added');
  }

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Spinner className="h-7 w-7 text-brand-500" /></div>;
  }

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'refill_requested', label: `Refill requests (${refillCount})` },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'denied', label: 'Denied' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
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
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input className="input pl-10" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" /> Prescribe
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={<Pill className="h-7 w-7" />} title="No prescriptions" description="Prescribe medication or approve refill requests here." />
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((r) => {
            const p = r.patient as Patient | undefined;
            return (
              <div key={r.id} className="card p-4 group">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shrink-0">
                      <Pill className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-ink-800">{r.medication}</span>
                        <StatusBadge status={r.status} />
                      </div>
                      <div className="text-xs text-ink-500 mt-0.5">
                        {r.dosage} · {r.frequency} · {r.quantity}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-ink-400">
                        <Avatar name={`${p?.first_name} ${p?.last_name}`} size="sm" />
                        <span>{p?.first_name} {p?.last_name}</span>
                        {r.refill_requested_at && <span>· Requested {relativeTime(r.refill_requested_at)}</span>}
                      </div>
                    </div>
                  </div>

                  {r.status === 'refill_requested' && (
                    <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setConfirmAppt({ rx: r, action: 'approve' })}
                        className="btn-primary text-xs"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve refill
                      </button>
                      <button
                        onClick={() => setConfirmAppt({ rx: r, action: 'deny' })}
                        className="btn-danger text-xs"
                      >
                        <X className="h-3.5 w-3.5" /> Deny
                      </button>
                    </div>
                  )}
                  {r.status === 'refill_approved' && (
                    <div className="flex items-center gap-1.5 text-xs text-brand-600">
                      <CheckCircle2 className="h-4 w-4" /> Approved
                    </div>
                  )}
                </div>
                {r.notes && <div className="mt-2 text-xs text-ink-400 border-t border-ink-100 pt-2">{r.notes}</div>}
              </div>
            );
          })}
        </div>
      )}

      {confirmAppt && (
        <Modal open onClose={() => setConfirmAppt(null)} title={confirmAppt.action === 'approve' ? 'Approve refill' : 'Deny refill'} size="sm">
          <div className="space-y-4">
            <p className="text-sm text-ink-600">
              {confirmAppt.action === 'approve'
                ? 'Approve this repeat prescription refill? The patient will be notified to collect it.'
                : 'Deny this refill request? The patient will be asked to book a review appointment.'}
            </p>
            <div className="rounded-xl bg-ink-50 p-4">
              <div className="font-semibold text-ink-800">{confirmAppt.rx.medication}</div>
              <div className="text-xs text-ink-500">{confirmAppt.rx.dosage} · {confirmAppt.rx.frequency} · {confirmAppt.rx.quantity}</div>
              <div className="text-xs text-ink-400 mt-1">
                {confirmAppt.rx.patient?.first_name} {confirmAppt.rx.patient?.last_name}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmAppt(null)} className="btn-secondary">Cancel</button>
              <button
                onClick={() => doAction(confirmAppt.action)}
                className={confirmAppt.action === 'approve' ? 'btn-primary' : 'btn-danger'}
              >
                {confirmAppt.action === 'approve' ? 'Approve' : 'Deny'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showAdd && <AddPrescriptionModal patients={patients} onClose={() => setShowAdd(false)} onSave={addPrescription} />}
    </div>
  );
}

function AddPrescriptionModal({
  patients,
  onClose,
  onSave,
}: {
  patients: Patient[];
  onClose: () => void;
  onSave: (d: { patient_id: string; medication: string; dosage: string; frequency: string; quantity: string; notes: string }) => void;
}) {
  const [form, setForm] = useState({ patient_id: '', medication: '', dosage: '', frequency: '', quantity: '', notes: '' });
  return (
    <Modal open onClose={onClose} title="New prescription" size="lg">
      <div className="space-y-4">
        <div>
          <label className="label">Patient</label>
          <select className="input" value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })}>
            <option value="">Select patient…</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Medication</label>
          <input className="input" placeholder="e.g. Amoxicillin" value={form.medication} onChange={(e) => setForm({ ...form, medication: e.target.value })} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Dosage</label>
            <input className="input" placeholder="250mg" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
          </div>
          <div>
            <label className="label">Frequency</label>
            <input className="input" placeholder="3x daily" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} />
          </div>
          <div>
            <label className="label">Quantity</label>
            <input className="input" placeholder="21 capsules" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label">Notes</label>
          <textarea className="input min-h-[80px]" placeholder="Instructions or warnings…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.patient_id || !form.medication} className="btn-primary">Prescribe</button>
        </div>
      </div>
    </Modal>
  );
}
