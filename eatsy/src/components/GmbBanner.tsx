import React from 'react';
import { MapPin, Star, Clock, Utensils, Calendar, ShieldCheck, ArrowRight, Share2, Navigation, TrendingUp } from 'lucide-react';
import { Language } from '../types';
import { i18nDict } from '../lib/i18n';

interface GmbBannerProps {
  language: Language;
  onOrderNow: () => void;
  onBookTable: () => void;
  tableNumber: string;
}

export const GmbBanner: React.FC<GmbBannerProps> = ({
  language,
  onOrderNow,
  onBookTable,
  tableNumber,
}) => {
  const t = i18nDict[language];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top High-Street Strategy Header */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border-2 border-orange-100 shadow-sm mb-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold px-3.5 py-1 rounded-full">
              <Navigation className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              <span>Google Maps & GMB Live Integration</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.gmbBannerTitle}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              {t.gmbBannerDesc} By ordering through Eatsy, our local Islington pub & kitchen avoids 30% Deliveroo fees and gives you lower menu prices & instant loyalty perks!
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-700 pt-1">
              <div className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Real-Time Wait: <strong className="text-emerald-600 font-black">12 Mins</strong></span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                <span>Location Auto-Detected: <strong className="text-slate-900">High St, N1 8ED</strong></span>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-xl border border-emerald-200">
                <TrendingUp className="w-4 h-4" />
                <span>Saved 30% Third-Party App Fee</span>
              </div>
            </div>
          </div>

          {/* Quick Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto min-w-[220px]">
            <button
              onClick={onOrderNow}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-orange-200 transition-all cursor-pointer text-sm"
            >
              <Utensils className="w-4 h-4" />
              <span>{t.orderNow} ({tableNumber ? `${t.table} ${tableNumber}` : t.takeaway})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBookTable}
              className="flex items-center justify-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold px-6 py-3 rounded-2xl border border-orange-200 transition-all cursor-pointer text-sm"
            >
              <Calendar className="w-4 h-4 text-orange-600" />
              <span>{t.bookTable}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Google My Business Search Result Card Preview */}
      <div className="bg-white border-2 border-orange-100 rounded-[32px] p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-orange-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-lg">
              G
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Google Maps & Business Listing Preview</h2>
              <p className="text-xs text-slate-500 font-medium">Live sync with Google Search 'Order Now' & 'Book a Table' buttons</p>
            </div>
          </div>

          <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-full">
            Live Synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: GMB Listing Info */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">The Old Bull & Bush</h3>
                <p className="text-xs text-slate-500 font-medium">Pub & High-Street Gastropub • Islington</p>
              </div>
              <Share2 className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-700" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-orange-600 font-black text-sm">4.8</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-slate-500 font-medium">(412 Google Reviews)</span>
            </div>

            <div className="space-y-2 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>142 High Street, Islington, London N1 8ED</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Open Today: 08:00 – 23:00 (Food till 22:00)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex gap-2">
              <button
                onClick={onOrderNow}
                className="flex-1 bg-orange-500 text-white font-bold py-2 rounded-xl text-xs hover:bg-orange-600 transition-colors shadow-sm"
              >
                GMB Order Now
              </button>
              <button
                onClick={onBookTable}
                className="flex-1 bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs hover:bg-slate-300 transition-colors"
              >
                Book Table
              </button>
            </div>
          </div>

          {/* Card 2: Live Wait Times Sync */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Real-Time Kitchen Load & Wait Sync</span>
            </h3>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1 shadow-sm">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Current Table Order Wait Time</p>
              <p className="text-3xl font-black text-emerald-600 font-mono">12 – 15 Mins</p>
              <p className="text-[11px] text-slate-500 font-medium">Kitchen Activity: Moderate • 4 Tickets Active</p>
            </div>

            <div className="space-y-2 text-xs font-bold">
              <div className="flex justify-between text-slate-600">
                <span>Peak Rush Prediction (19:00 - 21:00)</span>
                <span className="text-orange-600 font-mono">22 Mins</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[45%]" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium italic">
              *Wait time updates live in Google Search results when users search 'food near me Islington'.
            </p>
          </div>

          {/* Card 3: Commission Savings Breakdown */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Why Eatsy Direct Ordering Wins</span>
            </h3>

            <div className="space-y-3 text-xs font-bold">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-red-50 border border-red-200">
                <span className="text-red-900">Deliveroo / JustEat Fee</span>
                <span className="text-red-700 font-black">30% Commission</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-900 font-bold">Eatsy Direct Ordering</span>
                <span className="text-emerald-700 font-black">0% Commission</span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl text-xs text-slate-700 space-y-1 border border-slate-200 shadow-sm">
              <p className="font-bold text-orange-600">Direct Customer Benefits:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] font-medium">
                <li>Free Artisan Drink upgrades for QR customers</li>
                <li>Instant Table delivery straight from kitchen</li>
                <li>10% loyalty cashback points every visit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
