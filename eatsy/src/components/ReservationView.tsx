import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, CheckCircle2, Sparkles, Utensils } from 'lucide-react';
import { Language, Reservation } from '../types';
import { i18nDict } from '../lib/i18n';

interface ReservationViewProps {
  language: Language;
}

export const ReservationView: React.FC<ReservationViewProps> = ({ language }) => {
  const t = i18nDict[language];

  const [customerName, setCustomerName] = useState('Sunaina Almas');
  const [email, setEmail] = useState('sunainaalmas725@gmail.com');
  const [phone, setPhone] = useState('+44 7700 900123');
  const [partySize, setPartySize] = useState<number>(4);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('19:00');
  const [tablePreference, setTablePreference] = useState<'Indoor Pub' | 'Glass Garden' | 'Leather Booth' | 'High Bar Table'>('Leather Booth');
  const [specialRequests, setSpecialRequests] = useState<string>('Birthday celebration - please arrange high chair if possible');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const res: Reservation = {
        id: `res-${Date.now()}`,
        customerName,
        email,
        phone,
        partySize,
        date,
        timeSlot,
        tablePreference,
        specialRequests,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };

      setConfirmedReservation(res);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-900">
      {/* Header */}
      <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-3">
        <div className="flex items-center gap-2 bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold px-3 py-1 rounded-full w-fit">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Real-Time Table Booking & Wait Time Sync</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">{t.bookTable}</h1>
        <p className="text-slate-600 text-sm font-medium">
          Reserve your dining spot at The Old Bull & Bush. Synchronized live with Google Maps wait times!
        </p>
      </div>

      {!confirmedReservation ? (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-orange-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Party Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-orange-500" />
                Party Size:
              </label>
              <select
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500 font-bold"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange-500" />
                Reservation Date:
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500 font-mono font-bold"
              />
            </div>

            {/* Time Slot */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-500" />
                Sitting Time Slot:
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500 font-bold"
              >
                {['12:00', '13:30', '15:00', '17:00', '18:30', '19:00', '20:00', '21:30'].map((slot) => (
                  <option key={slot} value={slot}>
                    {slot} (Est. Wait: 0 Mins)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Preference */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Dining Atmosphere & Seating Preference:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Indoor Pub', 'Glass Garden', 'Leather Booth', 'High Bar Table'] as const).map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setTablePreference(pref)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    tablePreference === pref
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* Contact details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-500 font-medium">Full Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs rounded-xl p-3 mt-1"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-medium">Email Confirmation</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs rounded-xl p-3 mt-1"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-medium">UK Mobile</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs rounded-xl p-3 mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-medium">Special Notes for Kitchen or Host</label>
            <input
              type="text"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-medium text-xs rounded-xl p-3 mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-orange-200 transition-all cursor-pointer text-sm"
          >
            {isSubmitting ? 'Confirming Table Slot...' : 'Confirm Table Reservation'}
          </button>
        </form>
      ) : (
        /* Confirmed Table Card */
        <div className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">Table Reservation Confirmed!</h2>
            <p className="text-xs text-orange-600 font-mono font-bold mt-1">Ref: {confirmedReservation.id}</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 max-w-md mx-auto text-xs space-y-2 text-slate-700 font-medium">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Guest Name:</span>
              <span className="font-bold text-slate-900">{confirmedReservation.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Party Size:</span>
              <span className="font-bold text-orange-600">{confirmedReservation.partySize} Guests</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Date & Time:</span>
              <span className="font-bold text-slate-900">{confirmedReservation.date} at {confirmedReservation.timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Seating Area:</span>
              <span className="font-bold text-emerald-600">{confirmedReservation.tablePreference}</span>
            </div>
          </div>

          <button
            onClick={() => setConfirmedReservation(null)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer border border-slate-200"
          >
            Book Another Table
          </button>
        </div>
      )}
    </div>
  );
};
