import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageUploadHelper } from '../common/ImageUploadHelper';
import { HotelCategory, Coordinates } from '../../types';
import { Building2, UserPlus, Users, KeyRound, CheckCircle, X, ShieldCheck } from 'lucide-react';

interface AdminAddHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: HotelCategory[] = [
  '5-Star Luxury',
  '4-Star Hotel',
  '3-Star Hotel',
  '2-Star Hotel',
  '1-Star Hotel',
  'Boutique Hotel',
  'Guest House',
  'Serviced Apartment',
  'Resort & Spa',
  'Heritage Villa'
];

export const AdminAddHotelModal: React.FC<AdminAddHotelModalProps> = ({ isOpen, onClose }) => {
  const { adminCreateHotelWithOptions, users } = useApp();

  const existingOwners = users.filter(u => u.role === 'owner');

  const [ownerMode, setOwnerMode] = useState<'create_new' | 'assign_existing'>('create_new');
  const [selectedOwnerId, setSelectedOwnerId] = useState(existingOwners[0]?.id || '');
  
  // New Owner fields
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newOwnerPhone, setNewOwnerPhone] = useState('+92 300 ');

  // Hotel fields
  const [hotelName, setHotelName] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [country, setCountry] = useState('Pakistan');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<HotelCategory>('4-Star Hotel');
  const [numberOfRooms, setNumberOfRooms] = useState(20);
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&auto=format&fit=crop&q=80');
  const [coverImageUrl, setCoverImageUrl] = useState('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ownerInfo = {
      isNewAccount: ownerMode === 'create_new',
      existingOwnerId: ownerMode === 'assign_existing' ? selectedOwnerId : undefined,
      name: ownerMode === 'create_new' ? newOwnerName : (existingOwners.find(o => o.id === selectedOwnerId)?.name || 'Owner'),
      email: ownerMode === 'create_new' ? newOwnerEmail : (existingOwners.find(o => o.id === selectedOwnerId)?.email || 'owner@hotel.com'),
      phone: ownerMode === 'create_new' ? newOwnerPhone : (existingOwners.find(o => o.id === selectedOwnerId)?.phone || '+92 300 0000000'),
    };

    const hotelData = {
      name: hotelName,
      businessOwnerName: ownerInfo.name,
      email: ownerInfo.email,
      phone: ownerInfo.phone,
      city,
      country,
      address,
      category,
      numberOfRooms: Number(numberOfRooms),
      description: description || `Curated ${category} located in prime ${city}. Managed directly via platform partners.`,
      logoUrl,
      coverImageUrl,
      galleryImages: [coverImageUrl, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80'],
      googleMapsLocation: {
        lat: city === 'Islamabad' ? 33.7182 : city === 'Lahore' ? 31.5204 : city === 'Karachi' ? 24.8138 : 33.9062,
        lng: city === 'Islamabad' ? 73.0600 : city === 'Lahore' ? 74.3587 : city === 'Karachi' ? 67.0300 : 73.3903,
        addressLookup: `${address}, ${city}`
      }
    };

    adminCreateHotelWithOptions(hotelData, ownerInfo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Admin Adds Hotel (Option 1)</h2>
              <p className="text-xs text-slate-300">
                Directly provision hotel and assign to an existing or newly generated owner account
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Owner Assignment Mode */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
              Step 1: Assign Hotel Owner Account
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOwnerMode('create_new')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  ownerMode === 'create_new'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <UserPlus className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs">Create New Hotel Owner Account</span>
              </button>

              <button
                type="button"
                onClick={() => setOwnerMode('assign_existing')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  ownerMode === 'assign_existing'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs">Assign to Existing Owner ({existingOwners.length})</span>
              </button>
            </div>

            {ownerMode === 'create_new' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase">Owner Full Name</label>
                  <input
                    type="text"
                    required
                    value={newOwnerName}
                    onChange={e => setNewOwnerName(e.target.value)}
                    placeholder="e.g. Asad Naveed"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase">Owner Login Email</label>
                  <input
                    type="email"
                    required
                    value={newOwnerEmail}
                    onChange={e => setNewOwnerEmail(e.target.value)}
                    placeholder="asad@grandhotel.com"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase">Owner Phone</label>
                  <input
                    type="tel"
                    required
                    value={newOwnerPhone}
                    onChange={e => setNewOwnerPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <label className="text-[11px] font-semibold text-slate-600 uppercase">Select Registered Owner</label>
                <select
                  value={selectedOwnerId}
                  onChange={e => setSelectedOwnerId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                >
                  {existingOwners.map(owner => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email}) — ID: {owner.id}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Hotel Details */}
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
              Step 2: Hotel Property Specification
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Hotel Name</label>
                <input
                  type="text"
                  required
                  value={hotelName}
                  onChange={e => setHotelName(e.target.value)}
                  placeholder="e.g. Islamabad Continental Hotel"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as HotelCategory)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Islamabad / Lahore / Karachi"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Total Rooms</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={numberOfRooms}
                  onChange={e => setNumberOfRooms(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Full Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Building, Street, Sector"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ImageUploadHelper
                label="Hotel Logo"
                value={logoUrl}
                onChange={setLogoUrl}
                aspectRatio="square"
                presetCategory="logo"
              />
              <ImageUploadHelper
                label="Cover Image"
                value={coverImageUrl}
                onChange={setCoverImageUrl}
                aspectRatio="wide"
                presetCategory="hotel"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Provision Hotel & Send Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
