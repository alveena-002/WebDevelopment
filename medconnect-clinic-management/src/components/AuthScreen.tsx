import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Spinner } from '@/components/ui';
import {
  Stethoscope, ShieldCheck, Calendar, Video, Pill, ClipboardList,
  HeartPulse, Activity, Star,
} from 'lucide-react';

const HERO_IMG = 'https://images.pexels.com/photos/6129104/pexels-photo-6129104.jpeg?auto=compress&cs=tinysrgb&w=1600&h=2000&fit=crop';
const FLOAT_IMG_1 = 'https://images.pexels.com/photos/4225925/pexels-photo-4225925.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
const FLOAT_IMG_2 = 'https://images.pexels.com/photos/5452224/pexels-photo-5452224.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop';
const FLOAT_IMG_3 = 'https://images.pexels.com/photos/20860586/pexels-photo-20860586.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
const MOBILE_BANNER = 'https://images.pexels.com/photos/4173244/pexels-photo-4173244.jpeg?auto=compress&cs=tinysrgb&w=940&h=500&fit=crop';

const FEATURES = [
  { icon: Calendar, title: 'Smart Scheduling', desc: 'AI no-show prediction & auto-reminders' },
  { icon: Video, title: 'Video Consultations', desc: 'Built-in WebRTC, no extra software' },
  { icon: ClipboardList, title: 'Digital Intake Forms', desc: 'Encrypted, paperless, auto-attached' },
  { icon: Pill, title: 'Prescription Management', desc: 'One-click refill approvals & tracking' },
];

const STATS = [
  { value: '12k+', label: 'Patients managed' },
  { value: '98%', label: 'Appointment accuracy' },
  { value: '4.9', label: 'Clinic rating' },
];

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password, fullName || 'Clinic Admin');
    if (error) setError(error);
    setBusy(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* ─── LEFT: Visual showcase ─── */}
      <div className="relative hidden lg:flex w-[55%] flex-col overflow-hidden">
        {/* Background */}
        <img
          src={HERO_IMG}
          alt="Doctor reviewing medical charts in hospital corridor"
          className="absolute inset-0 h-full w-full object-cover scale-105"
        />
        {/* Multi-layer gradient for depth & readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/95 via-brand-900/88 to-brand-800/82" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-brand-900/30" />
        {/* Decorative glow blobs */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-brand-300/10 blur-3xl" />
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/20">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white">MedConnect</div>
              <div className="text-xs text-brand-200">Clinic & Patient Management</div>
            </div>
          </div>

          {/* Hero copy + features */}
          <div className="max-w-lg animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-brand-100 backdrop-blur-md ring-1 ring-white/15">
              <HeartPulse className="h-3.5 w-3.5 text-brand-300" />
              Trusted by 200+ UK clinics
            </div>

            <h1 className="font-display text-4xl xl:text-5xl font-bold leading-[1.1] text-white">
              The complete platform for{' '}
              <span className="bg-gradient-to-r from-brand-300 to-brand-100 bg-clip-text text-transparent">
                modern clinics
              </span>
            </h1>
            <p className="mt-4 text-base text-brand-100/90 leading-relaxed">
              Intelligent scheduling, video consultations, digital intake forms, and prescription management — all HIPAA & GDPR compliant.
            </p>

            {/* Feature grid */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="group rounded-2xl bg-white/8 p-4 backdrop-blur-md ring-1 ring-white/10 transition-all duration-300 hover:bg-white/12 hover:ring-white/20 animate-fade-up"
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-400/20 text-brand-200 transition-transform duration-300 group-hover:scale-110">
                    <f.icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="mt-3 text-sm font-semibold text-white">{f.title}</div>
                  <div className="mt-0.5 text-xs text-brand-100/70">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats + compliance */}
          <div className="flex items-end justify-between animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-brand-200">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/8 px-3.5 py-2 text-xs text-brand-100 backdrop-blur-md ring-1 ring-white/10">
              <ShieldCheck className="h-4 w-4 text-brand-300" />
              HIPAA & GDPR · NHS-aligned
            </div>
          </div>
        </div>

        {/* Floating image cards — decorative */}
        <div className="absolute right-8 top-28 z-10 hidden xl:block animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="rotate-3 rounded-2xl bg-white/10 p-1.5 backdrop-blur-md ring-1 ring-white/20 shadow-float transition-transform duration-500 hover:rotate-0">
            <img src={FLOAT_IMG_1} alt="Doctor examining X-ray" className="h-28 w-40 rounded-xl object-cover" />
          </div>
        </div>
        <div className="absolute right-6 top-72 z-10 hidden xl:block animate-fade-up" style={{ animationDelay: '0.45s' }}>
          <div className="-rotate-6 rounded-2xl bg-white/10 p-1.5 backdrop-blur-md ring-1 ring-white/20 shadow-float transition-transform duration-500 hover:rotate-0">
            <img src={FLOAT_IMG_3} alt="Doctor with patient during consultation" className="h-24 w-24 rounded-xl object-cover" />
          </div>
        </div>
        <div className="absolute right-20 bottom-28 z-10 hidden xl:block animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <div className="rotate-2 rounded-2xl bg-white/10 p-1.5 backdrop-blur-md ring-1 ring-white/20 shadow-float transition-transform duration-500 hover:rotate-0">
            <img src={FLOAT_IMG_2} alt="Medical professionals collaborating" className="h-32 w-24 rounded-xl object-cover" />
          </div>
        </div>
      </div>

      {/* ─── RIGHT: Form panel ─── */}
      <div className="flex w-full lg:w-[45%] flex-col bg-gradient-to-b from-white to-ink-50">
        {/* Mobile banner */}
        <div className="relative h-52 lg:hidden overflow-hidden">
          <img
            src={MOBILE_BANNER}
            alt="Doctor in medical uniform with stethoscope"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-900/50 to-brand-800/30" />
          <div className="absolute bottom-5 left-6 flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/20">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold">MedConnect</div>
              <div className="text-[11px] text-brand-200">Clinic & Patient Management</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-[400px] animate-fade-up">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
              <Activity className="h-3.5 w-3.5" />
              {mode === 'signin' ? 'Secure sign-in' : 'Free demo — no card required'}
            </div>

            <h2 className="font-display text-[28px] font-bold leading-tight text-ink-800">
              {mode === 'signin' ? 'Welcome back' : 'Start your demo clinic'}
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              {mode === 'signin'
                ? 'Sign in to your clinic workspace.'
                : 'Get a fully seeded demo clinic with realistic patients, appointments & more — ready in seconds.'}
            </p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              {mode === 'signup' && (
                <div className="animate-fade-in">
                  <label className="label">Full name</label>
                  <input
                    className="input"
                    placeholder="Dr. Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div>
                <label className="label">Email address</label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@clinic.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100 animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="btn-primary w-full py-3.5 text-base shadow-float hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                {busy ? <Spinner className="h-5 w-5" /> : mode === 'signin' ? 'Sign in' : 'Create account & start demo'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-ink-200" />
              <span className="text-xs text-ink-400">or</span>
              <div className="h-px flex-1 bg-ink-200" />
            </div>

            <p className="text-center text-sm text-ink-500">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
                className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>

            {/* Trust row */}
            <div className="mt-8 flex items-center justify-center gap-5 text-xs text-ink-400">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-brand-500" /> HIPAA</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-brand-500" /> GDPR</span>
              <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-brand-500" /> 4.9/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
