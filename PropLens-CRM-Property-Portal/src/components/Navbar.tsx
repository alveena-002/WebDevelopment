import React from 'react';
import {
  Building2,
  Sparkles,
  Share2,
  Eye,
  UserCheck,
  TrendingUp,
  Search,
  PlusCircle,
  MapPin,
  CheckCircle2,
  Layers,
  Globe
} from 'lucide-react';

export type ActiveTab =
  | 'properties'
  | 'syndication'
  | 'ai-matcher'
  | 'virtual-tours'
  | 'landlord-portal'
  | 'offer-tracker'
  | 'gmb-seo';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddProperty: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  syndicatedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddProperty,
  searchQuery,
  setSearchQuery,
  syndicatedCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Building2 className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                PropLens
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-md">
                UK Estate CRM
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="h-3 w-3 text-slate-500" />
              <span>Knightsbridge & Central London Branch</span>
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md mx-auto hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search properties, postcodes, buyers, or landlords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Syndication Status Pill */}
          <div
            onClick={() => setActiveTab('syndication')}
            className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700/80 rounded-lg text-xs hover:border-emerald-500/50 transition-all"
            title="Active Syndication Feeds"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">Syndication Live</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded text-[11px] font-semibold">
              Rightmove / Zoopla / OTM
            </span>
          </div>

          <button
            onClick={onOpenAddProperty}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-950/60 border-t border-slate-800/80 backdrop-blur-md overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-1">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'properties'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Property Listings</span>
          </button>

          <button
            onClick={() => setActiveTab('syndication')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'syndication'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>Auto-Syndication</span>
            <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">
              3 Portals
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ai-matcher')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'ai-matcher'
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>AI Buyer Matcher</span>
          </button>

          <button
            onClick={() => setActiveTab('virtual-tours')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'virtual-tours'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Eye className="h-4 w-4 text-cyan-400" />
            <span>360° Virtual Tours</span>
          </button>

          <button
            onClick={() => setActiveTab('landlord-portal')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'landlord-portal'
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="h-4 w-4 text-blue-400" />
            <span>Landlord Portal</span>
          </button>

          <button
            onClick={() => setActiveTab('offer-tracker')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'offer-tracker'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="h-4 w-4 text-rose-400" />
            <span>Offer Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('gmb-seo')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'gmb-seo'
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Globe className="h-4 w-4 text-indigo-400" />
            <span>Google & GMB Strategy</span>
          </button>
        </div>
      </div>
    </header>
  );
};
