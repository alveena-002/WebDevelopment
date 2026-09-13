import React from 'react';
import { useApp } from '../../context/AppContext';
import { Hotel } from '../../types';
import { 
  X, 
  Check, 
  Minus, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  Trash2,
  ArrowRight,
  Wifi,
  Waves,
  Coffee,
  Car,
  Utensils,
  Plane
} from 'lucide-react';

interface HotelCompareModalProps {
  onClose: () => void;
  onSelectHotel: (hotel: Hotel) => void;
}

export const HotelCompareModal: React.FC<HotelCompareModalProps> = ({ onClose, onSelectHotel }) => {
  const { comparedHotelIds, toggleCompareHotel, clearCompareHotels, getHotelById, getRoomsByHotelId } = useApp();

  const hotels = comparedHotelIds
    .map(id => getHotelById(id))
    .filter((h): h is Hotel => Boolean(h));

  if (hotels.length === 0) {
    return null;
  }

  const comparisonAttributes = [
    { label: 'Category', render: (h: Hotel) => <span className="font-semibold text-slate-800">{h.category}</span> },
    { label: 'City / Location', render: (h: Hotel) => <span className="text-slate-700">{h.city}</span> },
    { 
      label: 'Nightly Rates (Starting)', 
      render: (h: Hotel) => {
        const rooms = getRoomsByHotelId(h.id);
        const minPrice = rooms.length > 0 ? Math.min(...rooms.map(r => r.pricePerNight)) : 120;
        return <span className="text-lg font-black text-indigo-700">${minPrice}<span className="text-xs font-normal text-slate-500">/night</span></span>;
      }
    },
    { 
      label: 'Guest Rating', 
      render: (h: Hotel) => (
        <div className="flex items-center gap-1.5 font-bold text-amber-600">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{h.averageRating > 0 ? h.averageRating.toFixed(1) : 'New'}</span>
          <span className="text-xs text-slate-400 font-normal">({h.reviewCount} reviews)</span>
        </div>
      )
    },
    { 
      label: 'Sanitation Score', 
      render: (h: Hotel) => (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {h.sanitationScore || 98}% Certified Clean
        </div>
      )
    },
    { 
      label: 'Airport Distance', 
      render: (h: Hotel) => <span className="text-xs text-slate-600">{h.distanceToAirport || 'Approx. 25-35 mins'}</span> 
    },
    { 
      label: 'Free Breakfast', 
      render: (h: Hotel) => <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Included</span> 
    },
    { 
      label: 'Swimming Pool / Spa', 
      render: (h: Hotel) => {
        const hasPool = h.highlights?.some(hl => hl.toLowerCase().includes('pool')) || h.category === 'Resort & Spa' || h.category === '5-Star Luxury';
        return hasPool ? (
          <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Available</span>
        ) : (
          <span className="text-slate-400 flex items-center gap-1"><Minus className="w-4 h-4" /> Not Available</span>
        );
      }
    },
    { 
      label: 'Free Cancellation', 
      render: () => <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Up to 48 hrs</span> 
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Side-by-Side Comparison
            </div>
            <h2 className="text-xl font-black text-slate-900">Comparing {hotels.length} Properties</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCompareHotels}
              className="text-xs text-slate-500 hover:text-rose-600 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="p-6 overflow-y-auto overflow-x-auto">
          <div className="min-w-[650px]">
            {/* Top Row: Hotel Images & Cards */}
            <div className="grid grid-cols-4 gap-4 pb-6 border-b border-slate-200">
              <div className="font-bold text-sm text-slate-400 flex items-end pb-4">
                Property Overview
              </div>
              {hotels.map(h => (
                <div key={h.id} className="relative group bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center space-y-2">
                  <button
                    onClick={() => toggleCompareHotel(h.id)}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition cursor-pointer"
                    title="Remove from compare"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="h-28 rounded-xl overflow-hidden shadow-sm">
                    <img src={h.coverImageUrl} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{h.name}</h3>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectHotel(h);
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-md shadow-indigo-200 cursor-pointer"
                  >
                    View Details <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {/* If fewer than 3 hotels, show empty placeholder */}
              {Array.from({ length: 3 - hotels.length }).map((_, i) => (
                <div key={i} className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 text-xs text-center">
                  <Building2 className="w-6 h-6 mb-2 text-slate-300" />
                  <span>Select another hotel on search to compare</span>
                </div>
              ))}
            </div>

            {/* Attributes Matrix */}
            <div className="divide-y divide-slate-100">
              {comparisonAttributes.map((attr, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4 py-3.5 items-center text-xs">
                  <div className="font-semibold text-slate-500">{attr.label}</div>
                  {hotels.map(h => (
                    <div key={h.id} className="text-center font-medium">
                      {attr.render(h)}
                    </div>
                  ))}
                  {Array.from({ length: 3 - hotels.length }).map((_, i) => (
                    <div key={i} className="text-center text-slate-300">—</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
