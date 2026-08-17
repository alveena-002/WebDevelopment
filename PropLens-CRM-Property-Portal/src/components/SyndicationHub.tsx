import React, { useState } from 'react';
import { Property, SyndicationLog } from '../types';
import {
  Share2,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Code2,
  Database,
  Radio,
  FileText,
  Building,
  Loader2
} from 'lucide-react';

interface SyndicationHubProps {
  properties: Property[];
  logs: SyndicationLog[];
  onTriggerSyndicate: (propertyIds: string[], portals: ('rightmove' | 'zoopla' | 'onthemarket')[]) => Promise<void>;
}

export const SyndicationHub: React.FC<SyndicationHubProps> = ({
  properties,
  logs,
  onTriggerSyndicate
}) => {
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>(properties.map(p => p.id));
  const [selectedPortals, setSelectedPortals] = useState<('rightmove' | 'zoopla' | 'onthemarket')[]>([
    'rightmove',
    'zoopla',
    'onthemarket'
  ]);
  const [isSyndicating, setIsSyndicating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'payload' | 'logs'>('overview');
  const [inspectProperty, setInspectProperty] = useState<Property | null>(properties[0] || null);

  const handleToggleProperty = (id: string) => {
    if (selectedPropertyIds.includes(id)) {
      setSelectedPropertyIds(selectedPropertyIds.filter(i => i !== id));
    } else {
      setSelectedPropertyIds([...selectedPropertyIds, id]);
    }
  };

  const handleTogglePortal = (portal: 'rightmove' | 'zoopla' | 'onthemarket') => {
    if (selectedPortals.includes(portal)) {
      if (selectedPortals.length > 1) {
        setSelectedPortals(selectedPortals.filter(p => p !== portal));
      }
    } else {
      setSelectedPortals([...selectedPortals, portal]);
    }
  };

  const handleRunSyndication = async () => {
    if (selectedPropertyIds.length === 0) {
      alert('Please select at least one property to syndicate.');
      return;
    }
    setIsSyndicating(true);
    try {
      await onTriggerSyndicate(selectedPropertyIds, selectedPortals);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyndicating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Syndication Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Rightmove API Monitor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-bold text-white text-base">Rightmove RTDF v3</h3>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
              API CONNECTED
            </span>
          </div>
          <p className="text-xs text-slate-400">Real-Time Data Feed Endpoint: <code className="text-emerald-400 font-mono">/api/v3/rightmove/sync</code></p>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span>Synced Listings: <strong>{properties.filter(p => p.portals.rightmove === 'synced').length}</strong></span>
            <span className="text-emerald-400 font-semibold">0ms Latency</span>
          </div>
        </div>

        {/* Zoopla ZPG API Monitor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-bold text-white text-base">Zoopla ZPG Gateway</h3>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
              API CONNECTED
            </span>
          </div>
          <p className="text-xs text-slate-400">Real-Time Listing Feed: <code className="text-purple-400 font-mono">/api/zpg/v2/listings</code></p>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span>Synced Listings: <strong>{properties.filter(p => p.portals.zoopla === 'synced').length}</strong></span>
            <span className="text-purple-400 font-semibold">12ms Latency</span>
          </div>
        </div>

        {/* OnTheMarket API Monitor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-bold text-white text-base">OnTheMarket Portal API</h3>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
              API CONNECTED
            </span>
          </div>
          <p className="text-xs text-slate-400">Hourly Batch & Instant Feed: <code className="text-amber-400 font-mono">/api/otm/v1/properties</code></p>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span>Synced Listings: <strong>{properties.filter(p => p.portals.onthemarket === 'synced').length}</strong></span>
            <span className="text-amber-400 font-semibold">Ready</span>
          </div>
        </div>
      </div>

      {/* Control Panel Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="h-5 w-5 text-emerald-400" />
              <span>Multi-Portal One-Click Auto-Syndication</span>
            </h2>
            <p className="text-xs text-slate-400">Publish or update listings across Rightmove, Zoopla and OnTheMarket instantaneously</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Navigation Tabs inside Hub */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-all ${
                  activeTab === 'overview' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sync Manager
              </button>
              <button
                onClick={() => setActiveTab('payload')}
                className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-all ${
                  activeTab === 'payload' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                API Payload Inspector
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-all ${
                  activeTab === 'logs' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Live Transmission Logs
              </button>
            </div>

            <button
              onClick={handleRunSyndication}
              disabled={isSyndicating}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSyndicating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Transmitting Feeds...</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span>Syndicate Selected ({selectedPropertyIds.length})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Portals Selection Toggles */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Target Portals:</span>

          <label
            onClick={() => handleTogglePortal('rightmove')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
              selectedPortals.includes('rightmove')
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
            }`}
          >
            <input type="checkbox" checked={selectedPortals.includes('rightmove')} readOnly className="sr-only" />
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Rightmove RTDF</span>
          </label>

          <label
            onClick={() => handleTogglePortal('zoopla')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
              selectedPortals.includes('zoopla')
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-bold'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
            }`}
          >
            <input type="checkbox" checked={selectedPortals.includes('zoopla')} readOnly className="sr-only" />
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Zoopla ZPG</span>
          </label>

          <label
            onClick={() => handleTogglePortal('onthemarket')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
              selectedPortals.includes('onthemarket')
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
            }`}
          >
            <input type="checkbox" checked={selectedPortals.includes('onthemarket')} readOnly className="sr-only" />
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>OnTheMarket</span>
          </label>
        </div>
      </div>

      {/* Tab 1: Overview Property Selector Table */}
      {activeTab === 'overview' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Properties to Syndicate
            </h3>
            <button
              onClick={() => {
                if (selectedPropertyIds.length === properties.length) {
                  setSelectedPropertyIds([]);
                } else {
                  setSelectedPropertyIds(properties.map(p => p.id));
                }
              }}
              className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              {selectedPropertyIds.length === properties.length ? 'Deselect All' : 'Select All Properties'}
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {properties.map(prop => (
              <div key={prop.id} className="p-4 hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedPropertyIds.includes(prop.id)}
                    onChange={() => handleToggleProperty(prop.id)}
                    className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
                  />
                  <img
                    src={prop.images[0]}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-12 w-16 rounded-xl object-cover bg-slate-950"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{prop.title}</h4>
                    <p className="text-xs text-slate-400">{prop.address}, {prop.city} ({prop.postcode}) • £{prop.price.toLocaleString('en-GB')}</p>
                  </div>
                </div>

                {/* Live Portal Badges */}
                <div className="flex items-center gap-2">
                  <div className="text-right mr-2 hidden sm:block">
                    <p className="text-[11px] font-semibold text-slate-300">
                      Last Sync: {prop.portals.lastSyncedAt || 'Not synced'}
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    prop.portals.rightmove === 'synced'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>
                    Rightmove
                  </span>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    prop.portals.zoopla === 'synced'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>
                    Zoopla
                  </span>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    prop.portals.onthemarket === 'synced'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>
                    OnTheMarket
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: API Payload Inspector */}
      {activeTab === 'payload' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="h-4 w-4 text-amber-400" />
              <span>Rightmove & Zoopla Feed JSON Payload Inspector</span>
            </h3>
            <select
              value={inspectProperty?.id || ''}
              onChange={(e) => {
                const found = properties.find(p => p.id === e.target.value);
                if (found) setInspectProperty(found);
              }}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-96 scrollbar-thin">
            <pre>
{JSON.stringify({
  apiHeader: {
    feedVersion: "RTDF-v3.2",
    agencyBranchId: "UK-LON-SW7-8812",
    timestamp: new Date().toISOString()
  },
  propertyData: {
    reference: inspectProperty?.id,
    address: {
      houseNameNumber: inspectProperty?.address,
      postcode: inspectProperty?.postcode,
      townCity: inspectProperty?.city,
      country: "United Kingdom"
    },
    priceDetails: {
      price: inspectProperty?.price,
      currency: "GBP",
      priceQualifier: inspectProperty?.type === 'rent' ? 'Per Month' : 'Guide Price'
    },
    details: {
      bedrooms: inspectProperty?.bedrooms,
      bathrooms: inspectProperty?.bathrooms,
      receptionRooms: inspectProperty?.receptionRooms,
      epcRating: inspectProperty?.epcRating,
      councilTaxBand: inspectProperty?.councilTaxBand,
      tenure: inspectProperty?.tenure,
      features: inspectProperty?.features,
      summary: inspectProperty?.description
    },
    media: {
      images: inspectProperty?.images,
      virtual360Tour: inspectProperty?.virtualTourUrl
    }
  }
}, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Transmission Logs */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Live Real-Time API Transmission Audit Logs
            </h3>
            <span className="text-xs text-slate-400">{logs.length} Total Sync Transactions</span>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {logs.map(log => (
              <div key={log.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{log.propertyTitle}</p>
                    <p className="text-slate-400">{log.message}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 bg-slate-800 text-amber-400 rounded text-[11px] font-mono font-bold">
                    {log.portal} • {log.referenceCode}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
