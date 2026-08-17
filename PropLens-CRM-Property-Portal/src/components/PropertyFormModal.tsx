import React, { useState } from 'react';
import { Property, PropertyType, EpcRating, CouncilTaxBand, Tenure } from '../types';
import { X, Sparkles, Building, MapPin, Loader2, Plus, Image } from 'lucide-react';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (property: Partial<Property>) => void;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  isOpen,
  onClose,
  onAddProperty
}) => {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('London');
  const [price, setPrice] = useState<number>(750000);
  const [type, setType] = useState<PropertyType>('sale');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [receptionRooms, setReceptionRooms] = useState<number>(1);
  const [areaSqFt, setAreaSqFt] = useState<number>(1400);
  const [epcRating, setEpcRating] = useState<EpcRating>('B');
  const [councilTaxBand, setCouncilTaxBand] = useState<CouncilTaxBand>('E');
  const [tenure, setTenure] = useState<Tenure>('Freehold');
  const [hasGarden, setHasGarden] = useState<boolean>(true);
  const [hasParking, setHasParking] = useState<boolean>(true);
  const [schoolRating, setSchoolRating] = useState<'Outstanding' | 'Good' | 'Requires Improvement'>('Outstanding');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string>('Gated parking, Solar Panels, Near Underground Station, Fitted Wardrobes');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAiDescription = async () => {
    if (!title) {
      alert('Please fill in at least the property title before generating AI description.');
      return;
    }
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai-valuation-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          address,
          city,
          price,
          type,
          bedrooms,
          bathrooms,
          features: features.split(',').map(f => f.trim())
        })
      });
      const data = await res.json();
      if (data.description) {
        setDescription(data.description);
      }
      if (data.features && Array.isArray(data.features)) {
        setFeatures(data.features.join(', '));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !address || !price) {
      alert('Please fill required fields (Title, Address, Price).');
      return;
    }

    onAddProperty({
      title,
      address,
      postcode: postcode || 'SW1A 1AA',
      city,
      price: Number(price),
      type,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      receptionRooms: Number(receptionRooms),
      areaSqFt: Number(areaSqFt),
      epcRating,
      councilTaxBand,
      tenure,
      hasGarden,
      hasParking,
      schoolCatchmentRating: schoolRating,
      images: [imageUrl],
      description: description || `${bedrooms} bedroom ${type === 'sale' ? 'residence for sale' : 'property to let'} in ${city}.`,
      features: features.split(',').map(f => f.trim()).filter(Boolean),
      status: 'Available'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add New UK Property Listing</h3>
              <p className="text-xs text-slate-400">Create listing for sales or lettings with auto-AI copywriting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Title & Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Property Title *
              </label>
              <input
                type="text"
                placeholder="e.g. The Chelsea Riverside Penthouse"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Listing Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="sale">For Sale (Asking Price)</option>
                <option value="rent">To Let (Monthly Rent)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Address, Postcode, City */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Street Address *
              </label>
              <input
                type="text"
                placeholder="e.g. 24 King's Road"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Postcode
              </label>
              <input
                type="text"
                placeholder="e.g. SW3 4TR"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                City / Region
              </label>
              <input
                type="text"
                placeholder="e.g. London, Manchester, Bristol"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Row 3: Price, Bedrooms, Bathrooms, Area */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Price (£) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Area (sq ft)
              </label>
              <input
                type="number"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Row 4: EPC, Council Tax, Tenure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                EPC Rating
              </label>
              <select
                value={epcRating}
                onChange={(e) => setEpcRating(e.target.value as EpcRating)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(r => (
                  <option key={r} value={r}>EPC Grade {r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Council Tax Band
              </label>
              <select
                value={councilTaxBand}
                onChange={(e) => setCouncilTaxBand(e.target.value as CouncilTaxBand)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(b => (
                  <option key={b} value={b}>Council Tax Band {b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Tenure
              </label>
              <select
                value={tenure}
                onChange={(e) => setTenure(e.target.value as Tenure)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Freehold">Freehold</option>
                <option value="Leasehold">Leasehold</option>
                <option value="Share of Freehold">Share of Freehold</option>
              </select>
            </div>
          </div>

          {/* Checkboxes & Photo URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasGarden}
                  onChange={(e) => setHasGarden(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-xs font-medium text-slate-300">Private Garden</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasParking}
                  onChange={(e) => setHasParking(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-xs font-medium text-slate-300">Off-Street / Garage Parking</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Main Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Features Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Key Features (Comma Separated)
            </label>
            <input
              type="text"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Description + AI Copywriter Generator Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Full Listing Description
              </label>

              <button
                type="button"
                onClick={handleGenerateAiDescription}
                disabled={isGeneratingAi}
                className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Writing Copy with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Auto-Draft Description with AI</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={4}
              placeholder="Enter or auto-generate compelling UK estate agent description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Save & Create Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
