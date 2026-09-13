import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageUploadHelper } from '../common/ImageUploadHelper';
import { HotelCategory, Coordinates, HotelDocument } from '../../types';
import { 
  Building2, 
  MapPin, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ShieldAlert, 
  CreditCard,
  FileCheck,
  Compass
} from 'lucide-react';

interface HotelRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any; // For editing or resubmission
  isResubmit?: boolean;
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

const POPULAR_LOCATIONS: { name: string; city: string; coords: Coordinates }[] = [
  { name: 'Islamabad Capital (F-6/F-7 Blue Area)', city: 'Islamabad', coords: { lat: 33.7182, lng: 73.0600, addressLookup: 'Blue Area Commercial, Islamabad' } },
  { name: 'Murree Hills & Kashmir Point', city: 'Murree', coords: { lat: 33.9062, lng: 73.3903, addressLookup: 'Mall Road, Kashmir Point, Murree' } },
  { name: 'Lahore Cultural Core & Gulberg', city: 'Lahore', coords: { lat: 31.5204, lng: 74.3587, addressLookup: 'Gulberg III, Main Boulevard, Lahore' } },
  { name: 'Karachi Beachfront & Clifton', city: 'Karachi', coords: { lat: 24.8138, lng: 67.0300, addressLookup: 'Clifton Beach Road, Block 4, Karachi' } },
  { name: 'Hunza Valley & Karakoram', city: 'Hunza', coords: { lat: 36.3167, lng: 74.6500, addressLookup: 'Karimabad, Hunza Valley' } },
  { name: 'Peshawar Heritage & University Rd', city: 'Peshawar', coords: { lat: 34.0151, lng: 71.5249, addressLookup: 'University Road, Peshawar' } },
];

