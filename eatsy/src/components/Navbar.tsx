import React from 'react';
import { ShoppingBag, Utensils, MapPin, Calendar, Gift, BarChart3, Clock, Globe, ChevronDown, Radio } from 'lucide-react';
import { Language } from '../types';
import { i18nDict } from '../lib/i18n';

interface NavbarProps {
  activeTab: 'menu' | 'gmb' | 'book' | 'loyalty' | 'kds' | 'analytics';
  setActiveTab: (tab: 'menu' | 'gmb' | 'book' | 'loyalty' | 'kds' | 'analytics') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  tableNumber: string;
  setIsTableModalOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  setIsCartOpen: (open: boolean) => void;
  realtimeConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  tableNumber,
  setIsTableModalOpen,
  cartCount,
  cartSubtotal,
  setIsCartOpen,
  realtimeConnected,
}) => {
  const t = i18nDict[language];

  return (
    <header className="sticky top-0 z-40 bg-white text-slate-900 border-b-2 border-orange-100 shadow-sm">
      {/* Top Info Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-orange-100/80">
        <div className="flex items-center gap-4 text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-orange-700">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            <span>The Old Bull & Bush • High St, N1 8ED</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 font-medium">
            <Clock className="w-3 h-3 text-emerald-600" />
            <span>Live Kitchen Wait: <strong className="text-emerald-600 font-bold">12 Mins</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Realtime Status Indicator */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 text-[11px] text-slate-700 font-bold">
            <span className={`w-2 h-2 rounded-full ${realtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`} />
            <span className="hidden md:inline font-bold">{t.realtimeStockSync}</span>
          </div>

          {/* Table Selector Button */}
          <button
            onClick={() => setIsTableModalOpen(true)}
            className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 px-3.5 py-1 rounded-full transition-colors cursor-pointer font-bold"
          >
            <Utensils className="w-3.5 h-3.5 text-orange-600" />
            <span>{tableNumber ? `${t.table} ${tableNumber}` : t.takeaway}</span>
            <ChevronDown className="w-3 h-3 text-orange-500" />
          </button>

          {/* Language Picker Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-orange-500" />
              <span>{t.languageName}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-36 bg-white border-2 border-orange-100 rounded-2xl shadow-xl py-1.5 hidden group-hover:block z-50">
              {(['en', 'ur', 'pl', 'ar'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-full text-left px-3.5 py-2 text-xs hover:bg-orange-50 transition-colors flex items-center justify-between ${
                    language === lang ? 'text-orange-600 font-black bg-orange-50/80' : 'text-slate-700 font-medium'
                  }`}
                >
                  <span>{i18nDict[lang].languageName}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">{lang}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('menu')}
          className="flex items-center gap-3 group cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-black text-2xl rotate-3 shadow-md shadow-orange-200 group-hover:rotate-6 group-hover:scale-105 transition-transform">
            E
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-orange-600">Eatsy</span>
              <span className="text-[10px] font-black bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase tracking-widest border border-orange-200">
                UK
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider hidden sm:block">The Old Bull & Bush</p>
          </div>
        </button>

        {/* Tab Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1.5 rounded-full border border-slate-200">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                : 'text-slate-600 hover:text-orange-600 hover:bg-orange-100/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>QR Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('gmb')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'gmb'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                : 'text-slate-600 hover:text-orange-600 hover:bg-orange-100/60'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>GMB Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('book')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'book'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                : 'text-slate-600 hover:text-orange-600 hover:bg-orange-100/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t.bookTable}</span>
          </button>

          <button
            onClick={() => setActiveTab('loyalty')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'loyalty'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                : 'text-slate-600 hover:text-orange-600 hover:bg-orange-100/60'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Loyalty</span>
          </button>

          <button
            onClick={() => setActiveTab('kds')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'kds'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                : 'text-slate-600 hover:text-orange-600 hover:bg-orange-100/60'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-600" />
            <span>Kitchen KDS</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                : 'text-slate-600 hover:text-orange-600 hover:bg-orange-100/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </nav>

        {/* Floating Basket Drawer Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black px-5 py-2.5 rounded-full shadow-lg shadow-orange-200 transition-all cursor-pointer active:scale-95"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow border border-orange-200">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-sm hidden sm:inline">{t.cart}</span>
            <span className="bg-orange-600/60 px-2.5 py-0.5 rounded-full text-xs font-mono font-black">
              £{cartSubtotal.toFixed(2)}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around bg-slate-50 py-2 border-t border-orange-100 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer ${
            activeTab === 'menu' ? 'text-orange-600 font-black' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Menu</span>
        </button>

        <button
          onClick={() => setActiveTab('gmb')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer ${
            activeTab === 'gmb' ? 'text-orange-600 font-black' : 'text-slate-500'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Google</span>
        </button>

        <button
          onClick={() => setActiveTab('book')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer ${
            activeTab === 'book' ? 'text-orange-600 font-black' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Book</span>
        </button>

        <button
          onClick={() => setActiveTab('loyalty')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer ${
            activeTab === 'loyalty' ? 'text-orange-600 font-black' : 'text-slate-500'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Loyalty</span>
        </button>

        <button
          onClick={() => setActiveTab('kds')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer ${
            activeTab === 'kds' ? 'text-orange-600 font-black' : 'text-slate-500'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-600" />
          <span>KDS</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer ${
            activeTab === 'analytics' ? 'text-orange-600 font-black' : 'text-slate-500'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Stats</span>
        </button>
      </div>
    </header>
  );
};
