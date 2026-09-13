import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  ShieldCheck, 
  User, 
  Building2, 
  Lock, 
  Mail, 
  Phone, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Eye, 
  EyeOff, 
  Compass, 
  Hotel as HotelIcon,
  LogOut,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'guest',
  initialMode = 'login'
}) => {
  const { 
    currentUser, 
    users, 
    loginUser, 
    registerUser, 
    logoutUser, 
    showToast,
    hotels
  } = useApp();

  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [hotelName, setHotelName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (authMode === 'login') {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        return;
      }

      const res = loginUser(email.trim(), activeRole, adminPasscode.trim());
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.message || 'Invalid credentials.');
      }
    } else {
      // Registration
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        return;
      }

      if (activeRole === 'admin' && adminPasscode.trim() !== 'ADMIN2026') {
        setErrorMessage('Security clearance master code required for new Admin registration (Default: ADMIN2026).');
        return;
      }

      const res = registerUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: activeRole,
        adminPasscode: adminPasscode.trim(),
        hotelName: hotelName.trim()
      });

      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.message || 'Registration failed.');
      }
    }
  };

  // Quick 1-click login handler
  const handleQuickLogin = (userEmail: string, role: UserRole, defaultPasscode?: string) => {
    setErrorMessage(null);
    const res = loginUser(userEmail, role, defaultPasscode);
    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.message || 'Login failed.');
    }
  };

  const adminUsers = users.filter(u => u.role === 'admin');
  const ownerUsers = users.filter(u => u.role === 'owner');
  const guestUsers = users.filter(u => u.role === 'guest');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 transition-all">
        
        {/* Top Header Banner */}
        <div className="relative bg-slate-950 text-white p-6 pb-5 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80" 
              alt="Background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-900/70" />

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl border ${
                activeRole === 'admin' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' :
                activeRole === 'owner' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {activeRole === 'admin' && <ShieldCheck className="w-6 h-6" />}
                {activeRole === 'owner' && <Building2 className="w-6 h-6" />}
                {activeRole === 'guest' && <Compass className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">
                  {activeRole === 'admin' && 'Administrator & Operations Portal'}
                  {activeRole === 'owner' && 'Hotel Partner & Owner Portal'}
                  {activeRole === 'guest' && 'Guest & Traveler Portal'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {authMode === 'login' ? 'Sign in to access your verified dashboard' : 'Create a new verified portal account'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Role Switcher Tabs */}
          <div className="relative z-10 grid grid-cols-3 gap-1.5 mt-5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveRole('admin');
                setErrorMessage(null);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole('guest');
                setErrorMessage(null);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'guest'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Guest</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole('owner');
                setErrorMessage(null);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'owner'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Hotel Owner</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          
          {/* Login / Register Toggle */}
          <div className="flex items-center justify-center gap-2 border-b border-slate-100 pb-4">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                authMode === 'login'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sign In / Login
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage(null);
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                authMode === 'register'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Register New Account
            </button>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Registration specific fields */}
            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={activeRole === 'admin' ? 'e.g. Alveena Operations Admin' : 'e.g. Sarah Khan'}
                      className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none bg-slate-50"
                      required
                    />
                  </div>
                </div>

                {activeRole === 'owner' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Hotel / Property Name</label>
                    <div className="relative">
                      <HotelIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={hotelName}
                        onChange={e => setHotelName(e.target.value)}
                        placeholder="e.g. Margalla Serene Palace"
                        className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none bg-slate-50"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Contact Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none bg-slate-50"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={
                    activeRole === 'admin' ? 'admin@hotelplatform.com' :
                    activeRole === 'owner' ? 'owner@hotelname.com' :
                    'guest@example.com'
                  }
                  className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none bg-slate-50"
                  required
                />
              </div>
            </div>

            {/* Password / Passcode */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  {activeRole === 'admin' ? 'Admin Master Key / Passcode' : 'Password'}
                </label>
                {activeRole === 'admin' && (
                  <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                    Key: ADMIN2026
                  </span>
                )}
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={activeRole === 'admin' ? adminPasscode : password}
                  onChange={e => {
                    if (activeRole === 'admin') setAdminPasscode(e.target.value);
                    else setPassword(e.target.value);
                  }}
                  placeholder={activeRole === 'admin' ? 'Enter ADMIN2026' : '••••••••••••'}
                  className="w-full pl-10 pr-10 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none bg-slate-50 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className={`w-full py-3 text-white rounded-2xl text-xs font-black shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                activeRole === 'admin' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' :
                activeRole === 'owner' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' :
                'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {authMode === 'login' ? `Sign In to ${activeRole.toUpperCase()} Account` : `Create & Register ${activeRole.toUpperCase()} Account`}
            </button>
          </form>

          {/* Quick 1-Click Demo Profiles */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                1-Click Instant Demo Credentials
              </span>
              <span className="text-[10px] text-slate-400">Click to authenticate directly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeRole === 'admin' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@hotelplatform.com', 'admin', 'ADMIN2026')}
                    className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition flex items-center gap-2.5 cursor-pointer group"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                      alt="Alveena Admin"
                      className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">Alveena Admin</p>
                      <p className="text-[10px] text-slate-500 truncate">Executive Superadmin</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('ops@hotelplatform.com', 'admin', 'ADMIN2026')}
                    className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      HQ
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">Operations Control</p>
                      <p className="text-[10px] text-slate-500 truncate">Audits & Inspections</p>
                    </div>
                  </button>
                </>
              )}

              {activeRole === 'guest' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('sarah.jenkins@traveler.com', 'guest')}
                    className="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition flex items-center gap-2.5 cursor-pointer group"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                      alt="Sarah Jenkins"
                      className="w-8 h-8 rounded-full object-cover border border-emerald-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">Sarah Jenkins</p>
                      <p className="text-[10px] text-slate-500 truncate">Verified Traveler (5 Bookings)</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('amina.khan@example.com', 'guest')}
                    className="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      AK
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">Amina Khan</p>
                      <p className="text-[10px] text-slate-500 truncate">Tourist Explorer</p>
                    </div>
                  </button>
                </>
              )}

              {activeRole === 'owner' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('tariq@serenaviews.com', 'owner')}
                    className="p-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition flex items-center gap-2.5 cursor-pointer group"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                      alt="Tariq Mehmood"
                      className="w-8 h-8 rounded-full object-cover border border-amber-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-amber-900">Tariq Mehmood</p>
                      <p className="text-[10px] text-slate-500 truncate">Serena Heights (Approved)</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('karim@hunzaserai.com', 'owner')}
                    className="p-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition flex items-center gap-2.5 cursor-pointer group"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                      alt="Mirza Karim"
                      className="w-8 h-8 rounded-full object-cover border border-amber-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-amber-900">Mirza Karim</p>
                      <p className="text-[10px] text-slate-500 truncate">Hunza Serai (Approved)</p>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Current Logged In Status Banner */}
          <div className="p-3 bg-slate-100 rounded-2xl flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Current Session: <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})</span>
            </div>
            <button
              type="button"
              onClick={() => {
                logoutUser();
                showToast('Signed out from current session', 'info');
              }}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
