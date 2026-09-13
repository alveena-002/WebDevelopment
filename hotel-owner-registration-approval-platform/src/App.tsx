import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole, Hotel } from './types';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { HotelOwnerDashboard } from './components/owner/HotelOwnerDashboard';
import { PublicHotelList } from './components/public/PublicHotelList';
import { PublicHotelDetail } from './components/public/PublicHotelDetail';
import { HotelRegistrationModal } from './components/onboarding/HotelRegistrationModal';
import { SupabaseSchemaModal } from './components/modals/SupabaseSchemaModal';
import { AuthModal } from './components/modals/AuthModal';
import { Toast } from './components/common/Toast';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  Compass, 
  PlusCircle, 
  Database, 
  Bell, 
  Sparkles, 
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  LogIn,
  LogOut,
  KeyRound,
  UserPlus
} from 'lucide-react';

function MainApp() {
  const { 
    currentUser, 
    setCurrentUser, 
    hotels, 
    notifications, 
    markNotificationAsRead,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    authModalInitialRole,
    authModalInitialMode,
    logoutUser
  } = useApp();

  const [selectedPublicHotel, setSelectedPublicHotel] = useState<Hotel | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.isRead);

  // Switch roles helper
  const handleRoleChange = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser({
        id: 'usr_admin_01',
        name: 'Alveena Admin',
        email: 'admin@hotelplatform.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      });
    } else if (role === 'owner') {
      // Find an owner hotel
      const firstHotel = hotels[0];
      setCurrentUser({
        id: firstHotel?.ownerId || 'usr_owner_01',
        name: firstHotel?.businessOwnerName || 'Sultan Tariq',
        email: firstHotel?.email || 'sultan@serenaview.com',
        role: 'owner',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      });
    } else {
      setCurrentUser({
        id: 'usr_guest_99',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@traveler.com',
        role: 'guest',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      });
      setSelectedPublicHotel(null);
    }
  };

  // Switch owner context to simulate different approval stages
  const handleSwitchOwnerHotel = (hotelId: string) => {
    const targetHotel = hotels.find(h => h.id === hotelId);
    if (targetHotel) {
      setCurrentUser({
        id: targetHotel.ownerId,
        name: targetHotel.businessOwnerName,
        email: targetHotel.email,
        role: 'owner',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-950 tracking-tight text-base sm:text-lg">
                  LODGE<span className="text-indigo-600">PASS</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  Verification Core
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Hotel Owner Registration & Approval Platform</p>
            </div>
          </div>

          {/* Center Navigation & Active Views */}
          <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => handleRoleChange('guest')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                currentUser.role === 'guest'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Guest</span> Portal
            </button>

            <button
              onClick={() => handleRoleChange('owner')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                currentUser.role === 'owner'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Owner</span> Dashboard
            </button>

            <button
              onClick={() => handleRoleChange('admin')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                currentUser.role === 'admin'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span> Control
            </button>
          </nav>

          {/* Right Action Icons & Register CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Owner Scenario Switcher (Pending / Approved / Rejected) */}
            {currentUser.role === 'owner' && (
              <div className="hidden lg:flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-xs">
                <span className="text-[11px] font-bold text-indigo-900">Hotel:</span>
                <select
                  value={hotels.find(h => h.ownerId === currentUser.id)?.id || ''}
                  onChange={e => handleSwitchOwnerHotel(e.target.value)}
                  className="bg-transparent font-semibold text-indigo-950 text-xs focus:outline-none cursor-pointer"
                >
                  {hotels.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Auth Sign-In / Register Button */}
            <button
              onClick={() => openAuthModal(currentUser.role, 'login')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Sign In / Register</span>
            </button>

            {/* Register Hotel Button (Option 2) */}
            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-3 sm:px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Register Hotel</span>
            </button>

            {/* Supabase Schema Modal CTA */}
            <button
              onClick={() => setShowSupabaseModal(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              title="Supabase Database Schema & RLS Policies"
            >
              <Database className="w-4 h-4 text-emerald-600" />
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {showNotificationsDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold uppercase text-slate-900">Notifications</h4>
                    <span className="text-[10px] text-indigo-600 font-semibold">{unreadNotifications.length} unread</span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 rounded-xl border text-xs space-y-1 transition cursor-pointer ${
                            n.isRead ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-indigo-50/70 border-indigo-200 text-indigo-950 font-medium'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-slate-900">{n.title}</span>
                            <span className="text-[9px] text-slate-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar with dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden xl:block text-left text-xs">
                  <span className="font-bold text-slate-900 block leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 space-y-2">
                  <div className="p-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      currentUser.role === 'admin' ? 'bg-indigo-100 text-indigo-800' :
                      currentUser.role === 'owner' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {currentUser.role} account
                    </span>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        openAuthModal('admin', 'login');
                      }}
                      className="w-full p-2 text-left text-xs font-medium hover:bg-slate-50 rounded-xl flex items-center gap-2 text-slate-700 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-indigo-600" /> Admin Sign In / Passcode
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        openAuthModal('guest', 'login');
                      }}
                      className="w-full p-2 text-left text-xs font-medium hover:bg-slate-50 rounded-xl flex items-center gap-2 text-slate-700 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-emerald-600" /> Guest Sign In / Register
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        openAuthModal('owner', 'login');
                      }}
                      className="w-full p-2 text-left text-xs font-medium hover:bg-slate-50 rounded-xl flex items-center gap-2 text-slate-700 cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-amber-600" /> Owner Sign In / Register
                    </button>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          logoutUser();
                        }}
                        className="w-full p-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Role: Admin */}
        {currentUser.role === 'admin' && (
          <AdminDashboard />
        )}

        {/* Role: Hotel Owner */}
        {currentUser.role === 'owner' && (
          <HotelOwnerDashboard />
        )}

        {/* Role: Guest / Customer */}
        {currentUser.role === 'guest' && (
          selectedPublicHotel ? (
            <PublicHotelDetail
              hotel={selectedPublicHotel}
              onBack={() => setSelectedPublicHotel(null)}
            />
          ) : (
            <PublicHotelList
              onSelectHotel={hotel => setSelectedPublicHotel(hotel)}
            />
          )
        )}

      </main>

      {/* Toast Notification */}
      <Toast />

      {/* Authentication Modal (Admin, Guest & Owner Login / Sign In / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialRole={authModalInitialRole}
        initialMode={authModalInitialMode}
      />

      {/* Hotel Owner Self-Registration Modal (Option 2 Workflow) */}
      {showRegisterModal && (
        <HotelRegistrationModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      )}

      {/* Supabase Schema & Database Integration Modal */}
      {showSupabaseModal && (
        <SupabaseSchemaModal
          isOpen={showSupabaseModal}
          onClose={() => setShowSupabaseModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 LodgePass. Hotel Owner Registration, Verification & Cleaning Operations Platform.</p>
          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <span>Section 1: Two Registration Options</span>
            <span>•</span>
            <span>Section 2: Verification Workflow</span>
            <span>•</span>
            <span>Section 7: Supabase RLS Protected</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

