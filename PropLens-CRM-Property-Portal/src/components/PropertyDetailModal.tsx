import React, { useState, useEffect } from 'react';
import { Property, BuyerMatchResult } from '../types';
import {
  X,
  Share2,
  Sparkles,
  Eye,
  Bed,
  Bath,
  Maximize2,
  ShieldCheck,
  MapPin,
  Building,
  CheckCircle2,
  TrendingUp,
  FileText
} from 'lucide-react';
import { VirtualTourViewer } from './VirtualTourViewer';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSyndicate: (propertyId: string) => void;
  onRunAIMatch: (propertyId: string) => void;
  onSubmitOfferClick: (property: Property) => void;
  initialTab?: string;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  onSyndicate,
  onRunAIMatch,
  onSubmitOfferClick,
  initialTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [amenities, setAmenities] = useState<{
    schools: { name: string; rating: number | null; vicinity: string | null }[];
    stations: { name: string; rating: number | null; vicinity: string | null }[];
    supermarkets: { name: string; rating: number | null; vicinity: string | null }[];
  } | null>(null);
  const [amenitiesLive, setAmenitiesLive] = useState<boolean | null>(null);
  const [amenitiesReason, setAmenitiesReason] = useState<string>('');
  const [loadingAmenities, setLoadingAmenities] = useState(false);

  useEffect(() => {
    if (!isOpen || !property) return;
    setLoadingAmenities(true);
    const params = new URLSearchParams({
      address: property.address,
      postcode: property.postcode,
      city: property.city
    });
    fetch(`/api/places/nearby-amenities?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setAmenitiesLive(data.live);
        setAmenitiesReason(data.reason || '');
        setAmenities(data.amenities);
      })
      .catch(() => {
        setAmenitiesLive(false);
        setAmenitiesReason('Could not reach the Places API.');
      })
      .finally(() => setLoadingAmenities(false));
  }, [isOpen, property?.id]);

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
              property.type === 'sale' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
            }`}>
              {property.type === 'sale' ? 'For Sale' : 'To Let'}
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">{property.title}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-amber-400" />
                <span>{property.address}, {property.city} ({property.postcode})</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-950/80 px-5 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-all ${
              activeTab === 'overview' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Overview & Specs
          </button>

          <button
            onClick={() => setActiveTab('360tour')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === '360tour' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>360° Virtual Tour</span>
          </button>

          <button
            onClick={() => setActiveTab('syndication')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'syndication' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Portal Syndication</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Photo & Main Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-64 object-cover rounded-2xl border border-slate-800 shadow-lg"
                />

                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Price Guide</p>
                    <p className="text-3xl font-black text-amber-400">
                      £{property.price.toLocaleString('en-GB')}
                      {property.type === 'rent' && <span className="text-sm text-slate-400 font-normal"> / month</span>}
                    </p>
                    <p className="text-xs text-slate-300">Status: <strong className="text-emerald-400">{property.status}</strong></p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">EPC Rating</span>
                      <span className="text-base font-extrabold text-emerald-400">Grade {property.epcRating}</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Council Tax</span>
                      <span className="text-base font-extrabold text-amber-400">Band {property.councilTaxBand}</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Tenure</span>
                      <span className="text-sm font-bold text-white">{property.tenure}</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">School Catchment</span>
                      <span className="text-sm font-bold text-emerald-400">{property.schoolCatchmentRating}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => onSyndicate(property.id)}
                      className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                    >
                      Trigger Syndication
                    </button>
                    <button
                      onClick={() => onSubmitOfferClick(property)}
                      className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                    >
                      Make Offer / Counter
                    </button>
                  </div>
                </div>
              </div>

              {/* Description & Features */}
              <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Description</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{property.description}</p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 pt-2">Key Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {property.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Local Area — real Google Places data */}
              <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Local Area (Live from Google)</h4>
                  {amenitiesLive && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">LIVE</span>
                  )}
                </div>

                {loadingAmenities && (
                  <p className="text-xs text-slate-400">Fetching nearby schools, stations, and supermarkets…</p>
                )}

                {!loadingAmenities && amenitiesLive === false && (
                  <p className="text-xs text-slate-400">
                    {amenitiesReason || 'Live local-area data is unavailable.'}
                  </p>
                )}

                {!loadingAmenities && amenitiesLive && amenities && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-slate-400 font-bold uppercase text-[10px] mb-1">Nearby Schools</p>
                      {amenities.schools.length === 0 && <p className="text-slate-500">None found nearby.</p>}
                      {amenities.schools.map((s, i) => (
                        <p key={i} className="text-slate-200 truncate">
                          {s.name}{s.rating ? ` · ★${s.rating}` : ''}
                        </p>
                      ))}
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold uppercase text-[10px] mb-1">Train Stations</p>
                      {amenities.stations.length === 0 && <p className="text-slate-500">None found nearby.</p>}
                      {amenities.stations.map((s, i) => (
                        <p key={i} className="text-slate-200 truncate">
                          {s.name}{s.rating ? ` · ★${s.rating}` : ''}
                        </p>
                      ))}
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold uppercase text-[10px] mb-1">Supermarkets</p>
                      {amenities.supermarkets.length === 0 && <p className="text-slate-500">None found nearby.</p>}
                      {amenities.supermarkets.map((s, i) => (
                        <p key={i} className="text-slate-200 truncate">
                          {s.name}{s.rating ? ` · ★${s.rating}` : ''}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: 360 Tour */}
          {activeTab === '360tour' && (
            <VirtualTourViewer property={property} />
          )}

          {/* Tab 3: Portal Syndication */}
          {activeTab === 'syndication' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Live Syndication Feed Status</h4>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-1">
                  <p className="font-bold text-slate-300">Rightmove RTDF</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    property.portals.rightmove === 'synced' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {property.portals.rightmove.toUpperCase()}
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-1">
                  <p className="font-bold text-slate-300">Zoopla ZPG</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    property.portals.zoopla === 'synced' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {property.portals.zoopla.toUpperCase()}
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-1">
                  <p className="font-bold text-slate-300">OnTheMarket</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    property.portals.onthemarket === 'synced' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {property.portals.onthemarket.toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onSyndicate(property.id)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg cursor-pointer"
              >
                Re-Syndicate Listing Feed Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
