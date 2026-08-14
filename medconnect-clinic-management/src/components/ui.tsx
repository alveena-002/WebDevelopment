import { cn, initials, avatarColor } from '@/lib/utils';

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold',
        sizes[size],
        avatarColor(name),
      )}
    >
      {initials(name)}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn('animate-spin', className)} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
    </svg>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-ink-800">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    scheduled: { label: 'Scheduled', cls: 'bg-blue-50 text-blue-600' },
    completed: { label: 'Completed', cls: 'bg-brand-50 text-brand-700' },
    cancelled: { label: 'Cancelled', cls: 'bg-ink-100 text-ink-500' },
    no_show: { label: 'No-show', cls: 'bg-red-50 text-red-600' },
    pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-600' },
    submitted: { label: 'Submitted', cls: 'bg-blue-50 text-blue-600' },
    reviewed: { label: 'Reviewed', cls: 'bg-brand-50 text-brand-700' },
    active: { label: 'Active', cls: 'bg-brand-50 text-brand-700' },
    refill_requested: { label: 'Refill requested', cls: 'bg-amber-50 text-amber-600' },
    refill_approved: { label: 'Refill approved', cls: 'bg-blue-50 text-blue-600' },
    refill_denied: { label: 'Refill denied', cls: 'bg-red-50 text-red-600' },
  };
  const s = map[status] ?? { label: status, cls: 'bg-ink-100 text-ink-600' };
  return <span className={cn('badge', s.cls)}>{s.label}</span>;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={cn('relative z-10 w-full rounded-2xl bg-white shadow-float animate-fade-up', sizes[size])}>
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-ink-800">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[60] animate-fade-up">
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl px-4 py-3 shadow-float',
          type === 'success' ? 'bg-brand-600 text-white' : 'bg-red-600 text-white',
        )}
      >
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="opacity-80 hover:opacity-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function RiskBadge({ risk }: { risk: number }) {
  const pct = Math.round(risk * 100);
  const level = risk >= 0.6 ? 'High' : risk >= 0.3 ? 'Medium' : 'Low';
  const color = risk >= 0.6 ? 'text-red-600 bg-red-50' : risk >= 0.3 ? 'text-amber-600 bg-amber-50' : 'text-brand-600 bg-brand-50';
  return (
    <span className={cn('badge', color)}>
      <span className="font-semibold">{pct}%</span>
      <span className="opacity-70">· {level} risk</span>
    </span>
  );
}
