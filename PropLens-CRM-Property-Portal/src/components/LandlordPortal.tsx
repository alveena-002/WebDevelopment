import React, { useState } from 'react';
import { Landlord, FinancialStatement, MaintenanceTicket, TenancyAlert } from '../types';
import {
  UserCheck,
  PoundSterling,
  FileText,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Building,
  ShieldAlert,
  ArrowUpRight,
  Filter,
  Calendar
} from 'lucide-react';

interface LandlordPortalProps {
  landlords: Landlord[];
  statements: FinancialStatement[];
  maintenanceTickets: MaintenanceTicket[];
  tenancyAlerts: TenancyAlert[];
  onApproveMaintenance: (ticketId: string) => void;
}

export const LandlordPortal: React.FC<LandlordPortalProps> = ({
  landlords,
  statements,
  maintenanceTickets,
  tenancyAlerts,
  onApproveMaintenance
}) => {
  const [selectedLandlordId, setSelectedLandlordId] = useState<string>(landlords[0]?.id || 'land-1');
  const [activeTab, setActiveTab] = useState<'financials' | 'maintenance' | 'tenancies'>('financials');

  const selectedLandlord = landlords.find(l => l.id === selectedLandlordId) || landlords[0];

  const filteredStatements = statements.filter(s => s.landlordId === selectedLandlordId);
  const filteredMaintenance = maintenanceTickets.filter(m => m.landlordId === selectedLandlordId);
  const filteredTenancies = tenancyAlerts.filter(t => t.landlordId === selectedLandlordId);

  // Total earnings summary
  const totalGrossRent = filteredStatements.reduce((sum, s) => sum + s.grossRent, 0);
  const totalNetPayout = filteredStatements.reduce((sum, s) => sum + s.netPayout, 0);

  return (
    <div className="space-y-6">
      {/* Landlord Portal Login / Selector Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Landlord Client Portal</h2>
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-semibold">
                Client View
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Viewing financial statements, maintenance authorizations & tenancy expiry compliance for <strong>{selectedLandlord?.name}</strong>
            </p>
          </div>
        </div>

        {/* Landlord Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Switch Landlord:</span>
          <select
            value={selectedLandlordId}
            onChange={(e) => setSelectedLandlordId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
          >
            {landlords.map(l => (
              <option key={l.id} value={l.id}>{l.name} ({l.bankAccount})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Financial Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Total Gross Rent Collected</p>
          <p className="text-2xl font-black text-white">£{totalGrossRent.toLocaleString('en-GB')}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium pt-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>100% On-Time Rent Collection</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Net Disbursed Income</p>
          <p className="text-2xl font-black text-emerald-400">£{totalNetPayout.toLocaleString('en-GB')}</p>
          <p className="text-[11px] text-slate-400 font-medium pt-1">
            After {selectedLandlord?.managementFeePercent}% Management Fee & Deductions
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Managed Portfolio Properties</p>
          <p className="text-2xl font-black text-amber-400">{selectedLandlord?.propertiesCount} Properties</p>
          <p className="text-[11px] text-blue-400 font-medium pt-1">
            Bank: {selectedLandlord?.bankAccount}
          </p>
        </div>
      </div>

      {/* Portal Inner Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('financials')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'financials'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Rental Income Reports ({filteredStatements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('maintenance')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'maintenance'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="h-4 w-4" />
              <span>Maintenance & Repairs ({filteredMaintenance.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tenancies')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tenancies'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>AST Expiry & Cert Alerts ({filteredTenancies.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Rental Income Statements Table */}
        {activeTab === 'financials' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Statement Period</th>
                  <th className="px-5 py-3.5">Property</th>
                  <th className="px-5 py-3.5">Gross Rent</th>
                  <th className="px-5 py-3.5">Agent Fee ({selectedLandlord?.managementFeePercent}%)</th>
                  <th className="px-5 py-3.5">Maintenance Deductions</th>
                  <th className="px-5 py-3.5 font-bold text-white">Net Payout</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Statement PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStatements.map(stmt => (
                  <tr key={stmt.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-bold text-white">{stmt.period}</td>
                    <td className="px-5 py-4 text-slate-300 max-w-xs truncate">{stmt.propertyAddress}</td>
                    <td className="px-5 py-4 font-semibold text-slate-200">£{stmt.grossRent.toLocaleString('en-GB')}</td>
                    <td className="px-5 py-4 text-rose-400">-£{stmt.managementFee.toLocaleString('en-GB')}</td>
                    <td className="px-5 py-4 text-amber-400">-£{stmt.maintenanceDeductions.toLocaleString('en-GB')}</td>
                    <td className="px-5 py-4 font-black text-emerald-400 text-sm">£{stmt.netPayout.toLocaleString('en-GB')}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        stmt.status === 'Paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {stmt.status} ({stmt.payoutDate})
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => alert(`Downloading Statement ${stmt.id} PDF for ${stmt.period}...`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>PDF Statement</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Maintenance & Repairs */}
        {activeTab === 'maintenance' && (
          <div className="p-5 space-y-4">
            {filteredMaintenance.length > 0 ? (
              filteredMaintenance.map(ticket => (
                <div key={ticket.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ticket.priority === 'Emergency'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : ticket.priority === 'High'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {ticket.priority} Priority
                      </span>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-bold">
                        {ticket.category}
                      </span>
                      <span className="text-xs text-slate-500">• Reported: {ticket.createdAt}</span>
                    </div>

                    <h4 className="text-base font-bold text-white">{ticket.title}</h4>
                    <p className="text-xs text-slate-400">{ticket.description}</p>
                    <p className="text-xs text-slate-500">Property: {ticket.propertyAddress} (Tenant: {ticket.tenantName})</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="text-sm font-bold text-amber-400">
                      Estimated Cost: £{ticket.estimatedCost}
                    </p>

                    {ticket.landlordApproved ? (
                      <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold border border-emerald-500/30">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Landlord Authorized</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onApproveMaintenance(ticket.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        <span>Authorize Repair Cost (£{ticket.estimatedCost})</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No active maintenance tickets for this landlord portfolio.</p>
            )}
          </div>
        )}

        {/* Tab 3: AST Tenancy Expirations */}
        {activeTab === 'tenancies' && (
          <div className="p-5 space-y-4">
            {filteredTenancies.map(ten => (
              <div key={ten.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-400 rounded-full text-xs font-bold border border-rose-500/30">
                      {ten.daysToExpiry} Days To Expiry
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Monthly Rent: £{ten.monthlyRent.toLocaleString('en-GB')}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{ten.propertyAddress}</h4>
                  <p className="text-xs text-slate-400">Tenant Name: <strong>{ten.tenantName}</strong> • Deposit Held in TDS: £{ten.depositAmount}</p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <p className="text-slate-300 font-semibold">Gas Safety Cert Expiry: <span className="text-amber-400">{ten.gasSafetyExpiry}</span></p>
                    <p className="text-slate-300 font-semibold">EPC Cert Expiry: <span className="text-emerald-400">{ten.epcExpiry}</span></p>
                  </div>

                  <span className="px-3 py-1.5 bg-slate-800 text-amber-300 rounded-xl font-bold border border-slate-700">
                    {ten.renewalStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
