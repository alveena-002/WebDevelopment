import React, { useState } from 'react';
import { Upload, Link2, Image as ImageIcon, X, Check } from 'lucide-react';

interface ImageUploadHelperProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: 'square' | 'wide' | 'banner';
  placeholder?: string;
  presetCategory?: 'hotel' | 'room' | 'logo' | 'document';
}

const PRESETS = {
  hotel: [
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80',
  ],
  room: [
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop&q=80',
  ],
  logo: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&auto=format&fit=crop&q=80',
  ],
  document: [
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
  ]
};

export const ImageUploadHelper: React.FC<ImageUploadHelperProps> = ({
  label,
  value,
  onChange,
  aspectRatio = 'wide',
  placeholder = 'Enter image URL or select from presets',
  presetCategory = 'hotel',
}) => {
  const [mode, setMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
    }
  };

  const heightClass = {
    square: 'h-32 w-32',
    wide: 'h-40 w-full',
    banner: 'h-48 w-full',
  }[aspectRatio];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">{label}</label>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-1 rounded font-medium transition ${mode === 'upload' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('presets')}
            className={`px-2 py-1 rounded font-medium transition ${mode === 'presets' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Presets
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-1 rounded font-medium transition ${mode === 'url' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
          >
            URL
          </button>
        </div>
      </div>

      {value ? (
        <div className={`relative ${heightClass} rounded-xl overflow-hidden border border-slate-200 group bg-slate-100`}>
          <img
            src={value}
            alt={label}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs flex items-center gap-1 font-medium shadow-md transition"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <>
          {mode === 'upload' && (
            <label className={`flex flex-col items-center justify-center ${heightClass} border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-indigo-50/40 transition group`}>
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 mb-1 transition" />
              <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600">Click or drag image file</span>
              <span className="text-[11px] text-slate-400">JPG, PNG, WebP up to 5MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          )}

          {mode === 'presets' && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Select a high-resolution curated image:</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {PRESETS[presetCategory].map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onChange(presetUrl)}
                    className="relative h-16 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-indigo-500 transition group"
                  >
                    <img src={presetUrl} alt="Preset" className="w-full h-full object-cover group-hover:scale-105 transition" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'url' && (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition"
              >
                <Check className="w-3.5 h-3.5" /> Apply
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
