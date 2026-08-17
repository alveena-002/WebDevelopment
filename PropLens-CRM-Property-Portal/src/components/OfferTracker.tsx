import React, { useState } from 'react';
import { OfferNegotiation, Property } from '../types';
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  PoundSterling,
  Building,
  UserCheck,
  ShieldCheck,
  Plus,
  ArrowRight,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface OfferTrackerProps {
  offers: OfferNegotiation[];
  properties: Property[];
  onSubmitNewOffer: (offerData: any) => Promise<void>;
  onUpdateOfferStatus: (offerId: string, status: string, counterAmount?: number, note?: string) => Promise<void>;
}

export const OfferTracker: React.FC<OfferTrackerProps> = ({
  offers,
  properties,
  onSubmitNewOffer,
  onUpdateOfferStatus
}) => {
  const [selectedOffer, setSelectedOffer] = useState<OfferNegotiation | null>(offers[0] || null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // New Offer Form State
  const [propertyId, setPropertyId] = useState<string>(properties[0]?.id || '');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [offerAmount, setOfferAmount] = useState<number>(650000);
  const [fundingType, setFundingType] = useState<'Cash Buyer' | 'Mortgage Approved (DIP)' | 'Property Chain (1 Level)' | 'Chain Free'>('Mortgage Approved (DIP)');
  const [agentNotes, setAgentNotes] = useState('');

  // Counter Offer Modal State
  const [counterAmount, setCounterAmount] = useState<number>(0);
  const [counterNote, setCounterNote] = useState('');

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !offerAmount || !propertyId) {
      alert('Please fill required offer details.');
      return;
    }

    await onSubmitNewOffer({
      propertyId,
      buyerName,
      buyerEmail: buyerEmail || 'buyer@example.co.uk',
      offerAmount: Number(offerAmount),
      fundingType,
      agentNotes: agentNotes || 'Initial buyer offer submitted.'
    });

    setIsOfferModalOpen(false);
    setBuyerName('');
    setAgentNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Offer & Negotiation Real-Time Tracker</h2>
            <p className="text-xs text-slate-400">
              Instant counter-offers, buyer DIP verification, and SSTC / Let Agreed conversion timeline audit trail
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOfferModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Submit New Buyer Offer</span>
        </button>
      </div>

      {/* Main Grid: Offers Table + Selected Deal Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Offers Table List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Active Negotiating Offers ({offers.length})
            </h3>
            <span className="text-xs text-rose-400 font-semibold">Real-Time Sync Active</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {offers.map(off => {
              const variance = Math.round(((off.offerAmount - off.askingPrice) / off.askingPrice) * 100);
              const isSelected = selectedOffer?.id === off.id;

              return (
                <div
                  key={off.id}
                  onClick={() => setSelectedOffer(off)}
                  className={`p-5 transition-all cursor-pointer hover:bg-slate-800/50 ${
                    isSelected ? 'bg-slate-800/70 border-l-4 border-rose-500' : ''
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-white line-clamp-1">{off.propertyTitle}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      off.status === 'Accepted' || off.status === 'SSTC' || off.status === 'Let Agreed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : off.status === 'Countered'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : off.status === 'Declined'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {off.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                    <div>
                      <p className="text-slate-300 font-semibold">{off.buyerName}</p>
                      <p className="text-slate-500 text-[11px] flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-400" />
                        <span>{off.fundingType}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-black text-amber-400">
                        £{off.offerAmount.toLocaleString('en-GB')}
                        <span className={`text-xs ml-1 font-semibold ${variance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ({variance >= 0 ? `+${variance}%` : `${variance}%`})
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-500">Asking Price: £{off.askingPrice.toLocaleString('en-GB')}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Deal Timeline & Interactive Negotiation Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          {selectedOffer ? (
            <>
              <div className="border-b border-slate-800 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Deal Inspection</span>
                  <span className="text-[11px] text-slate-500">{selectedOffer.updatedAt}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{selectedOffer.propertyTitle}</h3>
                <p className="text-xs text-slate-400">{selectedOffer.propertyAddress}</p>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mt-2 space-y-1 text-xs">
                  <p className="text-slate-300 font-semibold">Buyer: <strong>{selectedOffer.buyerName}</strong></p>
                  <p className="text-slate-400">Funding: <strong className="text-emerald-400">{selectedOffer.fundingType}</strong></p>
                  <p className="text-amber-400 font-bold text-sm">Offer: £{selectedOffer.offerAmount.toLocaleString('en-GB')}</p>
                  {selectedOffer.sellerCounterAmount && (
                    <p className="text-rose-400 font-bold">Counter Offer: £{selectedOffer.sellerCounterAmount.toLocaleString('en-GB')}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons for Agent / Seller */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Action Controls</p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateOfferStatus(selectedOffer.id, 'SSTC')}
                    className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-md cursor-pointer"
                  >
                    Mark SSTC (Sold)
                  </button>

                  <button
                    onClick={() => {
                      const amount = prompt('Enter Seller Counter Offer Amount (£):', String(selectedOffer.offerAmount + 10000));
                      if (amount) {
                        onUpdateOfferStatus(selectedOffer.id, 'Countered', Number(amount), 'Vendor issued counter offer.');
                      }
                    }}
                    className="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
                  >
                    Counter Offer
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onUpdateOfferStatus(selectedOffer.id, 'Accepted')}
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Accept Offer
                  </button>

                  <button
                    onClick={() => onUpdateOfferStatus(selectedOffer.id, 'Declined')}
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Decline Offer
                  </button>
                </div>
              </div>

              {/* Negotiation Audit Timeline */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>Negotiation Timeline & Audit Log</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {selectedOffer.history?.map(item => (
                    <div key={item.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-200">{item.actor}</span>
                        <span className="text-slate-500">{item.timestamp}</span>
                      </div>
                      <p className="text-amber-400 font-semibold">{item.action}</p>
                      {item.note && <p className="text-slate-400 text-[11px]">{item.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 text-center py-10">Select an offer from the table to view negotiation history.</p>
          )}
        </div>
      </div>

      {/* Submit Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Submit Buyer Offer</h3>

            <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Property</label>
                <select
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title} (£{p.price.toLocaleString('en-GB')})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Buyer Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Lord Edward Sterling"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Offer Amount (£) *</label>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(Number(e.target.value))}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Funding Verification</label>
                <select
                  value={fundingType}
                  onChange={(e) => setFundingType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Cash Buyer">Cash Buyer (Funds Verified)</option>
                  <option value="Mortgage Approved (DIP)">Mortgage Approved (Decision In Principle)</option>
                  <option value="Property Chain (1 Level)">Property Chain (1 Level Under Offer)</option>
                  <option value="Chain Free">Chain Free First Time Buyer</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Agent / Offer Notes</label>
                <textarea
                  rows={2}
                  value={agentNotes}
                  onChange={(e) => setAgentNotes(e.target.value)}
                  placeholder="e.g. Buyer willing to complete within 28 days..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Submit Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
