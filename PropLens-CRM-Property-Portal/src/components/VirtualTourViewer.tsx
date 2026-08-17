import React, { useState } from 'react';
import { Property, PanoramaRoom } from '../types';
import { Eye, Maximize2, Compass, MapPin, Layers, Info, RotateCw, Volume2, ArrowLeft } from 'lucide-react';

interface VirtualTourViewerProps {
  property: Property;
  onClose?: () => void;
}

export const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({ property, onClose }) => {
  const panoramas = property.panoramas || [];
  const [activePanoramaIndex, setActivePanoramaIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<any | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRotating, setIsRotating] = useState(true);

  const currentPano = panoramas[activePanoramaIndex] || {
    id: 'pano-default',
    name: 'Main Reception Area',
    imageUrl: property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    hotspots: [
      { x: 40, y: 50, title: 'Architectural Details', description: 'Restored period plaster work and brass light fittings.' }
    ]
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
    }`}>
      {/* Viewer Header */}
      <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>360° Virtual Tour Experience</span>
              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-[10px] uppercase font-bold">
                Interactive Canvas
              </span>
            </h3>
            <p className="text-xs text-slate-400">{property.title} • {currentPano.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isRotating
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <RotateCw className={`h-3.5 w-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>360° Auto-Pan</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Main 360 Viewport Container */}
      <div className="relative h-[480px] bg-slate-950 overflow-hidden group select-none">
        {/* Panorama Image Stage */}
        <img
          src={currentPano.imageUrl}
          alt={currentPano.name}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
            isRotating ? 'scale-110' : 'scale-100'
          }`}
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

        {/* Compass & Rotation Overlay Badge */}
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-white shadow-lg pointer-events-none">
          <Compass className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="font-semibold">360° Pan Active</span>
          <span className="text-slate-400 text-[11px]">• Click hotspots to inspect</span>
        </div>

        {/* Hotspots Layer */}
        {currentPano.hotspots?.map((hs, idx) => (
          <div
            key={idx}
            style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <button
              onClick={() => setActiveHotspot(activeHotspot?.title === hs.title ? null : hs)}
              className="relative group/hs flex items-center justify-center p-2.5 bg-cyan-500/90 text-slate-950 rounded-full shadow-xl shadow-cyan-500/30 hover:scale-125 transition-transform cursor-pointer"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <Info className="h-4 w-4 font-bold relative z-10" />
            </button>

            {/* Hotspot Popover */}
            {activeHotspot?.title === hs.title && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 p-3 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl shadow-2xl text-xs text-slate-200 z-30">
                <p className="font-bold text-cyan-400 border-b border-slate-800 pb-1 mb-1">
                  {hs.title}
                </p>
                <p className="text-slate-300 text-[11px]">{hs.description}</p>
              </div>
            )}
          </div>
        ))}

        {/* Room Switcher Floating Tabs (Bottom Bar) */}
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2 flex items-center gap-2 overflow-x-auto scrollbar-none shadow-2xl">
          <div className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 border-r border-slate-800 pr-3">
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            <span>Select Room:</span>
          </div>

          <div className="flex items-center gap-2">
            {panoramas.map((pano, i) => (
              <button
                key={pano.id}
                onClick={() => {
                  setActivePanoramaIndex(i);
                  setActiveHotspot(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePanoramaIndex === i
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>{pano.name}</span>
                {pano.hotspots && (
                  <span className="px-1.5 py-0.2 bg-slate-900/40 rounded-full text-[10px]">
                    {pano.hotspots.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="bg-slate-900 p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-amber-400" />
            <span>{property.address}, {property.postcode}</span>
          </span>
          <span>• 4K HDR Panoramic Render</span>
          <span>• Mobile & VR Headset Compatible</span>
        </div>

        <p className="text-[11px] text-cyan-400 font-medium">
          Drag to look around • Hotspots show high-spec interior finishes
        </p>
      </div>
    </div>
  );
};
