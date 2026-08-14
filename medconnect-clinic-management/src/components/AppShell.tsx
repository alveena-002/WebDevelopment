import { type ReactNode, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Video,
  ClipboardList,
  Pill,
  CalendarRange,
  Stethoscope,
  LogOut,
  Building2,
  Search,
  Bell,
  ChevronDown,
} from 'lucide-react';

export type View =
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'video'
  | 'intake'
  | 'prescriptions'
  | 'rota';

const NAV: { id: View; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'appointments', label: 'Appointments', icon: CalendarClock },
  { id: 'video', label: 'Video Consultations', icon: Video },
  { id: 'intake', label: 'Intake Forms', icon: ClipboardList },
  { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  { id: 'rota', label: 'Staff Rota', icon: CalendarRange },
];

const VIEW_TITLES: Record<View, string> = {
  dashboard: 'Dashboard',
  patients: 'Patients',
  appointments: 'Appointments',
  video: 'Video Consultations',
  intake: 'Digital Intake Forms',
  prescriptions: 'Prescriptions',
  rota: 'Staff Rota & Performance',
};

const VIEW_SUBTITLES: Record<View, string> = {
  dashboard: 'Overview of your clinic activity',
  patients: 'Manage patient records and history',
  appointments: 'Schedule and track all appointments',
  video: 'Secure WebRTC video consultations',
  intake: 'Review encrypted digital intake forms',
  prescriptions: 'Manage prescriptions and refill requests',
  rota: 'Staff scheduling and performance metrics',
};

export function AppShell({
  view,
  setView,
  children,
}: {
  view: View;
  setView: (v: View) => void;
  children: ReactNode;
}) {
  const { staff, clinic, signOut } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-ink-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-ink-100 bg-white">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-ink-800">MedConnect</div>
            <div className="text-[11px] text-ink-400">Clinic Management</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          <div className="px-3 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-wider text-ink-300">Menu</div>
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn('nav-item w-full group', view === item.id && 'nav-item-active')}
            >
              {view === item.id && <span className="nav-indicator" />}
              <item.icon className={cn(
                'h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110',
                view === item.id ? 'text-brand-600' : 'text-ink-400 group-hover:text-ink-600',
              )} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Clinic card */}
        <div className="mx-3 mb-2 rounded-xl bg-gradient-to-br from-ink-50 to-ink-100/50 p-3 ring-1 ring-ink-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 shrink-0">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-ink-700">{clinic?.name ?? 'Clinic'}</div>
              <div className="text-[10px] text-ink-400">Active workspace</div>
            </div>
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse shrink-0" />
          </div>
        </div>

        {/* Profile + sign out */}
        <div className="border-t border-ink-100 p-3">
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-ink-50"
            >
              <Avatar name={staff?.full_name ?? 'Staff'} size="sm" />
              <div className="min-w-0 flex-1 text-left">
                <div className="truncate text-sm font-semibold text-ink-800">{staff?.full_name}</div>
                <div className="text-[11px] capitalize text-ink-400">{staff?.role}</div>
              </div>
              <ChevronDown className={cn('h-4 w-4 text-ink-400 transition-transform', showProfile && 'rotate-180')} />
            </button>
            {showProfile && (
              <button
                onClick={signOut}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 animate-fade-in"
              >
                <LogOut className="h-[18px] w-[18px]" />
                <span>Sign out</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-ink-100 bg-white/80 backdrop-blur-md px-4 py-3.5 md:px-8 sticky top-0 z-30">
          <div>
            <h1 className="font-display text-lg font-bold text-ink-800">{VIEW_TITLES[view]}</h1>
            <p className="text-xs text-ink-400 mt-0.5">{VIEW_SUBTITLES[view]}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                className="w-48 rounded-xl border border-ink-200 bg-ink-50/50 py-2 pl-9 pr-3 text-sm text-ink-800 placeholder:text-ink-400 transition-all duration-200 focus:w-60 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:outline-none"
                placeholder="Search…"
              />
            </div>
            {/* Notifications */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-700">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            {/* Live status */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
              Live
            </div>
            {/* Avatar */}
            <Avatar name={staff?.full_name ?? 'Staff'} size="sm" />
          </div>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 overflow-x-auto border-b border-ink-100 bg-white px-2 py-2 scrollbar-thin">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
                view === item.id ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-ink-100',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
