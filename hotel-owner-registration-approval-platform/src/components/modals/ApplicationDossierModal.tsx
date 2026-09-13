import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hotel, HotelDocument } from '../../types';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  AlertTriangle,
  ExternalLink,
  Bed,
  Star,
  Clock,
  Layers,
  Send
} from 'lucide-react';

interface ApplicationDossierModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationDossierModal: React.FC<ApplicationDossierModalProps> = ({
  hotel,
  isOpen,
  onClose,
}) => {
  const { 
    adminApproveHotel, 
    adminRejectHotel, 
    adminRequestInfo, 
    adminSuspendHotel, 
    adminReactivateHotel,
    updateVerificationChecklist,
    getBookingsByHotelId,
    getRoomsByHotelId,
    getEligibleCleaningCredits
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'location' | 'stats'>('overview');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [requestInfoNotes, setRequestInfoNotes] = useState('');
  const [showRequestInfoForm, setShowRequestInfoForm] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [showSuspendForm, setShowSuspendForm] = useState(false);

  if (!isOpen || !hotel) return null;

  const hotelBookings = getBookingsByHotelId(hotel.id);
  const hotelRooms = getRoomsByHotelId(hotel.id);
  const cleaningCredits = getEligibleCleaningCredits(hotel.id);

  const handleApprove = () => {
    adminApproveHotel(hotel.id);
    onClose();
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    adminRejectHotel(hotel.id, rejectReason.trim());
    setShowRejectForm(false);
    onClose();
  };

  const handleRequestInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestInfoNotes.trim()) return;
    adminRequestInfo(hotel.id, requestInfoNotes.trim());
    setShowRequestInfoForm(false);
    onClose();
  };

  const handleSuspend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspendReason.trim()) return;
    adminSuspendHotel(hotel.id, suspendReason.trim());
    setShowSuspendForm(false);
    onClose();
  };

  const statusBadge = {
    'Draft': 'bg-slate-100 text-slate-700 border-slate-300',
    'Pending Approval': 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse',
    'Approved': 'bg-emerald-50 text-emerald-800 border-emerald-300',
    'Active': 'bg-emerald-50 text-emerald-800 border-emerald-300',
    'Rejected': 'bg-rose-50 text-rose-800 border-rose-300',
    'Suspended': 'bg-slate-800 text-slate-100 border-slate-700',
  }[hotel.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img 
              src={hotel.logoUrl} 
              alt={hotel.name} 
              className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold truncate max-w-md">{hotel.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge}`}>
                  {hotel.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Category: <span className="text-slate-200">{hotel.category}</span> • ID: <span className="font-mono">{hotel.id}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
            ✕
          </button>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Property Dossier & Verification
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-3 px-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'documents' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Licenses & Identity ({hotel.documents.length})
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`pb-3 px-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'location' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> Map Location & Media
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-3 px-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'stats' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Bookings & Cleaning ({hotelBookings.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Rejection / Suspension Notice if applicable */}
              {hotel.rejectionReason && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-rose-700">
                    <XCircle className="w-4 h-4" /> Active Rejection Reason:
                  </span>
                  <p>{hotel.rejectionReason}</p>
                </div>
              )}

              {hotel.suspensionReason && (
                <div className="p-4 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs space-y-1">
                  <span className="font-bold flex items-center gap-1 text-amber-400">
                    <AlertTriangle className="w-4 h-4" /> Active Suspension Reason:
                  </span>
                  <p className="text-slate-300">{hotel.suspensionReason}</p>
                </div>
              )}

              {/* Admin Verification Checklist Checklist */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                      Administrative Due Diligence & Verification Checklist
                    </h3>
                  </div>
                  {hotel.verification.reviewedByAdmin && (
                    <span className="text-[11px] text-indigo-700 font-medium">
                      Reviewed by {hotel.verification.reviewedByAdmin}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-indigo-100 cursor-pointer hover:border-indigo-300 transition">
                    <input
                      type="checkbox"
                      checked={hotel.verification.licenseVerified}
                      onChange={e => updateVerificationChecklist(hotel.id, { licenseVerified: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-xs font-medium text-slate-800">Business License</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-indigo-100 cursor-pointer hover:border-indigo-300 transition">
                    <input
                      type="checkbox"
                      checked={hotel.verification.cnicVerified}
                      onChange={e => updateVerificationChecklist(hotel.id, { cnicVerified: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-xs font-medium text-slate-800">CNIC Identity</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-indigo-100 cursor-pointer hover:border-indigo-300 transition">
                    <input
                      type="checkbox"
                      checked={hotel.verification.locationVerified}
                      onChange={e => updateVerificationChecklist(hotel.id, { locationVerified: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-xs font-medium text-slate-800">Map & Physical Address</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-indigo-100 cursor-pointer hover:border-indigo-300 transition">
                    <input
                      type="checkbox"
                      checked={hotel.verification.photosVerified}
                      onChange={e => updateVerificationChecklist(hotel.id, { photosVerified: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-xs font-medium text-slate-800">Photos & Rooms</span>
                  </label>
                </div>
              </div>

              {/* Owner & Property Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Owner / Business Entity</h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-600">Trading Name: <strong className="text-slate-900">{hotel.businessOwnerName}</strong></p>
                    <p className="text-slate-600 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {hotel.email}</p>
                    <p className="text-slate-600 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {hotel.phone}</p>
                    <p className="text-slate-600 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Submitted: {new Date(hotel.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Location & Capacity</h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-600 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {hotel.address}, {hotel.city}, {hotel.country}</p>
                    <p className="text-slate-600 flex items-center gap-1.5"><Bed className="w-3.5 h-3.5 text-slate-400" /> Total Capacity: <strong className="text-slate-900">{hotel.numberOfRooms} Rooms</strong></p>
                    <p className="text-slate-600 flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-500" /> Rating: {hotel.averageRating} ({hotel.reviewCount} reviews)</p>
                  </div>
                </div>
              </div>

              {/* Narrative Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Property Description</h4>
                <p className="text-xs text-slate-700 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {hotel.description}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Submitted Legal & Identification Documents
              </h3>

              {hotel.documents.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
                  No documents were uploaded during initial submission. (Optional in specification).
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {hotel.documents.map(doc => (
                    <div key={doc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-bold text-slate-800">{doc.name}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                          {doc.type.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="h-44 bg-slate-200 rounded-lg overflow-hidden relative group">
                        <img 
                          src={doc.url} 
                          alt={doc.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-bold"
                        >
                          <ExternalLink className="w-4 h-4" /> View Full Document
                        </a>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Size: {doc.fileSize || '1.8 MB'}</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Stored in Vault
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Cover Banner</h4>
                  <div className="h-48 rounded-xl overflow-hidden border border-slate-200">
                    <img src={hotel.coverImageUrl} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Google Maps Coordinates</h4>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <p className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <MapPin className="w-4 h-4 text-rose-600" />
                      {hotel.googleMapsLocation.addressLookup || hotel.address}
                    </p>
                    <div className="font-mono text-slate-600 space-y-1">
                      <p>Latitude: {hotel.googleMapsLocation.lat}</p>
                      <p>Longitude: {hotel.googleMapsLocation.lng}</p>
                    </div>
                    <a
                      href={`https://www.google.com/maps?q=${hotel.googleMapsLocation.lat},${hotel.googleMapsLocation.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold pt-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Property Gallery Photos ({hotel.galleryImages.length})</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {hotel.galleryImages.map((imgUrl, i) => (
                    <div key={i} className="h-24 rounded-lg overflow-hidden border border-slate-200">
                      <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[11px] font-bold uppercase text-emerald-800">Total Reservations</span>
                  <p className="text-2xl font-black text-emerald-950 mt-1">{hotelBookings.length}</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-[11px] font-bold uppercase text-blue-800">Published Rooms</span>
                  <p className="text-2xl font-black text-blue-950 mt-1">{hotelRooms.length}</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <span className="text-[11px] font-bold uppercase text-purple-800">Free Cleaning Credits</span>
                  <p className="text-2xl font-black text-purple-950 mt-1">{cleaningCredits.available} Available</p>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pt-2">Recent Hotel Bookings</h4>
              {hotelBookings.length === 0 ? (
                <p className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl border">No bookings logged yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {hotelBookings.map(b => (
                    <div key={b.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900">{b.bookingNumber}</strong> — {b.guestName} ({b.roomName})
                        <div className="text-slate-500 text-[11px]">{b.checkInDate} to {b.checkOutDate} • ${b.totalAmount}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Modals inside Drawer */}
          {showRejectForm && (
            <form onSubmit={handleReject} className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                <XCircle className="w-4 h-4 text-rose-600" />
                Provide Required Rejection Reason
              </div>
              <textarea
                rows={2}
                required
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Specify what was missing or why the license / property failed verification..."
                className="w-full px-3 py-2 text-xs border border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Confirm Rejection & Send Reason
                </button>
              </div>
            </form>
          )}

          {showRequestInfoForm && (
            <form onSubmit={handleRequestInfo} className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Send Request for Additional Information
              </div>
              <textarea
                rows={2}
                required
                value={requestInfoNotes}
                onChange={e => setRequestInfoNotes(e.target.value)}
                placeholder="Ask owner for updated high-res images, proof of municipal registration, or clarify amenities..."
                className="w-full px-3 py-2 text-xs border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestInfoForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send Message to Owner
                </button>
              </div>
            </form>
          )}

          {showSuspendForm && (
            <form onSubmit={handleSuspend} className="p-4 bg-slate-900 border border-slate-800 text-white rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Reason for Temporary Suspension
              </div>
              <textarea
                rows={2}
                required
                value={suspendReason}
                onChange={e => setSuspendReason(e.target.value)}
                placeholder="Enter suspension reason (e.g. renovation, compliance audit, maintenance)..."
                className="w-full px-3 py-2 text-xs border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-800 text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSuspendForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Confirm Suspension
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {hotel.status === 'Suspended' ? (
              <button
                type="button"
                onClick={() => {
                  adminReactivateHotel(hotel.id);
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Reactivate Hotel
              </button>
            ) : hotel.status === 'Approved' || hotel.status === 'Active' ? (
              <button
                type="button"
                onClick={() => {
                  setShowSuspendForm(true);
                  setShowRejectForm(false);
                  setShowRequestInfoForm(false);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-amber-300 text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" /> Suspend Property
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                setShowRequestInfoForm(!showRequestInfoForm);
                setShowRejectForm(false);
                setShowSuspendForm(false);
              }}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" /> Request Info
            </button>
          </div>

          <div className="flex items-center gap-2">
            {hotel.status !== 'Approved' && hotel.status !== 'Active' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectForm(!showRejectForm);
                    setShowRequestInfoForm(false);
                    setShowSuspendForm(false);
                  }}
                  className="px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Reject Request
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve Application
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