export const HotelRegistrationModal: React.FC<HotelRegistrationModalProps> = ({
  isOpen,
  onClose,
  initialData,
  isResubmit = false,
}) => {
  const { submitHotelRegistration, ownerResubmitHotel, currentUser } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields matching functional specification PDF
  const [hotelName, setHotelName] = useState(initialData?.name || '');
  const [businessOwnerName, setBusinessOwnerName] = useState(initialData?.businessOwnerName || currentUser.name || '');
  const [email, setEmail] = useState(initialData?.email || currentUser.email || '');
  const [phone, setPhone] = useState(initialData?.phone || currentUser.phone || '+92 300 ');
  const [address, setAddress] = useState(initialData?.address || '');
  const [city, setCity] = useState(initialData?.city || 'Islamabad');
  const [country, setCountry] = useState(initialData?.country || 'Pakistan');
  const [coordinates, setCoordinates] = useState<Coordinates>(
    initialData?.googleMapsLocation || { lat: 33.7182, lng: 73.0600, addressLookup: 'Blue Area Commercial, Islamabad' }
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [numberOfRooms, setNumberOfRooms] = useState(initialData?.numberOfRooms || 12);
  const [category, setCategory] = useState<HotelCategory>(initialData?.category || '4-Star Hotel');
  
  // Media & Docs
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&auto=format&fit=crop&q=80');
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80');
  
  // Optional Verification Documents
  const [licenseFile, setLicenseFile] = useState<string>(
    initialData?.documents?.find((d: HotelDocument) => d.type === 'business_license')?.url || ''
  );
  const [cnicFile, setCnicFile] = useState<string>(
    initialData?.documents?.find((d: HotelDocument) => d.type === 'cnic_front')?.url || ''
  );

  if (!isOpen) return null;

  const handleLocationPreset = (loc: typeof POPULAR_LOCATIONS[0]) => {
    setCity(loc.city);
    setCoordinates(loc.coords);
    if (!address) {
      setAddress(loc.coords.addressLookup || '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const docs: HotelDocument[] = [];
    if (licenseFile) {
      docs.push({
        id: `doc_${Date.now()}_lic`,
        name: 'Govt_Business_License.pdf',
        type: 'business_license',
        url: licenseFile,
        fileSize: '2.1 MB',
        uploadedAt: new Date().toISOString(),
        verified: false,
      });
    }
    if (cnicFile) {
      docs.push({
        id: `doc_${Date.now()}_cnic`,
        name: 'Owner_CNIC_Identity.pdf',
        type: 'cnic_front',
        url: cnicFile,
        fileSize: '1.4 MB',
        uploadedAt: new Date().toISOString(),
        verified: false,
      });
    }

    const payload = {
      name: hotelName,
      businessOwnerName,
      email,
      phone,
      address,
      city,
      country,
      googleMapsLocation: coordinates,
      description,
      numberOfRooms: Number(numberOfRooms),
      category,
      logoUrl,
      coverImageUrl,
      galleryImages: [coverImageUrl, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80'],
      documents: docs,
    };

    if (isResubmit && initialData?.id) {
      ownerResubmitHotel(initialData.id, payload);
    } else {
      submitHotelRegistration(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-400/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isResubmit ? 'Resubmit Hotel Application' : 'Hotel Owner Registration Request (Option 2)'}
              </h2>
              <p className="text-xs text-slate-300">
                Functional Specification Onboarding — Submit hotel details for Admin Approval
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span className="text-xs font-semibold text-slate-800">Basic Info & Contacts</span>
          </div>
          <div className="h-0.5 w-8 bg-slate-300" />
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span className="text-xs font-semibold text-slate-800">Location & Category</span>
          </div>
          <div className="h-0.5 w-8 bg-slate-300" />
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span className="text-xs font-semibold text-slate-800">Media & Verification Docs</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-indigo-50/60 border border-indigo-200 p-3 rounded-xl flex items-center gap-3 text-xs text-indigo-900">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  After submission, your property enters <strong>Pending Approval</strong>. Admin reviews your application before unlocking public bookings and full dashboard controls.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Hotel Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={hotelName}
                    onChange={e => setHotelName(e.target.value)}
                    placeholder="e.g. Serena Heights Grand Resort"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Business / Owner Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={businessOwnerName}
                    onChange={e => setBusinessOwnerName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood / Hospitality Group"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Primary Contact Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="partner@hotel.com"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Primary Contact Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Hotel Narrative Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your property's highlights, ambiance, guest services, and scenic views..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Hotel Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as HotelCategory)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Total Number of Rooms <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    required
                    value={numberOfRooms}
                    onChange={e => setNumberOfRooms(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Islamabad, Murree, Lahore, Karachi"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Full Street Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Street number, sector, landmark"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Google Maps Location Coordinates & Presets */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    Google Maps Pinned Location & Coordinates
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
                  </span>
                </div>

                <div>
                  <p className="text-[11px] text-slate-500 mb-1.5">Quick Location Pins:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {POPULAR_LOCATIONS.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleLocationPreset(loc)}
                        className={`text-left px-2.5 py-1.5 rounded-lg border text-xs transition truncate ${
                          coordinates.addressLookup === loc.coords.addressLookup
                            ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        {loc.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold uppercase">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={coordinates.lat}
                      onChange={e => setCoordinates({ ...coordinates, lat: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold uppercase">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={coordinates.lng}
                      onChange={e => setCoordinates({ ...coordinates, lng: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploadHelper
                  label="Hotel Logo (Image Upload)"
                  value={logoUrl}
                  onChange={setLogoUrl}
                  aspectRatio="square"
                  presetCategory="logo"
                />

                <ImageUploadHelper
                  label="Cover Image (Image Upload)"
                  value={coverImageUrl}
                  onChange={setCoverImageUrl}
                  aspectRatio="wide"
                  presetCategory="hotel"
                />
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Verification Documents (Optional but speeds up approval)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Business / Tourism License</label>
                    <ImageUploadHelper
                      label="License Document Scan / Photo"
                      value={licenseFile}
                      onChange={setLicenseFile}
                      aspectRatio="wide"
                      presetCategory="document"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Owner CNIC / Identity Verification</label>
                    <ImageUploadHelper
                      label="CNIC Card Scan / Photo"
                      value={cnicFile}
                      onChange={setCnicFile}
                      aspectRatio="wide"
                      presetCategory="document"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  By submitting, you certify that all property information and uploaded permits are legitimate. The administrative verification committee will review your application within 24–48 hours.
                </p>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && (!hotelName || !businessOwnerName || !email || !phone)) {
                    alert('Please fill all required contact & hotel name fields.');
                    return;
                  }
                  if (step === 2 && (!city || !address)) {
                    alert('Please provide city and address.');
                    return;
                  }
                  setStep((step + 1) as any);
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                Continue to Step {step + 1} →
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isResubmit ? 'Resubmit for Admin Review' : 'Submit Registration Request'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
