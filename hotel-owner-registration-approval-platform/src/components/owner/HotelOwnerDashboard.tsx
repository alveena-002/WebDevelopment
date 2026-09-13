import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AMENITY_LIST } from '../../data/seedData';
import { RoomCategory, HotelCategory, Amenity } from '../../types';
import { ImageUploadHelper } from '../common/ImageUploadHelper';
import { HotelRegistrationModal } from '../onboarding/HotelRegistrationModal';
import { OwnerVisualBookingCalendar } from './OwnerVisualBookingCalendar';
import { 
  Building2, 
  Bed, 
  Calendar as CalendarIcon, 
  CalendarDays,
  BookmarkCheck, 
  Star, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  ShieldAlert, 
  Check, 
  X,
  ChevronLeft,
  ChevronRight,
  Sparkle
} from 'lucide-react';

export const HotelOwnerDashboard: React.FC = () => {
  const { 
    currentUser, 
    hotels, 
    getHotelByOwnerId, 
    ownerUpdateHotelProfile, 
    rooms, 
    getRoomsByHotelId, 
    addRoomCategory, 
    updateRoomCategory, 
    deleteRoomCategory, 
    toggleRoomBlockedDate,
    bookings, 
    getBookingsByHotelId, 
    updateBookingStatus,
    reviews, 
    getReviewsByHotelId, 
    replyToReview,
    cleaningRequests, 
    getCleaningRequestsByHotelId, 
    getEligibleCleaningCredits, 
    requestCleaningService,
    showToast
  } = useApp();

  // Find owner's assigned hotel
  const hotel = getHotelByOwnerId(currentUser.id) || hotels.find(h => h.ownerId === currentUser.id) || hotels[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'rooms' | 'calendar' | 'bookings' | 'reviews' | 'cleaning'>('overview');
  
  // Modals state
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomCategory | null>(null);
  const [showCleaningModal, setShowCleaningModal] = useState(false);
  
  // Profile edit state
  const [profileName, setProfileName] = useState(hotel?.name || '');
  const [profileDesc, setProfileDesc] = useState(hotel?.description || '');
  const [profilePhone, setProfilePhone] = useState(hotel?.phone || '');
  const [profileAddress, setProfileAddress] = useState(hotel?.address || '');
  const [profileLogo, setProfileLogo] = useState(hotel?.logoUrl || '');
  const [profileCover, setProfileCover] = useState(hotel?.coverImageUrl || '');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Calendar navigation state
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 7, 1)); // August 2026

  // Review reply state
  const [replyTextMap, setReplyTextMap] = useState<{ [key: string]: string }>({});

  // Cleaning request form
  const [cleanRoomNumbers, setCleanRoomNumbers] = useState('Room 201, Room 202');
  const [cleanType, setCleanType] = useState<'Deep Clean' | 'Standard Turnover' | 'Lobby & Common Areas' | 'Disinfection & Sanitization'>('Deep Clean');
  const [cleanDate, setCleanDate] = useState('2026-08-28');
  const [cleanSlot, setCleanSlot] = useState<'Morning (09:00 - 12:00)' | 'Afternoon (12:00 - 15:00)' | 'Evening (15:00 - 18:00)'>('Morning (09:00 - 12:00)');
  const [cleanNotes, setCleanNotes] = useState('');

  if (!hotel) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto my-12">
        <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">No Hotel Assigned</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          You are logged in as {currentUser.name}, but have not registered a hotel yet.
        </p>
        <button
          onClick={() => setShowResubmitModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          Submit Hotel Registration Request
        </button>
        {showResubmitModal && (
          <HotelRegistrationModal isOpen={showResubmitModal} onClose={() => setShowResubmitModal(false)} />
        )}
      </div>
    );
  }

  // 1. IF PENDING APPROVAL OR DRAFT (Section 2 Workflow)
  if (hotel.status === 'Pending Approval' || hotel.status === 'Draft') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-6 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500 text-white rounded-xl shadow-md">
              <Clock className="w-8 h-8 animate-spin-slow" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  Status: Pending Approval
                </span>
                <span className="text-xs text-slate-500">Submitted on {new Date(hotel.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">{hotel.name} is Under Administrative Review</h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                As per platform specifications, your hotel cannot publish rooms or receive customer bookings until our administrative committee verifies your business credentials and approves your application.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Progress Stepper */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Application Review Stages</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-950">1. Details Received</h4>
                <p className="text-[11px] text-emerald-800 mt-0.5">Hotel information, coordinates & contacts cataloged.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/80 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-amber-950">2. Admin Verification</h4>
                <p className="text-[11px] text-amber-800 mt-0.5">Auditing license, CNIC, and location accuracy.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 opacity-60">
              <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-700">3. Dashboard Unlock</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Full calendar, booking management & cleaning access.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Need to modify submitted information before decision?
            </div>
            <button
              onClick={() => setShowResubmitModal(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" /> Update Submitted Application
            </button>
          </div>
        </div>

        {showResubmitModal && (
          <HotelRegistrationModal
            isOpen={showResubmitModal}
            onClose={() => setShowResubmitModal(false)}
            initialData={hotel}
            isResubmit={true}
          />
        )}
      </div>
    );
  }

  // 2. IF REJECTED (Section 2 Workflow with Resubmission)
  if (hotel.status === 'Rejected') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-6 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-600 text-white rounded-xl shadow-md">
              <XCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                Application Status: Rejected
              </span>
              <h2 className="text-xl font-black text-rose-950">Action Required: Registration Revision Requested</h2>
              <p className="text-xs text-rose-800 leading-relaxed">
                Your application for <strong>{hotel.name}</strong> was reviewed and rejected with the reason below. You can update your details or documents and resubmit for approval.
              </p>
            </div>
          </div>

          {/* Rejection reason box */}
          <div className="p-4 bg-white rounded-xl border border-rose-200 shadow-xs space-y-1.5">
            <div className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" /> Admin Rejection Reason:
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium bg-rose-50/50 p-3 rounded-lg border border-rose-100">
              "{hotel.rejectionReason || 'Please provide updated documentation and verify details.'}"
            </p>
            {hotel.adminNotes && (
              <p className="text-[11px] text-slate-500 pt-1">Admin Notes: {hotel.adminNotes}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowResubmitModal(true)}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" /> Edit Application & Resubmit Now
            </button>
          </div>
        </div>

        {showResubmitModal && (
          <HotelRegistrationModal
            isOpen={showResubmitModal}
            onClose={() => setShowResubmitModal(false)}
            initialData={hotel}
            isResubmit={true}
          />
        )}
      </div>
    );
  }

  // 3. IF SUSPENDED (Section 4/5)
  if (hotel.status === 'Suspended') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-6 bg-slate-900 border-2 border-slate-700 text-white rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-slate-900 rounded-xl font-bold">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-400">Hotel Temporarily Suspended</h2>
              <p className="text-xs text-slate-300">
                Your property is currently not visible in public searches or taking new reservations.
              </p>
            </div>
          </div>
          {hotel.suspensionReason && (
            <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-200">
              <strong>Suspension Reason:</strong> {hotel.suspensionReason}
            </div>
          )}
          <p className="text-xs text-slate-400">
            Please contact platform administration at <code className="text-slate-200">admin@hotelplatform.com</code> to request reactivaton following compliance inspection.
          </p>
        </div>
      </div>
    );
  }

  // 4. FULL UNLOCKED HOTEL OWNER DASHBOARD (After Approval - Section 3 Specification)
  const hotelRooms = getRoomsByHotelId(hotel.id);
  const hotelBookings = getBookingsByHotelId(hotel.id);
  const hotelReviews = getReviewsByHotelId(hotel.id);
  const hotelCleaningRequests = getCleaningRequestsByHotelId(hotel.id);
  const cleaningCredits = getEligibleCleaningCredits(hotel.id);

  // Revenue stats
  const totalRevenue = hotelBookings
    .filter(b => b.status !== 'Cancelled' && b.status !== 'Rejected')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const confirmedBookingsCount = hotelBookings.filter(b => b.status === 'Confirmed' || b.status === 'Completed').length;
  const pendingBookingsCount = hotelBookings.filter(b => b.status === 'Pending').length;

  // Handle profile update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    ownerUpdateHotelProfile(hotel.id, {
      name: profileName,
      description: profileDesc,
      phone: profilePhone,
      address: profileAddress,
      logoUrl: profileLogo,
      coverImageUrl: profileCover,
    });
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      const updatedGallery = [...(hotel.galleryImages || []), newGalleryUrl.trim()];
      ownerUpdateHotelProfile(hotel.id, { galleryImages: updatedGallery });
      setNewGalleryUrl('');
      showToast('New photo added to your hotel gallery!', 'success');
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    const updatedGallery = (hotel.galleryImages || []).filter((_, idx) => idx !== indexToRemove);
    ownerUpdateHotelProfile(hotel.id, { galleryImages: updatedGallery });
    showToast('Photo removed from gallery.', 'info');
  };

  // Cleaning request submission
  const handleRequestCleaning = (e: React.FormEvent) => {
    e.preventDefault();
    if (cleaningCredits.available < 1) {
      alert('You need at least 1 free cleaning credit earned from completed bookings to request service.');
      return;
    }

    requestCleaningService(hotel.id, {
      roomNumbers: cleanRoomNumbers.split(',').map(s => s.trim()).filter(Boolean),
      cleaningType: cleanType,
      preferredDate: cleanDate,
      preferredTimeSlot: cleanSlot,
      specialInstructions: cleanNotes,
    });

    setShowCleaningModal(false);
  };

  // Calendar Helpers (August 2026 Demo Month)
  const daysInMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1).getDay();

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Header */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-lg">
        <div className="absolute inset-0 opacity-30">
          <img src={hotel.coverImageUrl} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={hotel.logoUrl}
              alt={hotel.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-md bg-white shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{hotel.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Approved & Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {hotel.category} • {hotel.city}, {hotel.country} • Owner: <strong className="text-white">{hotel.businessOwnerName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddRoomModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Room Category
            </button>
            <button
              onClick={() => setShowCleaningModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Sparkle className="w-3.5 h-3.5" /> Request Cleaning ({cleaningCredits.available})
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Specification 3 items) */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-white rounded-xl px-4 pt-2 gap-2 shadow-xs">
        {[
          { id: 'overview', label: 'Overview & Metrics', icon: TrendingUp },
          { id: 'profile', label: 'Hotel Profile & Media', icon: Building2 },
          { id: 'rooms', label: `Room Categories (${hotelRooms.length})`, icon: Bed },
          { id: 'calendar', label: 'Visual Booking Calendar', icon: CalendarDays },
          { id: 'bookings', label: `Bookings (${hotelBookings.length})`, icon: BookmarkCheck, badge: pendingBookingsCount },
          { id: 'reviews', label: `Customer Reviews (${hotelReviews.length})`, icon: Star },
          { id: 'cleaning', label: `Cleaning Service (${cleaningCredits.available} Credits)`, icon: Sparkles },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.badge ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-black">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Metrics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">${totalRevenue.toLocaleString()}</p>
              <span className="text-[11px] text-emerald-600 font-semibold">From verified guest stays</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><BookmarkCheck className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{hotelBookings.length}</p>
              <span className="text-[11px] text-blue-600 font-semibold">{pendingBookingsCount} pending confirmation</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Average Rating</span>
                <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><Star className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{hotel.averageRating || '5.0'} / 5.0</p>
              <span className="text-[11px] text-slate-500 font-medium">Based on {hotel.reviewCount} customer reviews</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Free Cleaning Credits</span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Sparkles className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black text-purple-950 mt-2">{cleaningCredits.available} Available</p>
              <span className="text-[11px] text-purple-700 font-medium">{cleaningCredits.totalCompletedBookings} eligible stays logged</span>
            </div>
          </div>

          {/* Quick Action & Pending Reservations alert */}
          {pendingBookingsCount > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-950">You have {pendingBookingsCount} pending reservations awaiting approval</h4>
                  <p className="text-[11px] text-amber-800">Accept or reject them in the Bookings tab to lock in guest availability.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('bookings')}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0"
              >
                Review Reservations
              </button>
            </div>
          )}

          {/* Visual Booking Calendar Banner */}
          <div className="p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl border border-indigo-900/50 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Visual Booking & Room Availability Calendar</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Drag and drop to reschedule stays, inspect guest details, and manage room allocations in real-time.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('calendar')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 shrink-0"
            >
              <CalendarDays className="w-3.5 h-3.5" /> Launch Visual Calendar →
            </button>
          </div>

          {/* Recent Bookings preview */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Latest Guest Activity</h3>
              <button onClick={() => setActiveTab('bookings')} className="text-xs font-semibold text-indigo-600 hover:underline">
                View All Bookings →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-2.5 font-semibold uppercase">Booking #</th>
                    <th className="pb-2.5 font-semibold uppercase">Guest Name</th>
                    <th className="pb-2.5 font-semibold uppercase">Room Category</th>
                    <th className="pb-2.5 font-semibold uppercase">Stay Dates</th>
                    <th className="pb-2.5 font-semibold uppercase">Total</th>
                    <th className="pb-2.5 font-semibold uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hotelBookings.slice(0, 4).map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 font-mono font-bold text-slate-800">{b.bookingNumber}</td>
                      <td className="py-3 font-medium text-slate-900">{b.guestName}</td>
                      <td className="py-3 text-slate-600">{b.roomName}</td>
                      <td className="py-3 text-slate-600">{b.checkInDate} → {b.checkOutDate} ({b.totalNights}n)</td>
                      <td className="py-3 font-bold text-slate-900">${b.totalAmount}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          b.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hotel Profile & Media (Upload Logo, Cover, Unlimited Gallery) */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSaveProfile} className="lg:col-span-2 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Edit Hotel Details & Contacts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Hotel Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Primary Phone</label>
                <input
                  type="text"
                  required
                  value={profilePhone}
                  onChange={e => setProfilePhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Address</label>
              <input
                type="text"
                required
                value={profileAddress}
                onChange={e => setProfileAddress(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Narrative Description</label>
              <textarea
                rows={4}
                required
                value={profileDesc}
                onChange={e => setProfileDesc(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <ImageUploadHelper
                label="Hotel Logo"
                value={profileLogo}
                onChange={setProfileLogo}
                aspectRatio="square"
                presetCategory="logo"
              />
              <ImageUploadHelper
                label="Cover Image"
                value={profileCover}
                onChange={setProfileCover}
                aspectRatio="wide"
                presetCategory="hotel"
              />
            </div>

            <div className="border-t border-slate-200 pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Save Hotel Profile Changes
              </button>
            </div>
          </form>

          {/* Unlimited Gallery Images Manager */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Unlimited Hotel Gallery Images ({hotel.galleryImages?.length || 0})
            </h3>
            <p className="text-xs text-slate-500">
              Upload photos of your rooms, pool, lobby, dining areas, and exterior.
            </p>

            <div className="space-y-2">
              <input
                type="url"
                value={newGalleryUrl}
                onChange={e => setNewGalleryUrl(e.target.value)}
                placeholder="Paste high-res image URL (Unsplash, CDN...)"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add to Gallery
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 max-h-[380px] overflow-y-auto">
              {(hotel.galleryImages || []).map((url, idx) => (
                <div key={idx} className="relative h-24 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                  <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 bg-rose-600/90 hover:bg-rose-700 text-white rounded-md opacity-0 group-hover:opacity-100 transition shadow-xs"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Room Categories & Prices */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Room Categories & Accommodation Inventory
              </h3>
              <p className="text-xs text-slate-500">
                Configure rates, room capacity, bed specifications, and amenities.
              </p>
            </div>
            <button
              onClick={() => setShowAddRoomModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Room Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotelRooms.map(room => (
              <div key={room.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col group">
                <div className="relative h-44 bg-slate-100">
                  <img
                    src={room.photos[0] || hotel.coverImageUrl}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-900/80 backdrop-blur-xs text-white">
                      ${room.pricePerNight} <span className="text-[10px] font-normal text-slate-300">/ night</span>
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-slate-900 shadow-xs">
                      {room.categoryType}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{room.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{room.description}</p>
                    
                    <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium pt-2">
                      <span>👥 Max {room.maxGuests} Guests</span>
                      <span>🛏️ {room.bedType}</span>
                      <span>🚪 {room.totalRooms} Rooms</span>
                    </div>

                    {/* Amenities chips */}
                    <div className="flex flex-wrap gap-1 pt-2.5">
                      {room.amenities.slice(0, 4).map(amenId => {
                        const am = AMENITY_LIST.find(a => a.id === amenId);
                        return (
                          <span key={amenId} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-medium">
                            {am?.name || amenId}
                          </span>
                        );
                      })}
                      {room.amenities.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-[10px] text-indigo-700 font-semibold">
                          +{room.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => updateRoomCategory(room.id, { isAvailable: !room.isAvailable })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                        room.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {room.isAvailable ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      {room.isAvailable ? 'Available' : 'Paused'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const newPrice = prompt(`Enter updated price per night for ${room.name}:`, room.pricePerNight.toString());
                          if (newPrice && !isNaN(Number(newPrice))) {
                            updateRoomCategory(room.id, { pricePerNight: Number(newPrice) });
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                        title="Quick Price Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete room category "${room.name}"?`)) {
                            deleteRoomCategory(room.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                        title="Delete Room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Visual Booking & Availability Calendar */}
      {activeTab === 'calendar' && (
        <OwnerVisualBookingCalendar hotel={hotel} />
      )}

      {/* Tab 5: Manage Bookings (Accept / Reject Reservations) */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Guest Reservations & Booking Pipeline
              </h3>
              <p className="text-xs text-slate-500">
                Accept or reject pending reservations, track guest check-ins, and manage stay lifecycle.
              </p>
            </div>
          </div>

          {hotelBookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No reservations logged yet. When customers book your approved rooms, they will appear here in real-time.
            </div>
          ) : (
            <div className="space-y-3">
              {hotelBookings.map(b => (
                <div key={b.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {b.bookingNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'Pending' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                        b.status === 'Checked-In' ? 'bg-blue-100 text-blue-800' :
                        b.status === 'Completed' ? 'bg-slate-100 text-slate-700' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {b.guestName} <span className="text-xs font-normal text-slate-500">({b.guestEmail} • {b.guestPhone})</span>
                    </h4>

                    <p className="text-xs text-slate-600">
                      <strong>{b.roomName}</strong> • {b.numberOfGuests} Guests • {b.checkInDate} to {b.checkOutDate} ({b.totalNights} Nights)
                    </p>

                    {b.specialRequests && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        Special Request: "{b.specialRequests}"
                      </p>
                    )}
                  </div>

                  {/* Actions & Price */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                    <div className="text-right pr-2">
                      <span className="text-xs text-slate-400">Total Price</span>
                      <p className="text-lg font-black text-slate-900">${b.totalAmount}</p>
                    </div>

                    {b.status === 'Pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'Rejected')}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}

                    {b.status === 'Confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(b.id, 'Checked-In')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        Check-In Guest
                      </button>
                    )}

                    {b.status === 'Checked-In' && (
                      <button
                        onClick={() => updateBookingStatus(b.id, 'Completed')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
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
      )}

      {/* Tab 6: Customer Reviews & Responses */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Customer Reviews & Owner Feedback Replies
              </h3>
              <p className="text-xs text-slate-500">
                Verified reviews from guests with cleanliness, service, and location ratings.
              </p>
            </div>
          </div>

          {hotelReviews.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No guest reviews yet.
            </div>
          ) : (
            <div className="space-y-4">
              {hotelReviews.map(rev => (
                <div key={rev.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        {rev.guestAvatar ? (
                          <img src={rev.guestAvatar} alt={rev.guestName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 text-xs">
                            {rev.guestName[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{rev.guestName}</h4>
                        <span className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span>{rev.rating} / 5.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{rev.comment}"
                  </p>

                  <div className="flex gap-4 text-[11px] text-slate-500 font-medium">
                    <span>Cleanliness: {rev.cleanlinessRating}/5</span>
                    <span>Service: {rev.serviceRating}/5</span>
                    <span>Location: {rev.locationRating}/5</span>
                  </div>

                  {/* Owner Response */}
                  {rev.ownerReply ? (
                    <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-indigo-600" /> Official Response from {hotel.name}:
                      </span>
                      <p className="text-xs text-indigo-950">{rev.ownerReply.text}</p>
                    </div>
                  ) : (
                    <div className="pt-2 flex gap-2">
                      <input
                        type="text"
                        value={replyTextMap[rev.id] || ''}
                        onChange={e => setReplyTextMap({ ...replyTextMap, [rev.id]: e.target.value })}
                        placeholder="Write a professional response to this guest..."
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const text = replyTextMap[rev.id];
                          if (text && text.trim()) {
                            replyToReview(rev.id, text.trim());
                            setReplyTextMap({ ...replyTextMap, [rev.id]: '' });
                          }
                        }}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" /> Reply
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 7: Free Cleaning Service Center */}
      {activeTab === 'cleaning' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/30 text-purple-300 rounded-xl border border-purple-400/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Complimentary Professional Cleaning Service Program</h3>
                  <p className="text-xs text-purple-200">
                    Earn free deep sanitation and turnover cleaning services based on eligible completed guest bookings.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCleaningModal(true)}
                className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                Request Service ({cleaningCredits.available} Credits)
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white/10 rounded-xl">
                <span className="text-[10px] font-semibold text-purple-300 uppercase">Earned Credits</span>
                <p className="text-xl font-bold">{cleaningCredits.earned}</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <span className="text-[10px] font-semibold text-purple-300 uppercase">Credits Dispatched</span>
                <p className="text-xl font-bold">{cleaningCredits.used}</p>
              </div>
              <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl">
                <span className="text-[10px] font-semibold text-emerald-300 uppercase">Available to Redeem</span>
                <p className="text-xl font-bold text-emerald-200">{cleaningCredits.available}</p>
              </div>
            </div>
          </div>

          {/* Cleaning Requests History */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Cleaning Dispatches & Service History
            </h4>

            {hotelCleaningRequests.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
                No cleaning requests logged yet. Use your earned credits above to schedule certified hotel cleaning teams.
              </div>
            ) : (
              <div className="space-y-3">
                {hotelCleaningRequests.map(req => (
                  <div key={req.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{req.cleaningType}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'Assigned' ? 'bg-purple-100 text-purple-800' :
                          req.status === 'In-Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-slate-600">
                        Date: <strong>{req.preferredDate}</strong> ({req.preferredTimeSlot}) • Target: {req.roomNumbers.join(', ')}
                      </p>
                      {req.assignedTeamName && (
                        <p className="text-purple-800 font-semibold text-[11px]">
                          Assigned Crew: {req.assignedTeamName} ({req.assignedTeamPhone})
                        </p>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400">
                      Requested {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Room Category */}
      {showAddRoomModal && (
        <AddRoomModal
          hotelId={hotel.id}
          isOpen={showAddRoomModal}
          onClose={() => setShowAddRoomModal(false)}
          onAdd={addRoomCategory}
        />
      )}

      {/* Modal: Request Free Cleaning Service */}
      {showCleaningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-purple-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-purple-300" />
                <h3 className="text-base font-bold">Request Complimentary Cleaning</h3>
              </div>
              <button onClick={() => setShowCleaningModal(false)} className="text-purple-300 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRequestCleaning} className="p-6 space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900">
                You currently have <strong>{cleaningCredits.available} free cleaning credits</strong> available based on your eligible guest reservations.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Room Numbers / Target Areas</label>
                <input
                  type="text"
                  required
                  value={cleanRoomNumbers}
                  onChange={e => setCleanRoomNumbers(e.target.value)}
                  placeholder="e.g. Room 201, Room 202, Executive Floor"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Cleaning Service Type</label>
                <select
                  value={cleanType}
                  onChange={e => setCleanType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-medium"
                >
                  <option value="Deep Clean">Deep Clean & Sanitization</option>
                  <option value="Standard Turnover">Standard Turnover & Fresh Linen Prep</option>
                  <option value="Lobby & Common Areas">Lobby & Common Areas Refresh</option>
                  <option value="Disinfection & Sanitization">Full Disinfection & Carpet Steam</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={cleanDate}
                    onChange={e => setCleanDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Preferred Time Slot</label>
                  <select
                    value={cleanSlot}
                    onChange={e => setCleanSlot(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                  >
                    <option value="Morning (09:00 - 12:00)">Morning (09:00 - 12:00)</option>
                    <option value="Afternoon (12:00 - 15:00)">Afternoon (12:00 - 15:00)</option>
                    <option value="Evening (15:00 - 18:00)">Evening (15:00 - 18:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Special Instructions for Crew</label>
                <textarea
                  rows={2}
                  value={cleanNotes}
                  onChange={e => setCleanNotes(e.target.value)}
                  placeholder="e.g. Focus on bathroom mirrors and balcony sliding glass doors..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCleaningModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  Submit Dispatch Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Modal for Adding Room Category
const AddRoomModal: React.FC<{
  hotelId: string;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (hotelId: string, room: Omit<RoomCategory, 'id' | 'hotelId'>) => void;
}> = ({ hotelId, isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryType, setCategoryType] = useState<RoomCategory['categoryType']>('Deluxe');
  const [pricePerNight, setPricePerNight] = useState(120);
  const [totalRooms, setTotalRooms] = useState(6);
  const [maxGuests, setMaxGuests] = useState(2);
  const [bedType, setBedType] = useState('1 King Bed');
  const [sizeSqFt, setSizeSqFt] = useState(450);
  const [amenities, setAmenities] = useState<string[]>(['wifi', 'ac', 'breakfast', 'tv']);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80');

  if (!isOpen) return null;

  const toggleAmenity = (id: string) => {
    setAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(hotelId, {
      name,
      description,
      categoryType,
      pricePerNight: Number(pricePerNight),
      totalRooms: Number(totalRooms),
      maxGuests: Number(maxGuests),
      bedType,
      sizeSqFt: Number(sizeSqFt),
      amenities,
      photos: [photoUrl],
      isAvailable: true,
      blockedDates: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bed className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold">Add Room Category</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Room Category Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Executive King Mountain View"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category Type</label>
              <select
                value={categoryType}
                onChange={e => setCategoryType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                {['Standard', 'Deluxe', 'Executive', 'Suite', 'Presidential', 'Family Room', 'Studio'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Price per Night ($)</label>
              <input
                type="number"
                min={10}
                required
                value={pricePerNight}
                onChange={e => setPricePerNight(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Total Room Count</label>
              <input
                type="number"
                min={1}
                required
                value={totalRooms}
                onChange={e => setTotalRooms(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Max Guests</label>
              <input
                type="number"
                min={1}
                max={10}
                required
                value={maxGuests}
                onChange={e => setMaxGuests(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Bed Configuration</label>
              <input
                type="text"
                required
                value={bedType}
                onChange={e => setBedType(e.target.value)}
                placeholder="1 King Bed / 2 Queens"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Room Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe room amenities, view, bathroom features..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Room Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITY_LIST.map(amen => (
                <label
                  key={amen.id}
                  onClick={() => toggleAmenity(amen.id)}
                  className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center gap-2 transition select-none ${
                    amenities.includes(amen.id)
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(amen.id)}
                    onChange={() => {}}
                    className="w-3.5 h-3.5 text-indigo-600 rounded"
                  />
                  <span>{amen.name}</span>
                </label>
              ))}
            </div>
          </div>

          <ImageUploadHelper
            label="Room Photo"
            value={photoUrl}
            onChange={setPhotoUrl}
            aspectRatio="wide"
            presetCategory="room"
          />

          <div className="border-t border-slate-200 pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              Save Room Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
