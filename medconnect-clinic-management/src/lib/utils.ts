export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString('en-GB', opts ?? { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(date: string | Date): string {
  return `${formatDate(date)} · ${formatTime(date)}`;
}

export function relativeTime(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat('en-GB', { numeric: 'auto' });
  if (abs < 60_000) return rtf.format(-Math.round(diff / 1000), 'second');
  if (abs < 3_600_000) return rtf.format(-Math.round(diff / 60_000), 'minute');
  if (abs < 86_400_000) return rtf.format(-Math.round(diff / 3_600_000), 'hour');
  if (abs < 604_800_000) return rtf.format(-Math.round(diff / 86_400_000), 'day');
  return formatDate(date);
}

export function age(dob: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

export function riskLevel(risk: number): { label: string; color: string; bg: string; bar: string } {
  if (risk >= 0.6) return { label: 'High', color: 'text-red-600', bg: 'bg-red-50', bar: 'bg-red-500' };
  if (risk >= 0.3) return { label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500' };
  return { label: 'Low', color: 'text-brand-600', bg: 'bg-brand-50', bar: 'bg-brand-500' };
}

const avatarColors = [
  'bg-brand-100 text-brand-700',
  'bg-blue-100 text-blue-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-teal-100 text-teal-700',
  'bg-cyan-100 text-cyan-700',
  'bg-orange-100 text-orange-700',
];

export function avatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return avatarColors[h % avatarColors.length];
}

export function startOfWeek(d: Date = new Date()): Date {
  const date = new Date(d);
  const day = date.getDay() || 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day + 1);
  return date;
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function toYMD(d: Date): string {
  return d.toISOString().slice(0, 10);
}
