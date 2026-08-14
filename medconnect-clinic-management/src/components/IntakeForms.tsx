import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import type { IntakeForm, Patient, IntakeStatus } from '@/lib/types';
import { Spinner, EmptyState, StatusBadge, Modal, Avatar } from '@/components/ui';
import { cn, formatDate } from '@/lib/utils';
import { ClipboardList, FileText, ShieldCheck, Lock, Eye, CheckCircle2 } from 'lucide-react';

export function IntakeForms() {
  const { clinic } = useAuth();
  const { show } = useToast();
  const [forms, setForms] = useState<IntakeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | IntakeStatus>('all');
  const [viewForm, setViewForm] = useState<IntakeForm | null>(null);

  useEffect(() => {
    if (!clinic) return;
    (async () => {
      const { data } = await supabase
        .from('intake_forms')
        .select('*, patient:patients(*)')
        .eq('clinic_id', clinic.id)
        .order('created_at', { ascending: false });
      setForms((data ?? []) as IntakeForm[]);
      setLoading(false);
    })();
  }, [clinic]);

  const filtered = filter === 'all' ? forms : forms.filter((f) => f.status === filter);

  async function markReviewed(form: IntakeForm) {
    const { error } = await supabase
      .from('intake_forms')
      .update({ status: 'reviewed' })
      .eq('id', form.id);
    if (error) { show('Could not update form', 'error'); return; }
    setForms((prev) => prev.map((f) => (f.id === form.id ? { ...f, status: 'reviewed' } : f)));
    setViewForm(null);
    show('Form marked as reviewed');
  }

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Spinner className="h-7 w-7 text-brand-500" /></div>;
  }

  const pending = forms.filter((f) => f.status === 'submitted').length;

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Encryption banner */}
      <div className="rounded-2xl bg-gradient-to-r from-ink-800 to-ink-900 p-5 text-white flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
          <ShieldCheck className="h-6 w-6 text-brand-300" />
        </div>
        <div className="flex-1">
          <div className="font-semibold">AES-256 encrypted at rest</div>
          <div className="text-sm text-ink-300">All intake form data is encrypted before storage and protected by Supabase Row Level Security.</div>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm">
          <Lock className="h-4 w-4 text-brand-300" />
          GDPR compliant
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-white border border-ink-100 p-1">
          {[
            { key: 'all' as const, label: 'All' },
            { key: 'submitted' as const, label: `Awaiting review (${pending})` },
            { key: 'reviewed' as const, label: 'Reviewed' },
            { key: 'pending' as const, label: 'Pending' },
          ].map((f) => (
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
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={<ClipboardList className="h-7 w-7" />} title="No intake forms" description="Submitted digital intake forms will appear here for review." />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((f) => {
            const p = f.patient as Patient | undefined;
            return (
              <button
                key={f.id}
                onClick={() => setViewForm(f)}
                className="card-hover p-5 text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <Avatar name={`${p?.first_name} ${p?.last_name}`} size="md" />
                  <StatusBadge status={f.status} />
                </div>
                <div className="text-base font-semibold text-ink-800">{p?.first_name} {p?.last_name}</div>
                <div className="text-xs text-ink-400 mb-3">
                  {f.submitted_at ? `Submitted ${formatDate(f.submitted_at)}` : 'Not yet submitted'}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink-500">
                  <FileText className="h-3.5 w-3.5" />
                  {Object.keys(f.data).length} fields
                </div>
              </button>
            );
          })}
        </div>
      )}

      {viewForm && <FormDetailModal form={viewForm} onClose={() => setViewForm(null)} onReview={markReviewed} />}
    </div>
  );
}

function FormDetailModal({ form, onClose, onReview }: { form: IntakeForm; onClose: () => void; onReview: (f: IntakeForm) => void }) {
  const p = form.patient as Patient | undefined;
  const entries = Object.entries(form.data);

  return (
    <Modal open onClose={onClose} title="Intake form detail" size="lg">
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-4">
          <Avatar name={`${p?.first_name} ${p?.last_name}`} size="md" />
          <div className="flex-1">
            <div className="font-semibold text-ink-800">{p?.first_name} {p?.last_name}</div>
            <div className="text-xs text-ink-400">NHS {p?.nhs_number ?? '—'}</div>
          </div>
          <StatusBadge status={form.status} />
        </div>

        <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-3 flex items-center gap-2 text-xs text-brand-700">
          <Lock className="h-3.5 w-3.5" />
          Decrypted for review — data is stored encrypted (AES-256)
        </div>

        <div className="space-y-3">
          {entries.map(([key, value]) => (
            <div key={key} className="border-b border-ink-100 pb-3 last:border-0">
              <div className="text-xs font-medium uppercase tracking-wide text-ink-400 mb-1">
                {key.replace(/_/g, ' ')}
              </div>
              {Array.isArray(value) ? (
                <div className="flex flex-wrap gap-1.5">
                  {value.map((v, i) => <span key={i} className="badge bg-ink-100 text-ink-700">{String(v)}</span>)}
                </div>
              ) : typeof value === 'boolean' ? (
                <span className={cn('badge', value ? 'bg-brand-50 text-brand-700' : 'bg-ink-100 text-ink-500')}>
                  {value ? 'Yes' : 'No'}
                </span>
              ) : (
                <div className="text-sm text-ink-800">{String(value)}</div>
              )}
            </div>
          ))}
        </div>

        {form.status === 'submitted' && (
          <button onClick={() => onReview(form)} className="btn-primary w-full">
            <CheckCircle2 className="h-4 w-4" /> Mark as reviewed
          </button>
        )}
      </div>
    </Modal>
  );
}
