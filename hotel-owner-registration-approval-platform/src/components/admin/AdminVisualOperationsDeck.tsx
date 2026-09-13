import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Award, 
  Users, 
  CheckCircle2, 
  Layers, 
  Eye, 
  ArrowRight,
  ExternalLink,
  MapPin,
  Clock
} from 'lucide-react';

interface AdminVisualOperationsDeckProps {
  onOpenAddHotel: () => void;
  onOpenSupabase: () => void;
  onFilterCategory: (tab: 'pending' | 'approved' | 'cleaning' | 'treasury' | 'logs') => void;
}

export const AdminVisualOperationsDeck: React.FC<AdminVisualOperationsDeckProps> = ({
  onOpenAddHotel,
  onOpenSupabase,
  onFilterCategory
}) => {
  const [activeOperationalPillar, setActiveOperationalPillar] = useState<number>(0);

  const pillars = [
    {
      id: 1,
      title: 'Physical 50-Point Sanitation Audit & ATP Swab Testing',
      tag: 'Hygiene & Cleanliness Enforcement',
      imageUrl: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1000&auto=format&fit=crop&q=80',
      description: 'Certified platform inspectors conduct on-site physical audits, testing linen bacterial levels, bathroom air sterilization, and kitchen sanitation scores.',
      metric: '99.2% Avg Score',
      actionLabel: 'Review Pending Property Audits',
      actionTab: 'pending' as const,
      highlights: ['Ultraviolet C-Band Sterilization', 'Linen Autoclave Heat-Press', 'Air Quality & HEPA Filtration']
    },
    {
      id: 2,
      title: 'Ministry of Tourism & Regulatory License Verification Desk',
      tag: 'Legal & Identity Due Diligence',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&auto=format&fit=crop&q=80',
      description: 'Zero tolerance for counterfeit registrations. Every business license, tax registration, and owner CNIC is cross-referenced with national tourism registries.',
      metric: '100% Verified Vault',
      actionLabel: 'Inspect Approved Hotels',
      actionTab: 'approved' as const,
      highlights: ['CNIC Identity Authentication', 'Municipal Fire Safety Clearances', 'Provincial Tourism Board Permits']
    },
    {
      id: 3,
      title: 'Express Sanitization Fleet & Mobile Response Housekeeping',
      tag: 'Complimentary Cleaning Operations',
      imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1000&auto=format&fit=crop&q=80',
      description: 'Professional sanitization teams dispatched within 60 minutes for hotel turnovers, deep cleans, and owner complimentary booking rewards.',
      metric: '4 Rapid Response Hubs',
      actionLabel: 'Manage Cleaning Fleet',
      actionTab: 'cleaning' as const,
      highlights: ['Dedicated Master Housekeepers', 'Hospital-Grade Eco Disinfectants', 'Automated Credit Allocation']
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Visual Bar */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80"
            alt="Admin Control Executive Deck"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/60" />

        <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" /> Official Administrative Control Center
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Hospitality Standards, Sanitation Audits & Fleet Operations
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Enforce rigorous quality criteria, issue certified inspection badges, inspect scanned legal dossiers, and manage automated partner payouts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddHotel}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Admin Direct Add Hotel
            </button>
            <button
              onClick={onOpenSupabase}
              className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-bold transition border border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" /> Database & RLS Keys
            </button>
          </div>
        </div>
      </div>

      {/* 3 Visual Operational Pillars */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" /> Live Operational Pillars & Visual Standards
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">Click any card to inspect or jump to controls</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => {
                setActiveOperationalPillar(idx);
                onFilterCategory(p.actionTab);
              }}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-400 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-xs text-white border border-white/20">
                      {p.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-xs font-black bg-emerald-500/90 text-slate-950 px-2.5 py-0.5 rounded-full font-mono">
                      {p.metric}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    {p.highlights.map((h, i) => (
                      <div key={i} className="text-[11px] text-slate-700 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button Strip */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                <span>{p.actionLabel}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
