import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hotel } from '../../types';
import { PhotoGalleryModal } from './PhotoGalleryModal';
import { HotelCompareModal } from './HotelCompareModal';
import { InteractiveMapModal } from './InteractiveMapModal';
import { 
  Search, 
  MapPin, 
  Star, 
  Bed, 
  SlidersHorizontal, 
  Building2, 
  Calendar, 
  Users, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Heart,
  Scale,
  Camera,
  Map,
  Compass,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

interface PublicHotelListProps {
  onSelectHotel: (hotel: Hotel) => void;
}

export const PublicHotelList: React.FC<PublicHotelListProps> = ({ onSelectHotel }) => {
  const { 
    activePublicHotels, 
    getRoomsByHotelId, 
    favoriteHotelIds, 
    toggleFavoriteHotel, 
    comparedHotelIds, 
    toggleCompareHotel,
    clearCompareHotels,
    resetToDemoData
  } = useApp();

  const [cityFilter, setCityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);

  // Modals state
  const [galleryHotel, setGalleryHotel] = useState<Hotel | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Active hover preview image indexes for each hotel card
  const [cardImageIndex, setCardImageIndex] = useState<Record<string, number>>({});

  const cities = ['All', ...Array.from(new Set(activePublicHotels.map(h => h.city)))];
  const categories = ['All', ...Array.from(new Set(activePublicHotels.map(h => h.category)))];

  const popularDestinations = [
    { name: 'All', icon: '✨', label: 'All Destinations' },
    { name: 'Hunza Valley', icon: '🏔️', label: 'Hunza Valley' },
    { name: 'Skardu', icon: '🛶', label: 'Skardu Lakes' },
    { name: 'Islamabad', icon: '🌲', label: 'Islamabad Margalla' },
    { name: 'Murree', icon: '☕', label: 'Murree & Galyat' },
    { name: 'Lahore', icon: '🕌', label: 'Old Lahore Heritage' },
    { name: 'Karachi', icon: '🌊', label: 'Karachi Beachfront' },
    { name: 'Swat', icon: '💎', label: 'Swat Emerald River' },
    { name: 'Gwadar', icon: '⛵', label: 'Gwadar Marina' },
  ];

  const filteredHotels = activePublicHotels.filter(h => {
    if (showOnlyWishlist && !favoriteHotelIds.includes(h.id)) return false;
    if (cityFilter !== 'All' && h.city !== cityFilter) return false;
    if (categoryFilter !== 'All' && h.category !== categoryFilter) return false;
    if (selectedTag !== 'All' && !(h.tags && h.tags.includes(selectedTag))) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        h.name.toLowerCase().includes(q) || 
        h.city.toLowerCase().includes(q) || 
        h.description.toLowerCase().includes(q) ||
        (h.tags && h.tags.some(t => t.toLowerCase().includes(q)));
      if (!match) return false;
    }
    const rooms = getRoomsByHotelId(h.id);
    const minRoomPrice = rooms.length > 0 ? Math.min(...rooms.map(r => r.pricePerNight)) : 100;
    if (minRoomPrice > maxPrice) return false;
    return true;
  });

  const nextCardPhoto = (e: React.MouseEvent, hotel: Hotel) => {
    e.stopPropagation();
    const imgs = [hotel.coverImageUrl, ...(hotel.galleryImages || [])];
    const curr = cardImageIndex[hotel.id] || 0;
    setCardImageIndex(prev => ({ ...prev, [hotel.id]: (curr + 1) % imgs.length }));
  };

  const prevCardPhoto = (e: React.MouseEvent, hotel: Hotel) => {
    e.stopPropagation();
    const imgs = [hotel.coverImageUrl, ...(hotel.galleryImages || [])];
    const curr = cardImageIndex[hotel.id] || 0;
    setCardImageIndex(prev => ({ ...prev, [hotel.id]: (curr - 1 + imgs.length) % imgs.length }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Visual Showcase */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
        <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&auto=format&fit=crop&q=80"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        <div className="relative z-20 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Administrative-Verified Properties
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Complimentary Turnovers & Clean Stays
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Discover Exceptional Luxury Sanctuaries & Boutique Stays
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Browse through curated 5-star mountain lodges, lakefront pagoda villas, seaside suites, and Mughal havelis. Every property is rigorously inspected and verified.
          </p>

          {/* Action Hub Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowMapModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-300" /> Open Interactive Destination Map
            </button>

            {comparedHotelIds.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/30 transition cursor-pointer"
              >
                <Scale className="w-4 h-4" /> Compare Selected Hotels ({comparedHotelIds.length})
              </button>
            )}

            <button
              onClick={() => setShowOnlyWishlist(prev => !prev)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${
                showOnlyWishlist 
                  ? 'bg-rose-600 text-white border-rose-500' 
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${showOnlyWishlist ? 'fill-white' : 'text-rose-400'}`} />
              {showOnlyWishlist ? 'Showing Wishlist' : `Saved Wishlist (${favoriteHotelIds.length})`}
            </button>
          </div>
        </div>

        {/* Floating Search Controls */}
        <div className="relative z-20 mt-8 p-3 sm:p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl text-slate-900 border border-white/20 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by hotel name, city, scenic tag (e.g. Hunza, Stargazing, Sea View)..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none bg-slate-50 font-medium"
            />
          </div>

          <div>
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none bg-slate-50 font-semibold text-slate-800"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c === 'All' ? '🌍 All Destination Cities' : `📍 ${c}`}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none bg-slate-50 font-semibold text-slate-800"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? '🏨 All Hotel Types' : cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Destination Quick Filters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Explore by Popular Destinations
          </span>
          <button
            onClick={() => {
              setCityFilter('All');
              setCategoryFilter('All');
              setSelectedTag('All');
              setSearchQuery('');
              setShowOnlyWishlist(false);
            }}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
          >
            Clear Filters
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {popularDestinations.map(dest => {
            const isSelected = cityFilter === dest.name;
            return (
              <button
                key={dest.name}
                onClick={() => setCityFilter(dest.name)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{dest.icon}</span>
                <span>{dest.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header & Rate Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-100/70 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            Verified Hotel Properties ({filteredHotels.length})
            {showOnlyWishlist && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                Wishlist Filter Active
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500">
            Strict Section 5 Enforcement: Displays only administrative-verified & approved hotels.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-bold">Max Nightly Rate:</span>
            <input
              type="range"
              min={80}
              max={500}
              step={20}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-28 accent-indigo-600 cursor-pointer"
            />
            <span className="font-black text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-xs">
              ${maxPrice}/night
            </span>
          </div>

          <button
            onClick={() => setShowMapModal(true)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Interactive Map View"
          >
            <Map className="w-4 h-4 text-indigo-600" /> Map
          </button>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map(hotel => {
          const hotelRooms = getRoomsByHotelId(hotel.id);
          const minPrice = hotelRooms.length > 0
            ? Math.min(...hotelRooms.map(r => r.pricePerNight))
            : 110;

          const allImages = Array.from(new Set([
            hotel.coverImageUrl,
            ...(hotel.galleryImages || [])
          ])).filter(Boolean);

          const activeImgIdx = cardImageIndex[hotel.id] || 0;
          const displayImage = allImages[activeImgIdx] || hotel.coverImageUrl;
          const isFavorite = favoriteHotelIds.includes(hotel.id);
          const isCompared = comparedHotelIds.includes(hotel.id);

          return (
            <div
              key={hotel.id}
              onClick={() => onSelectHotel(hotel)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                
                {/* Photo Carousel Stage */}
                <div className="relative h-64 bg-slate-900 overflow-hidden">
                  <img
                    src={displayImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Top Badges & Actions */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-950/80 backdrop-blur-md text-white border border-white/20 shadow-md">
                        {hotel.category}
                      </span>
                      {hotel.featured && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-slate-950" /> Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      {/* Compare Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompareHotel(hotel.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md transition cursor-pointer ${
                          isCompared 
                            ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400 shadow-lg' 
                            : 'bg-black/50 hover:bg-black/80 text-white'
                        }`}
                        title={isCompared ? 'Remove from compare' : 'Add to compare'}
                      >
                        <Scale className="w-4 h-4" />
                      </button>

                      {/* Wishlist Heart */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteHotel(hotel.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md transition cursor-pointer ${
                          isFavorite 
                            ? 'bg-rose-600 text-white ring-2 ring-rose-500 shadow-lg' 
                            : 'bg-black/50 hover:bg-black/80 text-white'
                        }`}
                        title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Photo Navigation Arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => prevCardPhoto(e, hotel)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
                        title="Previous Photo"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => nextCardPhoto(e, hotel)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
                        title="Next Photo"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Bottom Image Stats */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setGalleryHotel(hotel);
                      }}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-300" /> View {allImages.length} Photos
                    </button>

                    <span className="px-3 py-1 rounded-xl text-xs font-black bg-indigo-950/90 backdrop-blur-md text-white border border-indigo-400/30">
                      From ${minPrice} <span className="text-[10px] font-normal text-slate-300">/ night</span>
                    </span>
                  </div>

                  {/* Photo Pagination Dots */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1">
                      {allImages.slice(0, 5).map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            activeImgIdx === idx ? 'bg-amber-400 w-3' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                        {hotel.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        {hotel.city}, {hotel.country}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-black text-amber-900 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{hotel.averageRating > 0 ? hotel.averageRating.toFixed(1) : '5.0'}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({hotel.reviewCount})</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {hotel.description}
                  </p>

                  {/* Highlights Badges */}
                  {hotel.highlights && hotel.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {hotel.highlights.slice(0, 2).map((hl, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-semibold text-slate-700">
                          ✓ {hl}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        🛡️ {hotel.sanitationScore || 98}% Clean
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-indigo-600" /> {hotelRooms.length} Room Categories Available
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Instant Book
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:bg-indigo-50 group-hover:text-indigo-800 transition">
                <span>View Suites, Pricing & Reserve</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredHotels.length === 0 && (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Verified Hotels Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No properties matched your current filters. Try changing your search query or reset the filters.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCityFilter('All');
                setCategoryFilter('All');
                setSelectedTag('All');
                setSearchQuery('');
                setMaxPrice(500);
                setShowOnlyWishlist(false);
              }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-200 cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={resetToDemoData}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restore All Hotels
            </button>
          </div>
        </div>
      )}

      {/* Floating Compare Action Bar when hotels are compared */}
      {comparedHotelIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-950 text-white px-6 py-3.5 rounded-full shadow-2xl border border-white/20 flex items-center gap-4 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>{comparedHotelIds.length} properties in comparison</span>
          </div>

          <button
            onClick={() => setShowCompareModal(true)}
            className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-full transition shadow-md cursor-pointer"
          >
            Compare Now
          </button>

          <button
            onClick={clearCompareHotels}
            className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Photo Lightbox Gallery Modal */}
      {galleryHotel && (
        <PhotoGalleryModal
          hotel={galleryHotel}
          onClose={() => setGalleryHotel(null)}
        />
      )}

      {/* Hotel Compare Modal */}
      {showCompareModal && (
        <HotelCompareModal
          onClose={() => setShowCompareModal(false)}
          onSelectHotel={(h) => onSelectHotel(h)}
        />
      )}

      {/* Interactive Destination Map Modal */}
      {showMapModal && (
        <InteractiveMapModal
          onClose={() => setShowMapModal(false)}
          onSelectHotel={(h) => onSelectHotel(h)}
        />
      )}

    </div>
  );
};
