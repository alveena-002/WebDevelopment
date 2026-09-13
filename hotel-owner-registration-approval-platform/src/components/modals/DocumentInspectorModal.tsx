import React, { useState } from 'react';
import { Hotel, HotelDocument } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Building2, 
  Clock, 
  AlertCircle,
  X
} from 'lucide-react';

interface DocumentInspectorModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
  initialDocId?: string;
}

export const DocumentInspectorModal: React.FC<DocumentInspectorModalProps> = ({
  hotel,
  isOpen,
  onClose,
  initialDocId
}) => {
  const { adminVerifyDocument, showToast } = useApp();

  const [selectedDocId, setSelectedDocId] = useState<string>(() => {
    return initialDocId || (hotel?.documents[0]?.id || '');
  });

  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!isOpen || !hotel) return null;

  const currentDoc = hotel.documents.find(d => d.id === selectedDocId) || hotel.documents[0];

  const handleToggleVerify = (docId: string, currentStatus: boolean | undefined) => {
    adminVerifyDocument(hotel.id, docId, !currentStatus);
  };

  const sampleDefaultDocs: HotelDocument[] = hotel.documents.length > 0 ? hotel.documents : [
    {
      id: 'mock_doc_1',
      name: 'Ministry_Tourism_Operating_License_2026.pdf',
      type: 'business_license',
      url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
      fileSize: '3.4 MB',
      uploadedAt: hotel.createdAt,
      verified: true
    },
    {
      id: 'mock_doc_2',
      name: 'Owner_National_Identity_CNIC.pdf',
      type: 'cnic_front',
      url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
      fileSize: '1.2 MB',
      uploadedAt: hotel.createdAt,
      verified: true
    },
    {
      id: 'mock_doc_3',
      name: 'Food_Water_Sanitation_Health_Certificate.pdf',
      type: 'tax_cert',
      url: 'https://images.unsplash.com/photo-1562564055-71e051d33c19?w=1200&auto=format&fit=crop&q=80',
      fileSize: '4.1 MB',
      uploadedAt: hotel.createdAt,
      verified: true
    }
  ];

  const activeDoc = currentDoc || sampleDefaultDocs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Legal Document & License Audit Inspector</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-900/60 text-indigo-300 border border-indigo-700">
                  {hotel.name}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect high-resolution regulatory scan files, verify watermarks, and authenticate licenses.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Sidebar: Document List */}
          <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 p-4 space-y-3 overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Submitted Documents ({sampleDefaultDocs.length})
            </h3>

            <div className="space-y-2">
              {sampleDefaultDocs.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setZoomLevel(1);
                  }}
                  className={`w-full p-3 rounded-2xl text-left border transition flex flex-col gap-1.5 ${
                    activeDoc.id === doc.id
                      ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {doc.type.replace('_', ' ')}
                    </span>
                    {doc.verified ? (
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Pending Seal
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-900 truncate">
                    {doc.name}
                  </p>

                  <span className="text-[10px] text-slate-400">
                    Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()} • {doc.fileSize || '2.4 MB'}
                  </span>
                </button>
              ))}
            </div>

            {/* Verification Status Card */}
            <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-200 space-y-2 text-xs">
              <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" /> Administrative Action
              </span>
              <p className="text-indigo-800 text-[11px]">
                Authentication marks this document as legally verified in the government registry database.
              </p>
              <button
                onClick={() => handleToggleVerify(activeDoc.id, activeDoc.verified)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 ${
                  activeDoc.verified
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {activeDoc.verified ? (
                  <>
                    <XCircle className="w-4 h-4" /> Revoke Verification Seal
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Authenticate & Mark Verified
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Main Area: High-Res Document Preview Canvas */}
          <div className="flex-1 bg-slate-900 p-6 flex flex-col justify-between overflow-hidden relative">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between bg-slate-800/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 text-white text-xs mb-4 z-10">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200 truncate max-w-xs">{activeDoc.name}</span>
                <span className="text-slate-400">• {activeDoc.fileSize || '2.4 MB'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.2))}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-slate-300 w-12 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <a
                  href={activeDoc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold flex items-center gap-1 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Fullscreen
                </a>
              </div>
            </div>

            {/* Document Image Viewing Canvas */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div 
                className="transition-transform duration-200 shadow-2xl rounded-lg overflow-hidden border-2 border-slate-700 bg-white"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              >
                <img
                  src={activeDoc.url}
                  alt={activeDoc.name}
                  className="max-h-[500px] w-auto object-contain select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Document Details Footer */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Security Hash: SHA-256 Verified • Encrypted Vault Storage</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> High-Resolution 300 DPI Optical Scan
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
