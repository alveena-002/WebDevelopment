import React, { useState, useEffect } from 'react';
import { Hotel } from '../../types';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Sparkles, 
  Building2, 
  Utensils, 
  Waves, 
  Mountain,
  Grid
} from 'lucide-react';

interface PhotoGalleryModalProps {
  hotel: Hotel;
  initialIndex?: number;
  onClose: () => void;
}

export const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({ hotel, initialIndex = 0, onClose }) => {
  const allImages = Array.from(new Set([
    hotel.coverImageUrl,
    ...(hotel.galleryImages || [])
  ])).filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [activeTab, setActiveTab] = useState<'all' | 'rooms' | 'dining' | 'wellness' | 'scenic'>('all');

  // Handle keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex(prev => (prev + 1) % allImages.length);
      if (e.key === 'ArrowLeft') setCurrentIndex(prev => (prev - 1 + allImages.length) % allImages.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allImages.length, onClose]);

  const nextPhoto = () => setCurrentIndex(prev => (prev + 1) % allImages.length);
  const prevPhoto = () => setCurrentIndex(prev => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between text-white p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* Top Bar Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20">
            <img src={hotel.logoUrl} alt={hotel.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{hotel.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                {hotel.category}
              </span>
            </div>
            <p className="text-xs text-slate-400">{hotel.city}, {hotel.country} • Photo {currentIndex + 1} of {allImages.length}</p>
          </div>
        </div>

        {/* Categories / Close */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 bg-white/10 p-1 rounded-xl text-xs font-medium border border-white/10">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'all' ? 'bg-white text-slate-900 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              All Photos ({allImages.length})
            </button>
            <button 
              onClick={() => setActiveTab('rooms')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${activeTab === 'rooms' ? 'bg-white text-slate-900 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              <Building2 className="w-3 h-3" /> Suites & Architecture
            </button>
            <button 
              onClick={() => setActiveTab('scenic')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${activeTab === 'scenic' ? 'bg-white text-slate-900 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              <Mountain className="w-3 h-3" /> Scenic Vistas
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/20 cursor-pointer"
            title="Close Gallery (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        <button
          onClick={prevPhoto}
          className="absolute left-2 sm:left-6 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition transform active:scale-95 cursor-pointer"
          title="Previous (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="max-w-5xl max-h-[70vh] w-full h-full flex items-center justify-center p-2">
          <img
            src={allImages[currentIndex]}
            alt={`${hotel.name} Showcase ${currentIndex + 1}`}
            className="max-h-[68vh] max-w-full object-contain rounded-2xl shadow-2xl transition duration-300 select-none"
            referrerPolicy="no-referrer"
          />
        </div>

        <button
          onClick={nextPhoto}
          className="absolute right-2 sm:right-6 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition transform active:scale-95 cursor-pointer"
          title="Next (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 justify-start sm:justify-center">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                currentIndex === idx 
                  ? 'ring-3 ring-amber-400 scale-105 opacity-100' 
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {currentIndex === idx && (
                <div className="absolute inset-0 bg-amber-500/10 border-2 border-amber-400 rounded-xl" />
              )}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
