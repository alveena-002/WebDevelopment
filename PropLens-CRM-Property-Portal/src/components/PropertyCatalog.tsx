import React, { useState } from 'react';
import { Property, PropertyType, EpcRating } from '../types';
import {
  Bed,
  Bath,
  Maximize2,
  Share2,
  Eye,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  Layers,
  ShieldCheck,
  Building,
  DollarSign
} from 'lucide-react';

interface PropertyCatalogProps {
  properties: Property[];
  onSelectProperty: (property: Property, initialTab?: string) => void;
  onQuickSyndicate: (propertyId: string) => void;
  onRunAIMatch: (propertyId: string) => void;
  onOpenVirtualTour: (property: Property) => void;
}

export const PropertyCatalog: React.FC<PropertyCatalogProps> = ({
  properties,
  onSelectProperty,
  onQuickSyndicate,
  onRunAIMatch,
  onOpenVirtualTour
}) => {
  const [filterType, setFilterType] = useState<PropertyType | 'all'>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterMinBeds, setFilterMinBeds] = useState<number>(0);
  const [filterEpc, setFilterEpc] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Cities list
  const cities = Array.from(new Set(properties.map(p => p.city)));

  const filteredProperties = properties.filter(p => {
    if (filterType !== 'all' && p.type !== filterType) return false;
    if (filterCity !== 'all' && p.city !== filterCity) return false;
    if (p.bedrooms < filterMinBeds) return false;
    if (filterEpc !== 'all' && p.epcRating !== filterEpc) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Property Inventory</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {filteredProperties.length} Properties
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                viewMode === 'table'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Table View
            </button>
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* Sale/Rent Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              Listing Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Types (Sale & Rent)</option>
              <option value="sale">For Sale</option>
              <option value="rent">To Let (Rent)</option>
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              Location / City
            </label>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All UK Regions</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Bedrooms Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              Min Bedrooms
            </label>
            <select
              value={filterMinBeds}
              onChange={(e) => setFilterMinBeds(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value={0}>Any Bedrooms</option>
              <option value={2}>2+ Bedrooms</option>
              <option value={3}>3+ Bedrooms</option>
              <option value={4}>4+ Bedrooms</option>
              <option value={5}>5+ Bedrooms</option>
            </select>
          </div>

          {/* EPC Rating Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              Min EPC Rating
            </label>
            <select
              value={filterEpc}
              onChange={(e) => setFilterEpc(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Any EPC Grade</option>
              <option value="A">EPC Grade A</option>
              <option value="B">EPC Grade B</option>
              <option value="C">EPC Grade C</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end col-span-2 sm:col-span-1">
            <button
              onClick={() => {
                setFilterType('all');
                setFilterCity('all');
                setFilterMinBeds(0);
                setFilterEpc('all');
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className="group bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
            >
              {/* Image Header with Badges */}
              <div className="relative h-56 overflow-hidden bg-slate-950">
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                {/* Status & Type Pills */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                    prop.type === 'sale'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-emerald-500 text-slate-950 shadow-md'
                  }`}>
                    {prop.type === 'sale' ? 'For Sale' : 'To Let'}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white rounded-lg text-xs font-semibold">
                    {prop.status}
                  </span>
                </div>

                {/* EPC Rating & Tenure Pill */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-emerald-500/90 text-white text-[11px] font-extrabold rounded-md shadow">
                    EPC {prop.epcRating}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-slate-300 text-[11px] font-medium rounded-md border border-slate-700">
                    {prop.tenure}
                  </span>
                </div>

                {/* Price Display */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-black text-white drop-shadow-md">
                      £{prop.price.toLocaleString('en-GB')}
                      {prop.type === 'rent' && <span className="text-sm font-normal text-slate-300"> / month</span>}
                    </p>
                    <p className="text-xs text-amber-400 font-semibold drop-shadow">
                      {prop.address}, {prop.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body Details */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {prop.description}
                  </p>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-4 gap-2 py-2 border-y border-slate-800 text-slate-300 text-xs">
                  <div className="flex items-center gap-1">
                    <Bed className="h-3.5 w-3.5 text-amber-400" />
                    <span>{prop.bedrooms} Bed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-3.5 w-3.5 text-amber-400" />
                    <span>{prop.bathrooms} Bath</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
                    <span>{prop.areaSqFt} sq ft</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Band {prop.councilTaxBand}</span>
                  </div>
                </div>

                {/* Syndication Status Badge Bar */}
                <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400 font-medium">Syndication Feeds:</div>
                  <div className="flex items-center gap-1.5">
                    <span
                      title="Rightmove Status"
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        prop.portals.rightmove === 'synced'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      RM
                    </span>
                    <span
                      title="Zoopla Status"
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        prop.portals.zoopla === 'synced'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      ZP
                    </span>
                    <span
                      title="OnTheMarket Status"
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        prop.portals.onthemarket === 'synced'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      OTM
                    </span>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => onQuickSyndicate(prop.id)}
                    className="flex items-center justify-center gap-1 px-2.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    title="Syndicate to Rightmove, Zoopla & OTM"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Syndicate</span>
                  </button>

                  <button
                    onClick={() => onRunAIMatch(prop.id)}
                    className="flex items-center justify-center gap-1 px-2.5 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    title="Run AI Buyer Matcher"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI Match</span>
                  </button>

                  <button
                    onClick={() => onOpenVirtualTour(prop)}
                    className="flex items-center justify-center gap-1 px-2.5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    title="Launch 360 Virtual Tour"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>360 Tour</span>
                  </button>
                </div>

                <button
                  onClick={() => onSelectProperty(prop)}
                  className="w-full mt-2 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Manage Property Details</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Property Title & Address</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Specs</th>
                  <th className="px-4 py-3.5">EPC / Tax</th>
                  <th className="px-4 py-3.5">Portals</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProperties.map(prop => (
                  <tr key={prop.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images[0]}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="h-10 w-12 rounded-lg object-cover bg-slate-950"
                        />
                        <div>
                          <p className="font-bold text-white hover:text-amber-400 cursor-pointer" onClick={() => onSelectProperty(prop)}>
                            {prop.title}
                          </p>
                          <p className="text-[11px] text-slate-400">{prop.address}, {prop.city} ({prop.postcode})</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-amber-400">
                      £{prop.price.toLocaleString('en-GB')}
                      {prop.type === 'rent' && <span className="text-[10px] font-normal text-slate-400">/mo</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        prop.type === 'sale' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {prop.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {prop.bedrooms} bed • {prop.bathrooms} bath • {prop.areaSqFt} sq ft
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold mr-1">
                        EPC {prop.epcRating}
                      </span>
                      <span className="text-slate-400 text-[10px]">Band {prop.councilTaxBand}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${prop.portals.rightmove === 'synced' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                          RM
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${prop.portals.zoopla === 'synced' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                          ZP
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${prop.portals.onthemarket === 'synced' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                          OTM
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onQuickSyndicate(prop.id)}
                          className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg cursor-pointer"
                          title="Syndicate"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onRunAIMatch(prop.id)}
                          className="p-1.5 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg cursor-pointer"
                          title="AI Match"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenVirtualTour(prop)}
                          className="p-1.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 rounded-lg cursor-pointer"
                          title="Virtual Tour"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
