import React, { useState } from 'react';
import { Hotel, HotelCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Sliders, 
  Award,
  X
} from 'lucide-react';

interface AdminSanitationRatingModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: HotelCategory[] = [
  '5-Star Luxury',
  '4-Star Hotel',
  '3-Star Hotel',
  '2-Star Hotel',
  '1-Star Hotel',
  'Resort & Spa',
  'Boutique Hotel',
  'Heritage Villa',
  'Guest House',
  'Serviced Apartment'
];

export const AdminSanitationRatingModal: React.FC<AdminSanitationRatingModalProps> = ({
  hotel,
  isOpen,
  onClose
}) => {
  const { adminUpdateHotelSanitationAndScore } = useApp();

  const [sanitationScore, setSanitationScore] = useState<number>(hotel?.sanitationScore || 98);
  const [selectedCategory, setSelectedCategory] = useState<HotelCategory>(hotel?.category || '5-Star Luxury');
  const [isFeatured, setIsFeatured] = useState<boolean>(hotel?.featured ?? true);

  if (!isOpen || !hotel) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateHotelSanitationAndScore(hotel.id, sanitationScore, selectedCategory, isFeatured);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sanitation Score & Quality Tier Audit</h3>
              <p className="text-xs text-slate-400 truncate max-w-xs">{hotel.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Sanitation Score Range Slider */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Sanitation Score
              </label>
              <span className="text-xl font-black text-emerald-700 font-mono">
                {sanitationScore}%
              </span>
            </div>
            <input
              type="range"
              min={75}
              max={100}
              step={1}
              value={sanitationScore}
              onChange={e => setSanitationScore(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-emerald-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-emerald-800 font-semibold pt-1">
              <span>75% (Standard Baseline)</span>
              <span>90% (High Quality)</span>
              <span>100% (Sterile Gold Standard)</span>
            </div>
          </div>

          {/* Tier Category Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Verified Star / Property Tier Classification
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as HotelCategory)}
              className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none bg-slate-50"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Featured Toggle */}
          <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100/70 transition">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" /> Feature on Public Discovery Showcase
              </span>
              <p className="text-[11px] text-slate-500">
                Showcase this hotel with a premium gold verified badge on the guest homepage.
              </p>
            </div>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={e => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-slate-900 rounded accent-slate-900"
            />
          </label>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Apply Administrative Audit
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
