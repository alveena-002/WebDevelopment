import React, { useState } from 'react';
import { Property, BuyerProfile, BuyerMatchResult } from '../types';
import {
  Sparkles,
  UserCheck,
  Building,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Send,
  MessageSquare,
  Copy,
  Check,
  Loader2,
  TrendingUp,
  MapPin,
  PoundSterling
} from 'lucide-react';

interface AIMatcherDashboardProps {
  properties: Property[];
  buyers: BuyerProfile[];
  initialPropertyId?: string;
}

export const AIMatcherDashboard: React.FC<AIMatcherDashboardProps> = ({
  properties,
  buyers,
  initialPropertyId
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(initialPropertyId || properties[0]?.id || '');
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>('');
  const [matches, setMatches] = useState<BuyerMatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'matches' | 'buyers'>('matches');

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  const handleRunAiMatching = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: selectedPropertyId || undefined,
          buyerId: selectedBuyerId || undefined
        })
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMatches(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border border-purple-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Gemini 3.6 Flash Neural Match Engine</span>
            </div>
            <h2 className="text-2xl font-black text-white">AI Buyer Preference Matcher</h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Automatically evaluates buyer budget ranges, school catchment requirements, garden preferences, and EPC specs against live property listings. Drafts personalized email & WhatsApp alerts in seconds.
            </p>
          </div>

          <button
            onClick={handleRunAiMatching}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/25 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing Buyers with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Run AI Match Engine</span>
              </>
            )}
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Select Focus Property
            </label>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="">All Active Listings ({properties.length})</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} (£{p.price.toLocaleString('en-GB')}, {p.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Select Specific Registered Buyer (Optional)
            </label>
            <select
              value={selectedBuyerId}
              onChange={(e) => setSelectedBuyerId(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="">All Registered Buyers ({buyers.length})</option>
              {buyers.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.fundingStatus} - Max £{b.budgetMax.toLocaleString('en-GB')})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content View: Match Results */}
      {matches.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-400" />
              <span>AI Match Results ({matches.length} Buyers Evaluated)</span>
            </h3>
            <span className="text-xs text-slate-400">Sorted by highest match score</span>
          </div>

          <div className="space-y-4">
            {matches.map((match, idx) => (
              <div
                key={`${match.buyerId}-${match.propertyId}-${idx}`}
                className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-6 shadow-xl transition-all space-y-4"
              >
                {/* Match Score & Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-lg">
                      {match.matchScore}%
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{match.buyerName}</span>
                        <span className="text-xs text-slate-400 font-normal">({match.buyerEmail})</span>
                      </h4>
                      <p className="text-xs text-purple-300 font-medium mt-0.5">
                        Matched with: <strong>{properties.find(p => p.id === match.propertyId)?.title || match.propertyId}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                      match.matchScore >= 85
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : match.matchScore >= 65
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {match.matchScore >= 85 ? 'High Priority Match' : match.matchScore >= 65 ? 'Moderate Fit' : 'Low Match'}
                    </span>
                  </div>
                </div>

                {/* Match Reasons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Key Match Drivers */}
                  <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3.5 space-y-1.5">
                    <p className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Matching Preferences</span>
                    </p>
                    <ul className="space-y-1 text-slate-200">
                      {match.keyReasons?.map((reason, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Potential Caveats */}
                  <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3.5 space-y-1.5">
                    <p className="font-bold text-amber-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Mismatch Factors & Considerations</span>
                    </p>
                    <ul className="space-y-1 text-slate-200">
                      {match.mismatchFactors?.length ? (
                        match.mismatchFactors.map((m, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-400 mt-0.5">•</span>
                            <span>{m}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-400 italic">No significant mismatch factors detected. Excellent fit!</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Suggested Agent Action */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-purple-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
                  <p><strong>Suggested Action:</strong> {match.suggestedAction}</p>
                </div>

                {/* AI Outreach Generators (Email & WhatsApp) */}
                <div className="pt-2 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Draft Email */}
                  <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-amber-400" />
                        <span>AI Drafted Email Alert</span>
                      </span>
                      <button
                        onClick={() => handleCopyText(match.draftEmailTemplate, `email-${idx}`)}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-semibold cursor-pointer"
                      >
                        {copiedType === `email-${idx}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedType === `email-${idx}` ? 'Copied' : 'Copy Email'}</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={4}
                      value={match.draftEmailTemplate}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 font-mono focus:outline-none"
                    />
                  </div>

                  {/* Draft WhatsApp */}
                  <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Send className="h-3.5 w-3.5 text-emerald-400" />
                        <span>AI Drafted WhatsApp Message</span>
                      </span>
                      <button
                        onClick={() => handleCopyText(match.draftWhatsappMessage, `wa-${idx}`)}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-semibold cursor-pointer"
                      >
                        {copiedType === `wa-${idx}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedType === `wa-${idx}` ? 'Copied' : 'Copy Message'}</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={4}
                      value={match.draftWhatsappMessage}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State Prompt */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="h-16 w-16 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-white">Ready to Run Buyer Preference Matching</h3>
            <p className="text-xs text-slate-400">
              Click <strong>"Run AI Match Engine"</strong> above to trigger Gemini neural preference analysis across all active buyers and properties in your CRM.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
