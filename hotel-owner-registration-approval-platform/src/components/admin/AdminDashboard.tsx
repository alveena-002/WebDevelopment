import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hotel, CleaningRequest, CleaningTeam } from '../../types';
import { ApplicationDossierModal } from '../modals/ApplicationDossierModal';
import { AdminAddHotelModal } from '../modals/AdminAddHotelModal';
import { SupabaseSchemaModal } from '../modals/SupabaseSchemaModal';
import { OfficialCertificateModal } from '../modals/OfficialCertificateModal';
import { DocumentInspectorModal } from '../modals/DocumentInspectorModal';
import { AdminSanitationRatingModal } from '../modals/AdminSanitationRatingModal';
import { AdminVisualOperationsDeck } from './AdminVisualOperationsDeck';
import { AdminTreasurySettlements } from './AdminTreasurySettlements';
import { AdminActivityLogs } from './AdminActivityLogs';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Building2, 
  Users, 
  Sparkles, 
  Database, 
  Search, 
  Plus, 
  ExternalLink, 
  Star, 
  DollarSign, 
  BookmarkCheck, 
  Calendar,
  Send,
  UserCheck,
  Bed,
  MapPin,
  Filter,
  FileText,
  Award,
  Activity,
  Layers,
  Sliders,
  LogIn,
  KeyRound
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser,
    openAuthModal,
    hotels, 
    bookings, 
    cleaningRequests, 
    cleaningTeams, 
    adminApproveHotel, 
    adminRejectHotel, 
    adminSuspendHotel, 
    adminReactivateHotel,
    adminAssignCleaningTeam,
    updateCleaningStatus,
    showToast
  } = useApp();

  const [activeSection, setActiveSection] = useState<
    'operations' | 'pending' | 'approved' | 'rejected' | 'suspended' | 'treasury' | 'logs' | 'cleaning' | 'all'
  >('operations');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHotelForDossier, setSelectedHotelForDossier] = useState<Hotel | null>(null);
  const [selectedHotelForCertificate, setSelectedHotelForCertificate] = useState<Hotel | null>(null);
  const [selectedHotelForDocInspect, setSelectedHotelForDocInspect] = useState<Hotel | null>(null);
  const [selectedHotelForSanitation, setSelectedHotelForSanitation] = useState<Hotel | null>(null);
  
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  
  // Cleaning team assignment modal
  const [assigningCleaningReq, setAssigningCleaningReq] = useState<CleaningRequest | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState(cleaningTeams[0]?.id || '');

  // Filtered lists
  const pendingHotels = hotels.filter(h => h.status === 'Pending Approval' || h.status === 'Draft');
  const approvedHotels = hotels.filter(h => h.status === 'Approved' || h.status === 'Active');
  const rejectedHotels = hotels.filter(h => h.status === 'Rejected');
  const suspendedHotels = hotels.filter(h => h.status === 'Suspended');

  // Overall platform stats
  const totalPlatformRevenue = bookings
    .filter(b => b.status !== 'Cancelled' && b.status !== 'Rejected')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const getFilteredHotels = () => {
    let list: Hotel[] = [];
    if (activeSection === 'pending') list = pendingHotels;
    else if (activeSection === 'approved') list = approvedHotels;
    else if (activeSection === 'rejected') list = rejectedHotels;
    else if (activeSection === 'suspended') list = suspendedHotels;
    else list = hotels;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return list.filter(h => 
        h.name.toLowerCase().includes(q) || 
        h.businessOwnerName.toLowerCase().includes(q) || 
        h.city.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const handleAssignTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (assigningCleaningReq && selectedTeamId) {
      adminAssignCleaningTeam(assigningCleaningReq.id, selectedTeamId);
      setAssigningCleaningReq(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner with Platform Metrics */}
      <div className="relative p-6 sm:p-7 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80"
            alt="Executive Command Center"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900/80" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black tracking-tight">Platform Administration & Quality Operations</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Logged in as {currentUser.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
              Enforce hospitality audits, review scanned licenses, issue verified certificates, and dispatch cleaning fleets across Pakistan.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={() => openAuthModal('admin', 'login')}
            className="px-3.5 py-2 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer border border-indigo-400/30"
          >
            <KeyRound className="w-3.5 h-3.5" /> Admin Auth / Switch
          </button>
          <button
            onClick={() => setShowAddHotelModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Admin Adds Hotel
          </button>
          <button
            onClick={() => setShowSupabaseModal(true)}
            className="px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" /> Database & RLS Keys
          </button>
        </div>
      </div>

      {/* Admin KPI & Navigation Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        
        {/* Visual Operations Pillar */}
        <button
          onClick={() => setActiveSection('operations')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeSection === 'operations'
              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-indigo-800">Visual Operations</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-950 mt-1">3</p>
          <span className="text-[10px] text-indigo-700 font-semibold">Audit Standards</span>
        </button>

        {/* Pending Requests */}
        <button
          onClick={() => setActiveSection('pending')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeSection === 'pending'
              ? 'bg-amber-500/10 border-amber-400 text-amber-950 ring-2 ring-amber-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-amber-800">Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-950 mt-1">{pendingHotels.length}</p>
          <span className="text-[10px] text-amber-700 font-semibold">Requires Review</span>
        </button>

        {/* Approved Hotels */}
        <button
          onClick={() => setActiveSection('approved')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeSection === 'approved'
              ? 'bg-emerald-500/10 border-emerald-400 text-emerald-950 ring-2 ring-emerald-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-emerald-800">Approved Hotels</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-950 mt-1">{approvedHotels.length}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">Live on Portal</span>
        </button>

        {/* Treasury / Settlements */}
        <button
          onClick={() => setActiveSection('treasury')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeSection === 'treasury'
              ? 'bg-emerald-950 text-white border-emerald-900 ring-2 ring-emerald-600'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase ${activeSection === 'treasury' ? 'text-emerald-300' : 'text-slate-600'}`}>
              Treasury & Payouts
            </span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className={`text-xl font-black font-mono mt-1 ${activeSection === 'treasury' ? 'text-emerald-400' : 'text-slate-900'}`}>
            ${(totalPlatformRevenue * 0.15).toFixed(0)}
          </p>
          <span className={`text-[10px] font-semibold ${activeSection === 'treasury' ? 'text-emerald-200' : 'text-slate-500'}`}>
            15% Net Commission
          </span>
        </button>

        {/* Cleaning Dispatch */}
        <button
          onClick={() => setActiveSection('cleaning')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeSection === 'cleaning'
              ? 'bg-purple-500/10 border-purple-400 text-purple-950 ring-2 ring-purple-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-purple-800">Cleaning Fleet</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-950 mt-1">
            {cleaningRequests.filter(c => c.status === 'Requested').length}
          </p>
          <span className="text-[10px] text-purple-700 font-semibold">{cleaningTeams.length} Hubs Dispatched</span>
        </button>

        {/* Activity Logs */}
        <button
          onClick={() => setActiveSection('logs')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeSection === 'logs'
              ? 'bg-slate-900 text-white border-slate-800 ring-2 ring-slate-700'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase ${activeSection === 'logs' ? 'text-slate-300' : 'text-slate-600'}`}>
              Security Logs
            </span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <p className={`text-2xl font-black mt-1 ${activeSection === 'logs' ? 'text-white' : 'text-slate-900'}`}>
            Live
          </p>
          <span className={`text-[10px] font-semibold ${activeSection === 'logs' ? 'text-slate-300' : 'text-slate-500'}`}>
            Audit Trail
          </span>
        </button>

        {/* Rejected & Suspended */}
        <button
          onClick={() => setActiveSection('rejected')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeSection === 'rejected'
              ? 'bg-rose-500/10 border-rose-400 text-rose-950 ring-2 ring-rose-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-rose-800">Rejected / Susp</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-950 mt-1">{rejectedHotels.length + suspendedHotels.length}</p>
          <span className="text-[10px] text-rose-700 font-semibold">Flagged / Paused</span>
        </button>

      </div>

      {/* Main Section Content */}
      {activeSection === 'operations' && (
        <AdminVisualOperationsDeck
          onOpenAddHotel={() => setShowAddHotelModal(true)}
          onOpenSupabase={() => setShowSupabaseModal(true)}
          onFilterCategory={(tab) => {
            if (tab === 'pending') setActiveSection('pending');
            else if (tab === 'approved') setActiveSection('approved');
            else if (tab === 'cleaning') setActiveSection('cleaning');
            else if (tab === 'treasury') setActiveSection('treasury');
            else if (tab === 'logs') setActiveSection('logs');
          }}
        />
      )}

      {activeSection === 'treasury' && (
        <AdminTreasurySettlements />
      )}

      {activeSection === 'logs' && (
        <AdminActivityLogs />
      )}

      {activeSection === 'cleaning' && (
        /* Cleaning Teams Dispatch Operations */
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                  Hotel Cleaning Dispatch & Operations
                </h3>
                <p className="text-xs text-slate-500">
                  Assign verified sanitation crews to hotel owner complimentary cleaning requests.
                </p>
              </div>
            </div>

            {cleaningRequests.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">No active cleaning requests.</p>
            ) : (
              <div className="space-y-3">
                {cleaningRequests.map(req => (
                  <div key={req.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{req.hotelName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'Assigned' ? 'bg-purple-100 text-purple-800' :
                          req.status === 'In-Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Type: <strong>{req.cleaningType}</strong> • Preferred: {req.preferredDate} ({req.preferredTimeSlot})
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Target: {req.roomNumbers.join(', ')} • Requester: {req.requestedBy}
                      </p>
                      {req.assignedTeamName && (
                        <p className="text-xs font-semibold text-purple-900 bg-purple-50 p-2 rounded-xl border border-purple-200">
                          Dispatched Crew: {req.assignedTeamName} ({req.assignedTeamPhone})
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === 'Requested' && (
                        <button
                          onClick={() => setAssigningCleaningReq(req)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                        >
                          Assign Cleaning Team
                        </button>
                      )}
                      {req.status === 'Assigned' && (
                        <button
                          onClick={() => updateCleaningStatus(req.id, 'In-Progress')}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                        >
                          Mark In-Progress
                        </button>
                      )}
                      {req.status === 'In-Progress' && (
                        <button
                          onClick={() => updateCleaningStatus(req.id, 'Completed')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Cleaning Teams Grid */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Contracted Cleaning & Sanitization Crews ({cleaningTeams.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cleaningTeams.map(team => (
                <div key={team.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{team.name}</span>
                    <span className="text-amber-500 font-bold flex items-center gap-0.5">★ {team.rating}</span>
                  </div>
                  <p className="text-slate-600">Lead: {team.teamLead} ({team.phone})</p>
                  <p className="text-slate-500 text-[11px]">Region: {team.activeZone}</p>
                  <div className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg">
                    Active Jobs: {team.currentWorkload}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hotel Lists (Pending, Approved, Rejected, Suspended, All) */}
      {(activeSection === 'pending' || activeSection === 'approved' || activeSection === 'rejected' || activeSection === 'suspended' || activeSection === 'all') && (
        <div className="space-y-4">
          
          {/* Filter and Search Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search hotels by name, owner, city, or category..."
                className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 overflow-x-auto w-full sm:w-auto">
              {(['all', 'pending', 'approved', 'rejected', 'suspended'] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setActiveSection(sec)}
                  className={`px-3 py-1.5 rounded-xl capitalize transition whitespace-nowrap cursor-pointer ${
                    activeSection === sec
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sec} ({
                    sec === 'pending' ? pendingHotels.length :
                    sec === 'approved' ? approvedHotels.length :
                    sec === 'rejected' ? rejectedHotels.length :
                    sec === 'suspended' ? suspendedHotels.length : hotels.length
                  })
                </button>
              ))}
            </div>
          </div>

          {/* Hotel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredHotels().map(hotel => {
              // 2-3 Visual images array for card preview
              const cardImages = [
                hotel.coverImageUrl,
                ...(hotel.galleryImages || []),
                ...(hotel.documents.map(d => d.url) || [])
              ].slice(0, 3);

              return (
                <div
                  key={hotel.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-slate-400 hover:shadow-lg transition duration-200"
                >
                  <div>
                    {/* Primary Cover Image */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={hotel.coverImageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs ${
                          hotel.status === 'Approved' || hotel.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          hotel.status === 'Pending Approval' ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse' :
                          hotel.status === 'Rejected' ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-slate-900 text-white border-slate-700'
                        }`}>
                          {hotel.status}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        <button
                          onClick={() => setSelectedHotelForSanitation(hotel)}
                          className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 backdrop-blur-xs flex items-center gap-1 cursor-pointer hover:bg-emerald-900 transition"
                          title="Click to adjust sanitation score"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          {hotel.sanitationScore || 98}% Clean
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="font-bold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {hotel.category}
                        </span>
                        <span className="text-[11px] text-slate-200">
                          {hotel.numberOfRooms} Rooms
                        </span>
                      </div>
                    </div>

                    {/* 2 to 3 Image Thumbnail Gallery Strip */}
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 border-b border-slate-200">
                      {cardImages.map((imgUrl, i) => (
                        <div 
                          key={i} 
                          onClick={() => setSelectedHotelForDocInspect(hotel)}
                          className="h-14 rounded-lg overflow-hidden relative cursor-pointer group/thumb border border-slate-300"
                        >
                          <img
                            src={imgUrl}
                            alt="Preview"
                            className="w-full h-full object-cover group-hover/thumb:scale-110 transition"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-black/0 transition" />
                        </div>
                      ))}
                    </div>

                    {/* Details Info */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                          {hotel.name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {hotel.city}, {hotel.country}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-2xl space-y-1 text-xs">
                        <p className="text-slate-700 truncate">
                          Owner: <strong className="text-slate-900">{hotel.businessOwnerName}</strong>
                        </p>
                        <p className="text-slate-500 text-[11px] truncate">
                          {hotel.email} • {hotel.phone}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                          <span>Docs: <strong className="text-slate-800">{hotel.documents.length} Files</strong></span>
                          <span>Rating: <strong className="text-slate-800">{hotel.averageRating} ★</strong></span>
                        </div>
                      </div>

                      {hotel.rejectionReason && (
                        <p className="text-[11px] text-rose-800 bg-rose-50 p-2 rounded-xl border border-rose-200">
                          Rejection Note: {hotel.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                    
                    {/* Upper Buttons: Docs & Certificate */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedHotelForDocInspect(hotel)}
                        className="py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 border border-indigo-200 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-600" /> Inspect Docs ({hotel.documents.length})
                      </button>

                      <button
                        onClick={() => setSelectedHotelForCertificate(hotel)}
                        className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 border border-amber-200 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-600" /> Certificate
                      </button>
                    </div>

                    {/* Lower Buttons: Dossier & Quick Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedHotelForDossier(hotel)}
                        className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Full Application Dossier
                      </button>

                      {hotel.status === 'Pending Approval' && (
                        <button
                          onClick={() => adminApproveHotel(hotel.id)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                          title="Quick Approve"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedHotelForSanitation(hotel)}
                        className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition cursor-pointer"
                        title="Edit Sanitation & Tier"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {getFilteredHotels().length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No hotels matching this filter or search query.
            </div>
          )}
        </div>
      )}

      {/* Modal: Application Dossier for Admin Inspection */}
      {selectedHotelForDossier && (
        <ApplicationDossierModal
          hotel={selectedHotelForDossier}
          isOpen={!!selectedHotelForDossier}
          onClose={() => setSelectedHotelForDossier(null)}
        />
      )}

      {/* Modal: Official Printable Certificate */}
      {selectedHotelForCertificate && (
        <OfficialCertificateModal
          hotel={selectedHotelForCertificate}
          isOpen={!!selectedHotelForCertificate}
          onClose={() => setSelectedHotelForCertificate(null)}
        />
      )}

      {/* Modal: Document Inspector */}
      {selectedHotelForDocInspect && (
        <DocumentInspectorModal
          hotel={selectedHotelForDocInspect}
          isOpen={!!selectedHotelForDocInspect}
          onClose={() => setSelectedHotelForDocInspect(null)}
        />
      )}

      {/* Modal: Sanitation Rating & Tier Adjustment */}
      {selectedHotelForSanitation && (
        <AdminSanitationRatingModal
          hotel={selectedHotelForSanitation}
          isOpen={!!selectedHotelForSanitation}
          onClose={() => setSelectedHotelForSanitation(null)}
        />
      )}

      {/* Modal: Admin Adds Hotel */}
      {showAddHotelModal && (
        <AdminAddHotelModal
          isOpen={showAddHotelModal}
          onClose={() => setShowAddHotelModal(false)}
        />
      )}

      {/* Modal: Supabase Schema & Key Config */}
      {showSupabaseModal && (
        <SupabaseSchemaModal
          isOpen={showSupabaseModal}
          onClose={() => setShowSupabaseModal(false)}
        />
      )}

      {/* Modal: Assign Cleaning Team */}
      {assigningCleaningReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Assign Cleaning Team</h3>
              <button onClick={() => setAssigningCleaningReq(null)} className="cursor-pointer">✕</button>
            </div>

            <p className="text-xs text-slate-600">
              Assign a certified crew for <strong>{assigningCleaningReq.hotelName}</strong> ({assigningCleaningReq.cleaningType} on {assigningCleaningReq.preferredDate}).
            </p>

            <form onSubmit={handleAssignTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Available Cleaning Team</label>
                <select
                  value={selectedTeamId}
                  onChange={e => setSelectedTeamId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-medium"
                >
                  {cleaningTeams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} — Lead: {team.teamLead} ({team.activeZone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningCleaningReq(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Dispatch Team & Notify Owner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
