import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  TrendingUp, 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Download, 
  FileText, 
  ArrowUpRight, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const AdminTreasurySettlements: React.FC = () => {
  const { hotels, bookings, adminProcessPayoutBatch, showToast } = useApp();

  const [settling, setSettling] = useState(false);
  const [selectedHotelFilter, setSelectedHotelFilter] = useState<string>('all');

  const validBookings = bookings.filter(b => b.status !== 'Cancelled' && b.status !== 'Rejected');
  
  const totalGMV = validBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const platformCommission = totalGMV * 0.15; // 15% Platform Take Rate
  const hotelDisbursements = totalGMV * 0.85; // 85% Net to Owners

  const handleRunBatch = () => {
    setSettling(true);
    setTimeout(() => {
      adminProcessPayoutBatch();
      setSettling(false);
    }, 800);
  };

  const handleDownloadRemittance = () => {
    showToast('Platform Remittance Statement CSV downloaded successfully.', 'success');
  };

  const filteredBookings = selectedHotelFilter === 'all'
    ? validBookings
    : validBookings.filter(b => b.hotelId === selectedHotelFilter);

  return (
    <div className="space-y-6">
      
      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Platform GMV
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            ${totalGMV.toLocaleString()}
          </p>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            Across <strong className="text-slate-800">{validBookings.length}</strong> confirmed guest stays
          </span>
        </div>

        <div className="p-6 bg-emerald-950 text-white rounded-3xl border border-emerald-900 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Platform Net Revenue (15%)
            </span>
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400 font-mono">
            ${platformCommission.toLocaleString()}
          </p>
          <span className="text-xs text-emerald-200/80 flex items-center gap-1 font-medium">
            Commission escrow collected automatically
          </span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Partner Disbursable Net (85%)
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-purple-900 font-mono">
            ${hotelDisbursements.toLocaleString()}
          </p>
          <span className="text-xs text-purple-700 flex items-center gap-1 font-medium">
            Direct bank transfer to verified hotel accounts
          </span>
        </div>

      </div>

      {/* Batch Execution & Remittance Toolbar */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Automated Settlement Engine & Escrow Release
          </h3>
          <p className="text-xs text-slate-500">
            Execute batch wire transfers for completed stays and generate formal VAT tax receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadRemittance}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Statement (CSV)
          </button>
          <button
            onClick={handleRunBatch}
            disabled={settling}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {settling ? (
              <>Processing Batch...</>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-400" /> Execute Payout Batch (${hotelDisbursements.toLocaleString()})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter and Breakdown Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Partner Settlement Ledger ({filteredBookings.length} Transactions)
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-semibold">Filter by Property:</label>
            <select
              value={selectedHotelFilter}
              onChange={e => setSelectedHotelFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="all">All Properties ({hotels.length})</option>
              {hotels.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Hotel Property</th>
                <th className="py-3.5 px-4">Guest</th>
                <th className="py-3.5 px-4">Stay Dates</th>
                <th className="py-3.5 px-4">Gross GMV</th>
                <th className="py-3.5 px-4 text-emerald-700">Platform (15%)</th>
                <th className="py-3.5 px-4 text-purple-700">Owner Net (85%)</th>
                <th className="py-3.5 px-4">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredBookings.map(b => {
                const commission = b.totalAmount * 0.15;
                const net = b.totalAmount * 0.85;
                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {b.bookingNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {b.hotelName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {b.guestName}
                      <span className="block text-[10px] text-slate-400">{b.roomName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {b.checkInDate} → {b.checkOutDate}
                    </td>
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900">
                      ${b.totalAmount}
                    </td>
                    <td className="py-3.5 px-4 font-bold font-mono text-emerald-600">
                      ${commission.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-bold font-mono text-purple-700">
                      ${net.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Settled / Escrow Released
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
