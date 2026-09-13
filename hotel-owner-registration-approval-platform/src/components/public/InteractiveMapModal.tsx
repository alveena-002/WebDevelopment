import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hotel } from '../../types';
import { 
  X, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Building2, 
  Navigation, 
  ArrowRight,
  Sparkles,
  Compass
} from 'lucide-react';

interface InteractiveMapModalProps {
  onClose: () => void;
  onSelectHotel: (hotel: Hotel) => void;
}

export const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({ onClose, onSelectHotel }) => {
  const { activePublicHotels, getRoomsByHotelId } = useApp();
  const [selectedPinHotel, setSelectedPinHotel] = useState<Hotel>(activePublicHotels[0]);

  // Destination coordinates relative positioning for visual interactive map
  const destinationMapCoords: Record<string, { top: string; left: string; tag: string }> = {
    'Hunza Valley': { top: '15%', left: '68%', tag: 'Northern Alpine' },
    'Skardu': { top: '22%', left: '78%', tag: 'Karakoram Glaciers' },
    'Swat': { top: '28%', left: '50%', tag: 'Emerald Valley' },
    'Murree': { top: '38%', left: '62%', tag: 'Pine Galyat Ridge' },
    'Islamabad': { top: '44%', left: '58%', tag: 'Capital Margalla' },
    'Lahore': { top: '56%', left: '72%', tag: 'Mughal Heritage' },
    'Karachi': { top: '85%', left: '32%', tag: 'Arabian Sea Coast' },
    'Gwadar': { top: '88%', left: '16%', tag: 'Hammerhead Bay' },
  };

  const getMinPrice = (h: Hotel) => {
    const rooms = getRoomsByHotelId(h.id);
    return rooms.length > 0 ? Math.min(...rooms.map(r => r.pricePerNight)) : 130;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">Interactive Destination & Property Map</h2>
              <p className="text-xs text-slate-400">Explore verified luxury sanctuaries across mountains, valleys, and coastlines</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Stage + Sidebar */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden relative">
          
          {/* Visual Interactive Map Canvas */}
          <div className="lg:col-span-2 relative bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/40 p-6 overflow-hidden flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Ambient topo grid pattern */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]" />
            
            {/* Map Canvas Frame */}
            <div className="relative w-full h-full max-w-xl max-h-[520px] rounded-3xl border border-indigo-500/20 bg-slate-900/60 p-4 shadow-inner flex items-center justify-center">
              
              {/* Region Label Accents */}
              <div className="absolute top-4 left-6 text-[11px] font-mono text-indigo-400 tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3 h-3 rotate-45 text-amber-400" /> PAKISTAN TOURISM & LUXURY CORRIDOR
              </div>

              {/* Pins on the Map */}
              {activePublicHotels.map(hotel => {
                const pos = destinationMapCoords[hotel.city] || { top: '50%', left: '50%', tag: 'Scenic' };
                const isSelected = selectedPinHotel?.id === hotel.id;

                return (
                  <div
                    key={hotel.id}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                    onClick={() => setSelectedPinHotel(hotel)}
                  >
                    {/* Animated Ping Ring */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-amber-400/40 animate-ping" />
                    )}

                    {/* Marker Badge */}
                    <div className={`relative px-2.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl transition-all duration-300 transform ${
                      isSelected 
                        ? 'bg-amber-400 text-slate-950 scale-110 ring-4 ring-amber-400/30 font-black' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold group-hover:scale-105'
                    }`}>
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'fill-slate-950 text-slate-950' : 'text-amber-300'}`} />
                      <span className="text-[11px] whitespace-nowrap">${getMinPrice(hotel)}</span>
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block whitespace-nowrap z-30 pointer-events-none">
                      <div className="bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-700 shadow-xl">
                        {hotel.name} ({hotel.city})
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="text-center text-slate-600 text-xs font-mono select-none pointer-events-none">
                Interactive Scenic Grid • Click any pin to inspect stay details
              </div>
            </div>
          </div>

          {/* Right Selected Hotel Drawer */}
          <div className="p-6 bg-slate-900/95 overflow-y-auto flex flex-col justify-between space-y-4">
            {selectedPinHotel ? (
              <div className="space-y-4 animate-in fade-in duration-150">
                
                {/* Image */}
                <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
                  <img
                    src={selectedPinHotel.coverImageUrl}
                    alt={selectedPinHotel.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-400/30">
                    {selectedPinHotel.category}
                  </div>
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/20">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {selectedPinHotel.averageRating.toFixed(1)}
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-lg font-black text-white leading-tight">{selectedPinHotel.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {selectedPinHotel.address}, {selectedPinHotel.city}
                  </p>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {selectedPinHotel.description}
                </p>

                {/* Highlights */}
                {selectedPinHotel.highlights && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Top Highlights</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPinHotel.highlights.slice(0, 3).map((hl, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-200 border border-slate-700">
                          ✓ {hl}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sanitation Guarantee */}
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Sanitation Score: <strong>{selectedPinHotel.sanitationScore || 98}% Verified Clean</strong></span>
                </div>

                {/* Action CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectHotel(selectedPinHotel);
                    }}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-900/50 cursor-pointer"
                  >
                    Inspect Rooms & Book From ${getMinPrice(selectedPinHotel)}/night <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 text-xs py-12">
                Select a pin on the map to preview hotel details.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
