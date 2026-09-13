import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hotel, RoomCategory, Review, Booking } from '../../types';
import { AMENITY_LIST } from '../../data/seedData';
import { PhotoGalleryModal } from './PhotoGalleryModal';
import { BookingVoucherModal } from './BookingVoucherModal';
import { 
  MapPin, 
  Star, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Bed, 
  Users, 
  Calendar, 
  CreditCard, 
  Clock, 
  Sparkles, 
  Send, 
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Info,
  Heart,
  Scale,
  Camera,
  Plane,
  Building,
  Tag,
  Gift,
  QrCode,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PublicHotelDetailProps {
  hotel: Hotel;
  onBack: () => void;
}

export const PublicHotelDetail: React.FC<PublicHotelDetailProps> = ({ hotel, onBack }) => {
  const { 
    currentUser, 
    getRoomsByHotelId, 
    getReviewsByHotelId, 
    createBooking, 
    addReview,
    favoriteHotelIds,
    toggleFavoriteHotel,
    comparedHotelIds,
    toggleCompareHotel,
    showToast 
  } = useApp();

  const rooms = getRoomsByHotelId(hotel.id);
  const reviews = getReviewsByHotelId(hotel.id);

  const allPhotos = Array.from(new Set([
    hotel.coverImageUrl,
    ...(hotel.galleryImages || [])
  ])).filter(Boolean);

  const [selectedRoom, setSelectedRoom] = useState<RoomCategory | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const [guestName, setGuestName] = useState(currentUser.name || 'Guest Traveler');
  const [guestEmail, setGuestEmail] = useState(currentUser.email || 'traveler@example.com');
  const [guestPhone, setGuestPhone] = useState(currentUser.phone || '+92 300 1234567');
  const [checkInDate, setCheckInDate] = useState('2026-08-24');
  const [checkOutDate, setCheckOutDate] = useState('2026-08-27');
  const [numGuests, setNumGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);
  const [appliedPromoName, setAppliedPromoName] = useState('');

  // Write Review State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewCleanliness, setReviewCleanliness] = useState(5);
  const [reviewService, setReviewService] = useState(5);
  const [reviewLocation, setReviewLocation] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Calculate nights & total
  const nights = Math.max(1, Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 3600 * 24)) || 1);
  const baseCost = selectedRoom ? selectedRoom.pricePerNight * nights : 0;
  const discountAmount = Math.round((baseCost * appliedDiscountPercent) / 100);
  const totalCost = Math.max(0, baseCost - discountAmount);

  const isFavorite = favoriteHotelIds.includes(hotel.id);
  const isCompared = comparedHotelIds.includes(hotel.id);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'SUMMER2026' || code === 'LUXURY2026') {
      setAppliedDiscountPercent(15);
      setAppliedPromoName('15% Summer Luxury Special');
      showToast('🎉 Promo code SUMMER2026 applied: 15% Off!', 'success');
    } else if (code === 'CLEANSTAY' || code === 'PAKISTAN') {
      setAppliedDiscountPercent(10);
      setAppliedPromoName('10% Verified Clean Stay Reward');
      showToast('🎉 Promo code CLEANSTAY applied: 10% Off!', 'success');
    } else {
      showToast('Invalid promo code. Try SUMMER2026 or CLEANSTAY', 'error');
    }
  };

  const handleOpenBooking = (room: RoomCategory) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
    setConfirmedBooking(null);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    const newBooking = createBooking({
      hotelId: hotel.id,
      hotelName: hotel.name,
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      guestId: currentUser.id,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      totalNights: nights,
      numberOfGuests: numGuests,
      pricePerNight: selectedRoom.pricePerNight,
      totalAmount: totalCost,
      status: 'Confirmed',
      specialRequests: appliedPromoName ? `${specialRequests} [Promo: ${appliedPromoName}]` : specialRequests,
    });

    setConfirmedBooking(newBooking);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (_) {}
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview(hotel.id, {
      guestName: currentUser.name || 'Verified Traveler',
      guestAvatar: currentUser.avatar,
      rating: reviewRating,
      cleanlinessRating: reviewCleanliness,
      serviceRating: reviewService,
      locationRating: reviewLocation,
      comment: reviewComment.trim(),
    });

    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore Hotels
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => toggleCompareHotel(hotel.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              isCompared 
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Scale className="w-4 h-4" />
            {isCompared ? 'In Compare' : 'Compare'}
          </button>

          <button
            onClick={() => toggleFavoriteHotel(hotel.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              isFavorite 
                ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : 'text-slate-400'}`} />
            {isFavorite ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Hotel Title & Badges */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {hotel.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Platform Verified Stay
            </span>
            {hotel.sanitationScore && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> {hotel.sanitationScore}% Sanitation Score
              </span>
            )}
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2">{hotel.name}</h1>
          
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            {hotel.address}, {hotel.city}, {hotel.country}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-900 shadow-xs">
            <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
            <div>
              <span className="text-lg font-black">{hotel.averageRating > 0 ? hotel.averageRating.toFixed(1) : '5.0'}</span>
              <span className="text-[11px] text-slate-500 block font-semibold">{hotel.reviewCount} verified guest reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Photo Luxury Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Main Hero Photo */}
        <div 
          onClick={() => {
            setGalleryInitialIndex(0);
            setShowGallery(true);
          }}
          className="md:col-span-2 h-72 md:h-96 rounded-3xl overflow-hidden bg-slate-900 relative shadow-md group cursor-pointer"
        >
          <img
            src={allPhotos[0]}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
            <span className="text-xs text-white font-bold flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-300" /> Open Fullscreen Showcase
            </span>
          </div>
        </div>

        {/* 2nd Photo */}
        <div 
          onClick={() => {
            setGalleryInitialIndex(1);
            setShowGallery(true);
          }}
          className="h-44 md:h-96 rounded-3xl overflow-hidden bg-slate-900 relative shadow-md group cursor-pointer hidden md:block"
        >
          <img
            src={allPhotos[1] || allPhotos[0]}
            alt={`${hotel.name} View 2`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* 3rd & 4th Photo Stacked with View All Button */}
        <div className="grid grid-rows-2 gap-3 h-72 md:h-96">
          <div 
            onClick={() => {
              setGalleryInitialIndex(2);
              setShowGallery(true);
            }}
            className="rounded-2xl overflow-hidden bg-slate-900 relative shadow-sm group cursor-pointer"
          >
            <img
              src={allPhotos[2] || allPhotos[0]}
              alt={`${hotel.name} View 3`}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          <div 
            onClick={() => {
              setGalleryInitialIndex(3);
              setShowGallery(true);
            }}
            className="rounded-2xl overflow-hidden bg-slate-900 relative shadow-sm group cursor-pointer"
          >
            <img
              src={allPhotos[3] || allPhotos[0]}
              alt={`${hotel.name} View 4`}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              referrerPolicy="no-referrer"
            />
            {/* View All Overlay */}
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 text-center transition hover:bg-slate-950/80">
              <div className="space-y-1">
                <Camera className="w-5 h-5 text-amber-300 mx-auto" />
                <span className="text-xs font-black text-white block">View All {allPhotos.length}+ Photos</span>
                <span className="text-[10px] text-slate-300 block">Suites, Dining & Vistas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights & Quick Distances Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Airport Proximity</span>
            <p className="text-xs font-bold text-slate-900">{hotel.distanceToAirport || 'Approx. 25 mins'}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sanitation Standard</span>
            <p className="text-xs font-bold text-emerald-700">{hotel.sanitationScore || 98}% Certified Clean</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Promo Discounts</span>
            <p className="text-xs font-bold text-slate-900">Use code: SUMMER2026 (15% off)</p>
          </div>
        </div>
      </div>

      {/* Overview & Amenities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details, Highlights & Room Selector */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Hotel */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">About This Sanctuary</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {hotel.description}
            </p>

            {/* Property Highlights */}
            {hotel.highlights && hotel.highlights.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900 uppercase mb-2">Key Property Highlights</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {hotel.highlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Amenities & Facilities */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Property Amenities & Facilities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITY_LIST.slice(0, 12).map(amen => (
                <div key={amen.id} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amen.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Available Room Categories */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Select Room or Suite Category</h3>
              <p className="text-xs text-slate-500">Instant reservation with free cancellation and verified clean guarantees.</p>
            </div>

            <div className="space-y-4">
              {rooms.map(room => (
                <div
                  key={room.id}
                  className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-indigo-400 hover:shadow-lg transition duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-44 h-32 rounded-2xl overflow-hidden bg-slate-900 shrink-0 relative group">
                      <img
                        src={room.photos[0] || hotel.coverImageUrl}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                        {room.photos.length} Photos
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{room.name}</h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {room.categoryType}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{room.description}</p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 pt-1 font-medium">
                        <span>👥 Max {room.maxGuests} Guests</span>
                        <span>•</span>
                        <span>🛏️ {room.bedType}</span>
                        {room.sizeSqFt && <span>• 📐 {room.sizeSqFt} sq.ft</span>}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Free High-Speed Wi-Fi & Breakfast Included
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 w-full sm:w-auto justify-between border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 block font-medium">Nightly Rate</span>
                      <p className="text-2xl font-black text-slate-900">${room.pricePerNight}<span className="text-xs font-normal text-slate-500">/nt</span></p>
                    </div>

                    <button
                      onClick={() => handleOpenBooking(room)}
                      className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" /> Book Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Location, Maps, Guarantee */}
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Property Location & GPS</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{hotel.address}, {hotel.city}, {hotel.country}</p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 font-sans font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-rose-600" /> Coordinates
              </div>
              <p className="text-slate-600">Latitude: {hotel.googleMapsLocation.lat}</p>
              <p className="text-slate-600">Longitude: {hotel.googleMapsLocation.lng}</p>
              <a
                href={`https://www.google.com/maps?q=${hotel.googleMapsLocation.lat},${hotel.googleMapsLocation.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-sans font-bold text-indigo-600 hover:underline pt-2 text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View on Google Maps
              </a>
            </div>

            <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-950">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>Complimentary private terminal shuttle available upon booking confirmation.</span>
            </div>
          </div>

          {/* Cleanliness Guarantee Box */}
          <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-xl space-y-3 border border-indigo-500/30">
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h4 className="text-xs font-black uppercase tracking-wider">Antimicrobial Clean Guarantee</h4>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Every suite in this property is sterilized before check-in with medical-grade hospital steamers and deep sanitation checklists.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs font-mono text-emerald-400 border-t border-white/10">
              <span>Sanitation Seal:</span>
              <strong>PASSED (Score: {hotel.sanitationScore || 98}%)</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Verified Customer Reviews Section */}
      <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Verified Guest Reviews ({reviews.length})</h3>
            <p className="text-xs text-slate-500">Real feedback from guests who completed reservations at this hotel.</p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Write a Review
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handlePostReview} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase">Share Your Stay Feedback</h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Overall Rating (1-5)</label>
                <select
                  value={reviewRating}
                  onChange={e => setReviewRating(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border rounded-xl bg-white font-medium"
                >
                  {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>{n} Stars</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Cleanliness</label>
                <select
                  value={reviewCleanliness}
                  onChange={e => setReviewCleanliness(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border rounded-xl bg-white font-medium"
                >
                  {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>{n} / 5</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Service & Staff</label>
                <select
                  value={reviewService}
                  onChange={e => setReviewService(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border rounded-xl bg-white font-medium"
                >
                  {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>{n} / 5</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Location & Scenic Views</label>
                <select
                  value={reviewLocation}
                  onChange={e => setReviewLocation(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border rounded-xl bg-white font-medium"
                >
                  {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>{n} / 5</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Review Comments</label>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="What did you love about your stay? Mention room comfort, views, food, staff hospitality..."
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-3 py-2 text-xs text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
              >
                Post Verified Review
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map(rev => (
            <div key={rev.id} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-700">
                    {rev.guestAvatar ? <img src={rev.guestAvatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : rev.guestName[0]}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{rev.guestName}</h5>
                    <span className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{rev.rating} / 5.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                "{rev.comment}"
              </p>

              {rev.ownerReply && (
                <div className="p-3.5 bg-white rounded-xl border border-indigo-100 text-xs text-indigo-950 space-y-1">
                  <span className="font-bold text-[10px] uppercase text-indigo-700 block">
                    Response from Management ({hotel.name}):
                  </span>
                  <p className="text-slate-600">{rev.ownerReply.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Booking & Checkout Confirmation */}
      {showBookingModal && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black">Confirm Reservation</h3>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            {confirmedBooking ? (
              <div className="p-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-slate-900">Reservation Confirmed!</h4>
                  <p className="text-xs text-slate-500">
                    Confirmation Number: <strong className="font-mono text-indigo-600 font-bold">{confirmedBooking.bookingNumber}</strong>
                  </p>
                </div>
                
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your stay at <strong>{hotel.name}</strong> is verified. You can view your digital pass and QR voucher now.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => setShowVoucherModal(true)}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-indigo-200 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" /> View Boarding Pass Voucher
                  </button>
                  <button
                    onClick={() => {
                      setShowBookingModal(false);
                      setConfirmedBooking(null);
                    }}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-slate-900 block font-bold">{selectedRoom.name}</strong>
                    <span className="text-slate-500">${selectedRoom.pricePerNight} / night • {selectedRoom.bedType}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                    {selectedRoom.categoryType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Check-In Date</label>
                    <input
                      type="date"
                      required
                      value={checkInDate}
                      onChange={e => setCheckInDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Check-Out Date</label>
                    <input
                      type="date"
                      required
                      value={checkOutDate}
                      onChange={e => setCheckOutDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Guest Name</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={e => setGuestPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email for Pass</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={e => setGuestEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 bg-white"
                  />
                </div>

                {/* Promo Code Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Promo Voucher Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try SUMMER2026 or CLEANSTAY"
                      value={promoCodeInput}
                      onChange={e => setPromoCodeInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 uppercase font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromoName && (
                    <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                      ✓ {appliedPromoName} Applied!
                    </span>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>${selectedRoom.pricePerNight} × {nights} Nights:</span>
                    <span className="font-semibold">${baseCost}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount ({appliedDiscountPercent}%):</span>
                      <span>-${discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Deep Turnover Cleaning & Sanitation:</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="border-t border-indigo-200 pt-2 flex justify-between font-black text-slate-900 text-sm">
                    <span>Total Amount Payable:</span>
                    <span className="text-indigo-700 text-base">${totalCost}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="px-4 py-2 text-xs text-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-md shadow-indigo-200 transition cursor-pointer"
                  >
                    Confirm & Reserve (${totalCost})
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Photo Gallery Modal */}
      {showGallery && (
        <PhotoGalleryModal
          hotel={hotel}
          initialIndex={galleryInitialIndex}
          onClose={() => setShowGallery(false)}
        />
      )}

      {/* Booking Voucher Modal */}
      {showVoucherModal && confirmedBooking && (
        <BookingVoucherModal
          booking={confirmedBooking}
          hotel={hotel}
          onClose={() => setShowVoucherModal(false)}
        />
      )}

    </div>
  );
};
