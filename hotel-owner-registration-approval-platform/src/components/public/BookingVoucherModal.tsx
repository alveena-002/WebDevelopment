import React from 'react';
import { Booking, Hotel } from '../../types';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Users, 
  Wifi, 
  Key, 
  Sparkles,
  QrCode,
  Building2
} from 'lucide-react';

interface BookingVoucherModalProps {
  booking: Booking;
  hotel?: Hotel;
  onClose: () => void;
}

export const BookingVoucherModal: React.FC<BookingVoucherModalProps> = ({ booking, hotel, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden text-slate-900">
        
        {/* Modal Top Actions */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            OFFICIAL LODGEPASS GUEST VOUCHER
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pass Container */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Banner */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> Guaranteed Verified Stay
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">{booking.hotelName}</h2>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {hotel?.address || 'Official Verified Hotel Property'}, {hotel?.city || 'Pakistan'}
              </p>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirmation #</div>
              <div className="text-base font-black font-mono text-indigo-700">{booking.bookingNumber}</div>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {booking.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Guest & Room Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Primary Guest</span>
              <strong className="text-slate-900 font-bold">{booking.guestName}</strong>
              <div className="text-[11px] text-slate-500 truncate">{booking.guestEmail}</div>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Reserved Suite</span>
              <strong className="text-slate-900 font-bold">{booking.roomName}</strong>
              <div className="text-[11px] text-slate-500">{booking.numberOfGuests} Guests</div>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Check-In Date</span>
              <strong className="text-slate-900 font-bold">{booking.checkInDate}</strong>
              <div className="text-[11px] text-emerald-600 font-semibold">From 14:00 PM</div>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Check-Out Date</span>
              <strong className="text-slate-900 font-bold">{booking.checkOutDate}</strong>
              <div className="text-[11px] text-slate-500 font-semibold">{booking.totalNights} Nights Stay</div>
            </div>
          </div>

          {/* Check-In Perks & Access Codes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 space-y-2 text-xs">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-indigo-600" /> Digital Check-In Instructions
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Present this pass along with your original National ID / Passport at the reception desk for express priority keycard issuance.
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-indigo-900 bg-white p-2 rounded-xl border border-indigo-200">
                <span>Guest Wi-Fi SSID:</span>
                <strong>{hotel?.name?.split(' ')[0]}_Guest5G</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 space-y-2 text-xs">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Certified Clean Room Seal
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                This room has received 100% antimicrobial turnover, steam sanitized linens, and deep hygiene inspection.
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-emerald-800 bg-white p-2 rounded-xl border border-emerald-200">
                <span>Total Paid:</span>
                <span className="text-base text-emerald-700">${booking.totalAmount} USD</span>
              </div>
            </div>
          </div>

          {/* Simulated QR Code / Barcode footer */}
          <div className="border-t-2 border-dashed border-slate-200 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-slate-900 p-1.5 rounded-xl text-white flex items-center justify-center shadow-md">
                <QrCode className="w-10 h-10 text-white" />
              </div>
              <div className="text-[11px] text-slate-500">
                <span className="font-bold text-slate-800 block">Scan at Concierge for Express Access</span>
                <span>Authorized by Platform Administration System</span>
              </div>
            </div>

            <div className="text-right text-[11px] font-mono text-slate-400 hidden sm:block">
              AUTH-SEC-2026-PASS-9981<br />
              ISSUED: {new Date(booking.createdAt).toLocaleDateString()}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
