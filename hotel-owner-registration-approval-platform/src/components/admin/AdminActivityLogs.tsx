import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLogItem } from '../../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  DollarSign, 
  FileText, 
  AlertTriangle, 
  Search, 
  Clock, 
  Activity,
  Filter
} from 'lucide-react';

export const AdminActivityLogs: React.FC = () => {
  const { auditLogs } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categoryIcons = {
    approval: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    rejection: <XCircle className="w-4 h-4 text-rose-600" />,
    dispatch: <Sparkles className="w-4 h-4 text-purple-600" />,
    sanitation: <ShieldCheck className="w-4 h-4 text-blue-600" />,
    payout: <DollarSign className="w-4 h-4 text-amber-600" />,
    suspension: <AlertTriangle className="w-4 h-4 text-slate-600" />,
    document: <FileText className="w-4 h-4 text-indigo-600" />,
  };

  const categoryColors = {
    approval: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    rejection: 'bg-rose-50 text-rose-800 border-rose-200',
    dispatch: 'bg-purple-50 text-purple-800 border-purple-200',
    sanitation: 'bg-blue-50 text-blue-800 border-blue-200',
    payout: 'bg-amber-50 text-amber-800 border-amber-200',
    suspension: 'bg-slate-100 text-slate-800 border-slate-300',
    document: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      log.action.toLowerCase().includes(q) ||
      log.target.toLowerCase().includes(q) ||
      (log.details && log.details.toLowerCase().includes(q)) ||
      log.adminName.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" /> Platform Security & Audit Activity Stream
          </h3>
          <p className="text-xs text-slate-500">
            Immutable administrative event ledger tracking property approvals, legal validations, cleaning dispatches, and payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-900 text-white rounded-xl text-xs font-mono font-bold">
            {auditLogs.length} Total Logged Events
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search activity by action, hotel, admin or detail..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 overflow-x-auto w-full sm:w-auto">
          {['all', 'approval', 'dispatch', 'sanitation', 'payout', 'document', 'rejection'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl capitalize transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed List */}
      <div className="space-y-3">
        {filteredLogs.map(log => (
          <div
            key={log.id}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl border ${categoryColors[log.category] || 'bg-slate-100 text-slate-800'}`}>
                {categoryIcons[log.category] || <Activity className="w-4 h-4" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">{log.action}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                    {log.target}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    by <strong className="text-slate-600">{log.adminName}</strong>
                  </span>
                </div>

                {log.details && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {log.details}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0 font-medium self-end sm:self-center">
              <Clock className="w-3.5 h-3.5" />
              {new Date(log.timestamp).toLocaleString()}
            </div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
            No audit logs found matching your search or category filter.
          </div>
        )}
      </div>

    </div>
  );
};
