import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Hotel, RoomCategory, Booking, BookingStatus } from '../../types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Move, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  User, 
  Phone, 
  Mail, 
  Bed, 
  DollarSign, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Layers, 
  CalendarDays,
  Sparkles, 
  ShieldCheck, 
  X, 
  Printer, 
  MessageSquare, 
  Send, 
  ExternalLink,
  Info,
  SlidersHorizontal,
  Lock,
  Unlock,
  Check,
  Building2,
  TrendingUp,
  Award,
  ArrowRight
} from 'lucide-react';

interface OwnerVisualBookingCalendarProps {
  hotel: Hotel;
}

export const OwnerVisualBookingCalendar: React.FC<OwnerVisualBookingCalendarProps> = ({ hotel }) => {
  const { 
    bookings, 
    rooms, 
    updateBookingStatus, 
    updateBookingDetails, 
    toggleRoomBlockedDate, 
    showToast 
  } = useApp();

  // Calendar timeline view mode
  const [viewMode, setViewMode] = useState<'timeline' | 'month' | 'week'>('timeline');

  // Month navigation: default to August 2026
  const [viewYear, setViewYear] = useState<number>(2026);
  const [viewMonth, setViewMonth] = useState<number>(7); // 0-indexed: 7 = August

  // Filters & Search
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Booking for Click-to-View Modal Inspector
  const [inspectedBooking, setInspectedBooking] = useState<Booking | null>(null);

  // Drag & Drop State
  const [draggedBooking, setDraggedBooking] = useState<Booking | null>(null);
  const [dropTargetDate, setDropTargetDate] = useState<string | null>(null);
  const [dropTargetRoomId, setDropTargetRoomId] = useState<string | null>(null);
  const [pendingDropModal, setPendingDropModal] = useState<{
    booking: Booking;
    newStartDate: string;
    newEndDate: string;
    newRoomId: string;
    newRoomName: string;
    newPricePerNight: number;
    newTotalNights: number;
    newTotalAmount: number;
  } | null>(null);

  // Internal owner notes for inspected booking
  const [ownerNoteInput, setOwnerNoteInput] = useState<string>('');

  // Get hotel specific rooms & bookings
  const hotelRooms = useMemo(() => {
    return rooms.filter(r => r.hotelId === hotel.id);
  }, [rooms, hotel.id]);

  const hotelBookings = useMemo(() => {
    return bookings.filter(b => b.hotelId === hotel.id);
  }, [bookings, hotel.id]);

  // Filtered rooms for timeline
  const displayRooms = useMemo(() => {
    if (selectedRoomFilter === 'all') return hotelRooms;
    return hotelRooms.filter(r => r.id === selectedRoomFilter);
  }, [hotelRooms, selectedRoomFilter]);

  // Days in selected month
  const daysInMonth = useMemo(() => {
    return new Date(viewYear, viewMonth + 1, 0).getDate();
  }, [viewYear, viewMonth]);

  const monthName = useMemo(() => {
    return new Date(viewYear, viewMonth, 1).toLocaleString('default', { month: 'long' });
  }, [viewYear, viewMonth]);

  // First day of month offset (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeekOffset = useMemo(() => {
    return new Date(viewYear, viewMonth, 1).getDay();
  }, [viewYear, viewMonth]);

  // Generate list of date strings for current month (e.g. '2026-08-01')
  const monthDateList = useMemo(() => {
    const list: string[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      list.push(dStr);
    }
    return list;
  }, [viewYear, viewMonth, daysInMonth]);

  // Filtered bookings based on search and status
  const filteredBookings = useMemo(() => {
    return hotelBookings.filter(b => {
      // Status filter
      if (selectedStatusFilter !== 'all' && b.status !== selectedStatusFilter) return false;
      // Room filter
      if (selectedRoomFilter !== 'all' && b.roomId !== selectedRoomFilter) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchGuest = b.guestName.toLowerCase().includes(q);
        const matchNumber = b.bookingNumber.toLowerCase().includes(q);
        const matchRoom = b.roomName.toLowerCase().includes(q);
        if (!matchGuest && !matchNumber && !matchRoom) return false;
      }
      return true;
    });
  }, [hotelBookings, selectedStatusFilter, selectedRoomFilter, searchQuery]);

  // KPI Calculations
  const stats = useMemo(() => {
    // Bookings that overlap current month
    const monthStart = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-01`;
    const monthEnd = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

    const activeMonthBookings = hotelBookings.filter(b => {
      return (
        (b.status === 'Confirmed' || b.status === 'Checked-In' || b.status === 'Completed' || b.status === 'Pending') &&
        b.checkInDate <= monthEnd &&
        b.checkOutDate >= monthStart
      );
    });

    const totalRevenue = activeMonthBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const confirmedCount = activeMonthBookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked-In').length;
    const pendingCount = activeMonthBookings.filter(b => b.status === 'Pending').length;

    // Approximate occupancy
    const totalRoomNightsPossible = (hotelRooms.length || 1) * daysInMonth;
    const totalBookedNights = activeMonthBookings.reduce((sum, b) => sum + (b.totalNights || 1), 0);
    const occupancyRate = Math.min(100, Math.round((totalBookedNights / Math.max(1, totalRoomNightsPossible)) * 100));

    return {
      totalBookings: activeMonthBookings.length,
      confirmedCount,
      pendingCount,
      totalRevenue,
      occupancyRate
    };
  }, [hotelBookings, hotelRooms, viewYear, viewMonth, daysInMonth]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleGoToToday = () => {
    setViewYear(2026);
    setViewMonth(7); // August 2026
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, booking: Booking) => {
    e.dataTransfer.setData('text/plain', booking.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedBooking(booking);
  };

  const handleDragOver = (e: React.DragEvent, dateStr: string, roomId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTargetDate !== dateStr || dropTargetRoomId !== roomId) {
      setDropTargetDate(dateStr);
      setDropTargetRoomId(roomId);
    }
  };

  const handleDragLeave = () => {
    // optional reset
  };

  const handleDrop = (e: React.DragEvent, newStartDate: string, targetRoomId: string) => {
    e.preventDefault();
    if (!draggedBooking) return;

    // Calculate new end date based on original duration (nights)
    const startDateObj = new Date(newStartDate);
    const nights = draggedBooking.totalNights || 1;
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(startDateObj.getDate() + nights);
    
    const newEndDate = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth() + 1).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}`;

    // Target room info
    const targetRoom = hotelRooms.find(r => r.id === targetRoomId) || hotelRooms[0];
    const newPricePerNight = targetRoom?.pricePerNight || draggedBooking.pricePerNight;
    const newTotalAmount = nights * newPricePerNight;

    // Trigger confirmation modal
    setPendingDropModal({
      booking: draggedBooking,
      newStartDate,
      newEndDate,
      newRoomId: targetRoom.id,
      newRoomName: targetRoom.name,
      newPricePerNight,
      newTotalNights: nights,
      newTotalAmount
    });

    setDraggedBooking(null);
    setDropTargetDate(null);
    setDropTargetRoomId(null);
  };

  const confirmReschedule = () => {
    if (!pendingDropModal) return;

    updateBookingDetails(pendingDropModal.booking.id, {
      checkInDate: pendingDropModal.newStartDate,
      checkOutDate: pendingDropModal.newEndDate,
      roomId: pendingDropModal.newRoomId,
      roomName: pendingDropModal.newRoomName,
      pricePerNight: pendingDropModal.newPricePerNight,
      totalNights: pendingDropModal.newTotalNights,
      totalAmount: pendingDropModal.newTotalAmount
    });

    showToast(
      `Rescheduled ${pendingDropModal.booking.guestName} to ${pendingDropModal.newStartDate} → ${pendingDropModal.newEndDate} in ${pendingDropModal.newRoomName}!`,
      'success'
    );

    setPendingDropModal(null);
  };

  const cancelReschedule = () => {
    setPendingDropModal(null);
  };

  // Shift dates helper from modal
  const handleShiftBookingDates = (booking: Booking, daysShift: number) => {
    const curStart = new Date(booking.checkInDate);
    const curEnd = new Date(booking.checkOutDate);

    curStart.setDate(curStart.getDate() + daysShift);
    curEnd.setDate(curEnd.getDate() + daysShift);

    const newStart = `${curStart.getFullYear()}-${String(curStart.getMonth() + 1).padStart(2, '0')}-${String(curStart.getDate()).padStart(2, '0')}`;
    const newEnd = `${curEnd.getFullYear()}-${String(curEnd.getMonth() + 1).padStart(2, '0')}-${String(curEnd.getDate()).padStart(2, '0')}`;

    updateBookingDetails(booking.id, {
      checkInDate: newStart,
      checkOutDate: newEnd
    });

    if (inspectedBooking && inspectedBooking.id === booking.id) {
      setInspectedBooking({
        ...inspectedBooking,
        checkInDate: newStart,
        checkOutDate: newEnd
      });
    }

    showToast(`Stay dates shifted by ${daysShift > 0 ? `+${daysShift}` : daysShift} days (${newStart} → ${newEnd})`, 'info');
  };

  // Status color badges
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-500 text-white border-emerald-600';
      case 'Checked-In':
        return 'bg-blue-600 text-white border-blue-700';
      case 'Pending':
        return 'bg-amber-500 text-white border-amber-600';
      case 'Completed':
        return 'bg-purple-600 text-white border-purple-700';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-rose-500 text-white border-rose-600';
      default:
        return 'bg-slate-700 text-white border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Real-time KPI Ribbon */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&auto=format&fit=crop&q=80"
            alt="Calendar operations"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900/85 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Interactive Visual Booking Calendar</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Drag and drop reservations across stay dates or room categories • Click any booking to inspect & manage
                </p>
              </div>
            </div>
          </div>

          {/* Quick Real-Time Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Reservations</span>
              <span className="text-lg font-black text-white">{stats.totalBookings}</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5 font-medium">{stats.confirmedCount} Active</span>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Revenue</span>
              <span className="text-lg font-black text-emerald-400">${stats.totalRevenue.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{monthName}</span>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Occupancy Rate</span>
              <span className="text-lg font-black text-indigo-400">{stats.occupancyRate}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Room Capacity</span>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Action</span>
              <span className="text-lg font-black text-amber-400">{stats.pendingCount}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Requires review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calendar Card & Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Navigation, View Switcher & Filter Toolbar */}
        <div className="p-5 border-b border-slate-200 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-slate-50/70">
          
          {/* Month / Year Navigator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-xs">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-3 py-1 text-center min-w-[130px]">
                <span className="text-xs font-black text-slate-900 block leading-tight">
                  {monthName} {viewYear}
                </span>
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                  {daysInMonth} Days
                </span>
              </div>

              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleGoToToday}
              className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Current (Aug 2026)</span>
            </button>
          </div>

          {/* View Mode Toggle: Timeline, Month Grid, Week */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Room Timeline (Drag & Drop)</span>
              </button>

              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'month'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Month Grid</span>
              </button>

              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'week'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Week Agenda</span>
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap w-full xl:w-auto">
            {/* Room Filter */}
            <select
              value={selectedRoomFilter}
              onChange={e => setSelectedRoomFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Room Categories ({hotelRooms.length})</option>
              {hotelRooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} (${r.pricePerNight}/nt)
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked-In">Checked-In</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search guest or code..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none w-44"
              />
            </div>
          </div>
        </div>

        {/* Legend / Status Helper */}
        <div className="px-6 py-2.5 bg-slate-100/60 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3 text-[11px] text-slate-600">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-slate-700">Booking Statuses:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Checked-In</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Pending Action</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span>Blocked Date</span>
            </div>
          </div>

          <div className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5" />
            <span>Drag any reservation to reschedule stay dates</span>
          </div>
        </div>

        {/* VIEW 1: TIMELINE GANTT / ROOM LANES (Optimized for Visual Drag & Drop) */}
        {viewMode === 'timeline' && (
          <div className="overflow-x-auto p-4">
            <div className="min-w-[1050px]">
              
              {/* Day Header Row */}
              <div className="grid grid-cols-[220px_repeat(31,_minmax(34px,_1fr))] gap-1 pb-2 border-b border-slate-200 text-center font-bold text-slate-600">
                <div className="text-left pl-3 text-xs uppercase text-slate-400 font-bold flex items-center">
                  Room Category / Rate
                </div>

                {monthDateList.map(dateStr => {
                  const dayNum = parseInt(dateStr.split('-')[2], 10);
                  const dateObj = new Date(viewYear, viewMonth, dayNum);
                  const dayOfWeek = dateObj.toLocaleDateString('default', { weekday: 'narrow' });
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                  return (
                    <div 
                      key={dateStr}
                      className={`py-1 rounded-lg text-center ${
                        isWeekend ? 'bg-slate-100/90 text-indigo-900' : 'text-slate-700'
                      }`}
                    >
                      <span className="text-[9px] uppercase block text-slate-400">{dayOfWeek}</span>
                      <span className="text-xs font-black block">{dayNum}</span>
                    </div>
                  );
                })}
              </div>

              {/* Room Rows with Draggable Bookings */}
              <div className="space-y-4 pt-4">
                {displayRooms.map(room => {
                  // Bookings for this room
                  const roomBookings = filteredBookings.filter(b => b.roomId === room.id);

                  return (
                    <div key={room.id} className="border border-slate-200 rounded-2xl bg-white p-2 shadow-xs">
                      
                      {/* Room Header Info */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 px-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                            <Bed className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900">{room.name}</span>
                            <span className="text-[10px] text-slate-500 ml-2 font-medium">
                              ${room.pricePerNight}/night • {room.totalRooms} Units • Max {room.maxGuests} Guests
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-400 font-mono">
                          {roomBookings.length} bookings scheduled
                        </span>
                      </div>

                      {/* Day Lane Grid for this room */}
                      <div className="relative grid grid-cols-[220px_repeat(31,_minmax(34px,_1fr))] gap-1 items-center min-h-[58px]">
                        
                        {/* Left Room Label / Quick Block Toggle */}
                        <div className="flex flex-col justify-center pr-2">
                          <span className="text-[11px] font-bold text-slate-800 truncate">{room.categoryType}</span>
                          <span className="text-[10px] text-slate-500">{room.bedType}</span>
                        </div>

                        {/* 31 Day Drop Targets & Blockable Slots */}
                        {monthDateList.map(dateStr => {
                          const dayNum = parseInt(dateStr.split('-')[2], 10);
                          const isBlocked = (room.blockedDates || []).includes(dateStr);
                          const isDropHovered = dropTargetDate === dateStr && dropTargetRoomId === room.id;

                          return (
                            <div
                              key={`${room.id}-${dateStr}`}
                              onDragOver={(e) => handleDragOver(e, dateStr, room.id)}
                              onDrop={(e) => handleDrop(e, dateStr, room.id)}
                              onClick={() => toggleRoomBlockedDate(room.id, dateStr)}
                              title={isBlocked ? `Blocked on ${dateStr} (Click to unblock)` : `Available (Click to block, or drag reservation here)`}
                              className={`h-14 rounded-xl border transition flex flex-col justify-between p-1 cursor-pointer ${
                                isDropHovered
                                  ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-400'
                                  : isBlocked
                                  ? 'bg-rose-50/90 border-rose-200 text-rose-800'
                                  : 'bg-slate-50/70 border-slate-200 hover:border-indigo-300 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[9px] text-slate-400">
                                <span>{dayNum}</span>
                                {isBlocked && <Lock className="w-2.5 h-2.5 text-rose-600" />}
                              </div>
                              {isBlocked && (
                                <span className="text-[7px] font-bold uppercase bg-rose-200 text-rose-900 rounded px-0.5 text-center truncate">
                                  Hold
                                </span>
                              )}
                            </div>
                          );
                        })}

                        {/* Render Floating Booking Bars over the day grid */}
                        {roomBookings.map(b => {
                          // Calculate column span within current month
                          const checkIn = new Date(b.checkInDate);
                          const checkOut = new Date(b.checkOutDate);

                          const checkInMonth = checkIn.getMonth();
                          const checkInYear = checkIn.getFullYear();

                          // Start day index (1-based)
                          let startDay = checkIn.getDate();
                          if (checkInYear < viewYear || (checkInYear === viewYear && checkInMonth < viewMonth)) {
                            startDay = 1;
                          }

                          let endDay = checkOut.getDate();
                          if (checkOut.getFullYear() > viewYear || (checkOut.getFullYear() === viewYear && checkOut.getMonth() > viewMonth)) {
                            endDay = daysInMonth;
                          }

                          // If outside current view month entirely, skip rendering in this month timeline
                          if (
                            (checkInYear === viewYear && checkInMonth > viewMonth) ||
                            (checkOut.getFullYear() === viewYear && checkOut.getMonth() < viewMonth)
                          ) {
                            return null;
                          }

                          const colSpan = Math.max(1, endDay - startDay + 1);
                          const colStart = startDay + 1; // +1 because col 1 is room title

                          return (
                            <div
                              key={b.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, b)}
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectedBooking(b);
                              }}
                              style={{
                                gridColumn: `${colStart} / span ${colSpan}`,
                                zIndex: 10
                              }}
                              className={`absolute inset-y-1 my-auto h-11 rounded-xl p-1.5 shadow-md border cursor-grab active:cursor-grabbing transition-transform hover:scale-[1.01] flex items-center justify-between gap-1 overflow-hidden ${getStatusBadge(b.status)}`}
                              title={`Click to view details or drag to reschedule\n${b.guestName} (${b.checkInDate} → ${b.checkOutDate})\nNights: ${b.totalNights} • Total: $${b.totalAmount}`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                                <div className="p-1 rounded-md bg-black/20 shrink-0">
                                  <Move className="w-3 h-3 text-white/90" />
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-[11px] font-black leading-tight truncate text-white">
                                    {b.guestName}
                                  </p>
                                  <p className="text-[9px] text-white/80 font-mono truncate">
                                    {b.bookingNumber} • {b.totalNights}n (${b.totalAmount})
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 flex items-center gap-1 bg-black/20 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
                                <span>{b.status}</span>
                              </div>
                            </div>
                          );
                        })}

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: MONTH GRID (Traditional Calendar View with Day Cards) */}
        {viewMode === 'month' && (
          <div className="p-6">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2 text-center pb-2 mb-2 border-b border-slate-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-xs font-bold uppercase text-slate-400 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid cells */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty leading offset cells */}
              {Array.from({ length: firstDayOfWeekOffset }).map((_, i) => (
                <div key={`empty-lead-${i}`} className="min-h-[110px] bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 opacity-40" />
              ))}

              {/* Days of Month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                
                // Bookings that overlap this date
                const dayBookings = filteredBookings.filter(b => 
                  dateStr >= b.checkInDate && dateStr <= b.checkOutDate
                );

                // Any rooms blocked on this date
                const blockedRooms = hotelRooms.filter(r => (r.blockedDates || []).includes(dateStr));

                return (
                  <div
                    key={dateStr}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDropTargetDate(dateStr);
                    }}
                    onDrop={(e) => handleDrop(e, dateStr, hotelRooms[0]?.id || '')}
                    className={`min-h-[110px] p-2 rounded-2xl border transition flex flex-col justify-between ${
                      dropTargetDate === dateStr
                        ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400'
                        : dayBookings.length > 0
                        ? 'bg-white border-slate-200 hover:border-slate-400 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-black text-slate-800">{dayNum}</span>
                      <div className="flex items-center gap-1">
                        {blockedRooms.length > 0 && (
                          <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">
                            {blockedRooms.length} Blk
                          </span>
                        )}
                        {dayBookings.length > 0 && (
                          <span className="text-[9px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-bold">
                            {dayBookings.length} Res
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stored bookings chips */}
                    <div className="space-y-1 my-1 overflow-y-auto max-h-[80px]">
                      {dayBookings.map(b => (
                        <div
                          key={b.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, b)}
                          onClick={() => setInspectedBooking(b)}
                          className={`p-1 rounded-lg text-[10px] font-bold truncate cursor-pointer transition hover:opacity-90 flex items-center justify-between ${getStatusBadge(b.status)}`}
                          title={`${b.guestName} (${b.roomName})`}
                        >
                          <span className="truncate">{b.guestName}</span>
                          <span className="text-[8px] opacity-80 shrink-0 ml-1 font-mono">${b.pricePerNight}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[9px] text-slate-400 text-right">
                      {dateStr === '2026-08-18' && <span className="text-indigo-600 font-bold">Today</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: WEEK AGENDA & CHECK-IN RUN SHEET */}
        {viewMode === 'week' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Upcoming Week Arrivals, Departures & In-House Stays
              </h3>
              <span className="text-xs text-slate-500 font-medium">August 17 — August 24, 2026</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBookings.map(b => (
                <div
                  key={b.id}
                  onClick={() => setInspectedBooking(b)}
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition cursor-pointer space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {b.bookingNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'Checked-In' ? 'bg-blue-100 text-blue-800' :
                        b.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{b.guestName}</h4>
                    <p className="text-xs text-slate-500 truncate">{b.roomName}</p>

                    <div className="mt-2.5 p-2 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Check-in:</span>
                        <span className="font-bold">{b.checkInDate} (2:00 PM)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Check-out:</span>
                        <span className="font-bold">{b.checkOutDate} (12:00 PM)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duration:</span>
                        <span className="font-medium">{b.totalNights} Nights • {b.numberOfGuests} Guests</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">${b.totalAmount} Total</span>
                    <span className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                      Inspect Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: DRAG & DROP RESCHEDULE CONFIRMATION POPUP */}
      {pendingDropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                  <Move className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">Confirm Stay Reschedule</h3>
                  <p className="text-xs text-slate-400">Drag & Drop update for reservation</p>
                </div>
              </div>
              <button
                onClick={cancelReschedule}
                className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Guest:</span>
                  <span className="font-bold text-slate-900">{pendingDropModal.booking.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Booking Reference:</span>
                  <span className="font-mono font-bold text-indigo-700">{pendingDropModal.booking.bookingNumber}</span>
                </div>
              </div>

              {/* Before vs After Comparison */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-rose-800 block">Previous Dates</span>
                  <p className="font-bold text-slate-900">{pendingDropModal.booking.checkInDate}</p>
                  <p className="text-[11px] text-slate-500">→ {pendingDropModal.booking.checkOutDate}</p>
                  <p className="text-[10px] text-slate-600 mt-1 font-mono">${pendingDropModal.booking.totalAmount}</p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block">New Scheduled Dates</span>
                  <p className="font-bold text-emerald-950">{pendingDropModal.newStartDate}</p>
                  <p className="text-[11px] text-emerald-800">→ {pendingDropModal.newEndDate}</p>
                  <p className="text-[10px] text-emerald-700 mt-1 font-mono font-bold">${pendingDropModal.newTotalAmount}</p>
                </div>
              </div>

              {pendingDropModal.booking.roomId !== pendingDropModal.newRoomId && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-900 flex items-center gap-2">
                  <Bed className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Reassigned to room: <strong>{pendingDropModal.newRoomName}</strong></span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={cancelReschedule}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmReschedule}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save New Dates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CLICK-TO-INSPECT RESERVATION DETAILS (Full Slide-over/Modal) */}
      {inspectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            {/* Header */}
            <div className="p-6 bg-slate-950 text-white flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-800 text-slate-200 px-2 py-0.5 rounded">
                      {inspectedBooking.bookingNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      inspectedBooking.status === 'Confirmed' ? 'bg-emerald-500 text-white' :
                      inspectedBooking.status === 'Checked-In' ? 'bg-blue-600 text-white' :
                      inspectedBooking.status === 'Pending' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-white'
                    }`}>
                      {inspectedBooking.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-black mt-1">{inspectedBooking.guestName}</h3>
                  <p className="text-xs text-slate-400">{inspectedBooking.roomName}</p>
                </div>
              </div>

              <button
                onClick={() => setInspectedBooking(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/80 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Guest & Contact Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Guest Traveler</span>
                  <p className="font-bold text-slate-900 text-sm">{inspectedBooking.guestName}</p>
                  <p className="text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {inspectedBooking.guestEmail}
                  </p>
                  <p className="text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {inspectedBooking.guestPhone}
                  </p>
                </div>

                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Stay Duration</span>
                  <p className="font-bold text-slate-900">{inspectedBooking.checkInDate} → {inspectedBooking.checkOutDate}</p>
                  <p className="text-indigo-600 font-bold">{inspectedBooking.totalNights} Nights • {inspectedBooking.numberOfGuests} Guests</p>
                  <p className="text-[11px] text-slate-500 font-mono">Booked on {new Date(inspectedBooking.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Special Requests */}
              {inspectedBooking.specialRequests && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
                  <span className="font-bold uppercase text-[10px] text-amber-800 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Guest Special Instructions
                  </span>
                  <p className="italic leading-relaxed">"{inspectedBooking.specialRequests}"</p>
                </div>
              )}

              {/* Financial Breakdown */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Financial Summary & Payout</span>
                <div className="flex justify-between text-slate-300">
                  <span>Base Rate (${inspectedBooking.pricePerNight} × {inspectedBooking.totalNights} nights):</span>
                  <span className="font-mono">${inspectedBooking.totalAmount}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Platform Processing & Guarantee Fee:</span>
                  <span className="font-mono text-emerald-400">$0.00 (Zero Commission Model)</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold">
                  <span>Total Guest Charge / Owner Net:</span>
                  <span className="font-black text-emerald-400 font-mono">${inspectedBooking.totalAmount}</span>
                </div>
              </div>

              {/* Quick Date Shifter Toolbar */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Quick Stay Adjustments & Date Shifting
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleShiftBookingDates(inspectedBooking, -1)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    ← Move 1 Day Earlier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShiftBookingDates(inspectedBooking, 1)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    Move 1 Day Later →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newNights = prompt(`Enter new number of nights (Currently: ${inspectedBooking.totalNights}):`, inspectedBooking.totalNights.toString());
                      if (newNights && !isNaN(Number(newNights)) && Number(newNights) > 0) {
                        const n = Number(newNights);
                        const curStart = new Date(inspectedBooking.checkInDate);
                        const curEnd = new Date(curStart);
                        curEnd.setDate(curStart.getDate() + n);
                        const newEnd = `${curEnd.getFullYear()}-${String(curEnd.getMonth() + 1).padStart(2, '0')}-${String(curEnd.getDate()).padStart(2, '0')}`;
                        
                        updateBookingDetails(inspectedBooking.id, {
                          totalNights: n,
                          checkOutDate: newEnd,
                          totalAmount: n * inspectedBooking.pricePerNight
                        });
                        setInspectedBooking({
                          ...inspectedBooking,
                          totalNights: n,
                          checkOutDate: newEnd,
                          totalAmount: n * inspectedBooking.pricePerNight
                        });
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Extend / Shorten Stay
                  </button>
                </div>
              </div>

              {/* Status Updater Actions */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Update Booking Operational Status
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      updateBookingStatus(inspectedBooking.id, 'Confirmed');
                      setInspectedBooking({ ...inspectedBooking, status: 'Confirmed' });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      inspectedBooking.status === 'Confirmed'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-100 hover:bg-emerald-50 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                  </button>

                  <button
                    onClick={() => {
                      updateBookingStatus(inspectedBooking.id, 'Checked-In');
                      setInspectedBooking({ ...inspectedBooking, status: 'Checked-In' });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      inspectedBooking.status === 'Checked-In'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 hover:bg-blue-50 text-slate-700'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Checked-In
                  </button>

                  <button
                    onClick={() => {
                      updateBookingStatus(inspectedBooking.id, 'Completed');
                      setInspectedBooking({ ...inspectedBooking, status: 'Completed' });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      inspectedBooking.status === 'Completed'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-100 hover:bg-purple-50 text-slate-700'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" /> Completed
                  </button>

                  <button
                    onClick={() => {
                      updateBookingStatus(inspectedBooking.id, 'Cancelled');
                      setInspectedBooking({ ...inspectedBooking, status: 'Cancelled' });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      inspectedBooking.status === 'Cancelled'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-100 hover:bg-rose-50 text-slate-700'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancelled
                  </button>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between flex-wrap gap-2">
                <a
                  href={`tel:${inspectedBooking.guestPhone}`}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call Guest
                </a>

                <button
                  onClick={() => {
                    showToast(`Printed voucher for booking ${inspectedBooking.bookingNumber}`, 'success');
                    window.print();
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Reservation Voucher
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
