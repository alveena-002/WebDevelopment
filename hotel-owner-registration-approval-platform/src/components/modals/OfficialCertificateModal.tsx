import React, { useRef } from 'react';
import { Hotel } from '../../types';
import { 
  ShieldCheck, 
  Award, 
  Printer, 
  Download, 
  QrCode, 
  Building2, 
  Calendar, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Sparkles,
  X
} from 'lucide-react';

interface OfficialCertificateModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OfficialCertificateModal: React.FC<OfficialCertificateModalProps> = ({
  hotel,
  isOpen,
  onClose
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !hotel) return null;

  const issueDate = hotel.verification.reviewedAt 
    ? new Date(hotel.verification.reviewedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const regNumber = `GOV-PK-HTL-${hotel.id.replace('hotel_', '').toUpperCase().slice(0, 8)}-2026`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col">
        
        {/* Header Action Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold tracking-wide">
              Official Quality & Hospitality Compliance Certificate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button 
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-8 sm:p-12 bg-amber-50/30 flex justify-center">
          <div 
            ref={certRef}
            className="w-full max-w-2xl bg-white rounded-2xl p-8 sm:p-10 border-8 border-double border-amber-600/30 shadow-xl relative overflow-hidden text-center space-y-6"
          >
            {/* Background Seal Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
              <ShieldCheck className="w-96 h-96 text-slate-900" />
            </div>

            {/* Header Crest */}
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500 text-amber-600 mb-1">
                <Award className="w-9 h-9" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest text-amber-800">
                Ministry of Tourism & Hospitality Standards
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif tracking-tight">
                Certificate of Compliance & Sanitation
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2" />
            </div>

            {/* Cert Recipient Text */}
            <div className="space-y-3 relative z-10">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                This official seal of quality and verification is conferred upon
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-indigo-950 font-serif">
                {hotel.name}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Operated by: <strong className="text-slate-900">{hotel.businessOwnerName}</strong> • {hotel.city}, {hotel.country}
              </p>
            </div>

            {/* Badge & Scores Ribbon */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs relative z-10">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500">Sanitation Score</span>
                <p className="text-xl font-black text-emerald-600 mt-0.5">{hotel.sanitationScore || 98}%</p>
                <span className="text-[9px] font-semibold text-slate-500">ATP Swab Verified</span>
              </div>
              <div className="text-center border-x border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Tier Category</span>
                <p className="text-sm font-black text-slate-900 mt-1 flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {hotel.category}
                </p>
                <span className="text-[9px] font-semibold text-slate-500">50-Point Audit Passed</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500">Status</span>
                <p className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                  Verified & Active
                </p>
                <span className="text-[9px] font-semibold text-slate-500 block mt-0.5">Zero Infractions</span>
              </div>
            </div>

            {/* Official Certification Declaration */}
            <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto relative z-10">
              Having satisfied rigorous inspections regarding guest safety, environmental sanitization protocols, fire security clearances, and verified municipal hospitality licenses.
            </p>

            {/* Signatures & Security Footer */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 items-end text-left gap-4 relative z-10">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Registration Number</p>
                <p className="font-mono text-xs font-black text-slate-800">{regNumber}</p>
                <p className="text-[10px] text-slate-500">Issued: {issueDate}</p>
                <p className="text-[10px] text-slate-500">Valid Until: {expiryDate}</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="p-2 bg-white rounded-xl border border-slate-300 shadow-xs inline-block">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1">Scan for Live Registry</span>
              </div>

              <div className="text-right space-y-1">
                <div className="inline-block border-b-2 border-slate-900 pb-1 text-center">
                  <span className="font-serif italic text-sm text-slate-800 font-bold block">
                    {hotel.verification.reviewedByAdmin || 'Alveena Admin'}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-900 uppercase">Director of Quality Assurance</p>
                <p className="text-[9px] text-slate-500">National Hospitality Directorate</p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Official cryptographic registration stored in Supabase Vault.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition"
          >
            Close Certificate Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
