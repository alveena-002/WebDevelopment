import React from 'react';
import { X, QrCode, Check, Utensils, ShoppingBag } from 'lucide-react';
import { Language } from '../types';
import { i18nDict } from '../lib/i18n';

interface TableSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTable: string;
  onSelectTable: (table: string) => void;
  language: Language;
}

export const TableSelectorModal: React.FC<TableSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedTable,
  onSelectTable,
  language,
}) => {
  if (!isOpen) return null;
  const t = i18nDict[language];

  const tableList = [
    '1', '2', '3', '4', '5', '6',
    '7', '8', '9', '10', '11', '12',
    'Bar Counter', 'Outdoor Garden 1', 'Takeaway'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-2 border-orange-100 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-6 text-slate-900">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">{t.changeTable}</h2>
            <p className="text-xs text-slate-500 font-medium">Scan QR Code or tap your table number below</p>
          </div>
        </div>

        {/* Simulated Table QR Tent Card Preview */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="inline-block bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
            {/* SVG QR Code Simulation */}
            <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto">
              <rect width="100" height="100" fill="#ffffff" />
              {/* Corner position squares */}
              <rect x="5" y="5" width="25" height="25" fill="#0f172a" />
              <rect x="9" y="9" width="17" height="17" fill="#ffffff" />
              <rect x="13" y="13" width="9" height="9" fill="#0f172a" />

              <rect x="70" y="5" width="25" height="25" fill="#0f172a" />
              <rect x="74" y="9" width="17" height="17" fill="#ffffff" />
              <rect x="78" y="13" width="9" height="9" fill="#0f172a" />

              <rect x="5" y="70" width="25" height="25" fill="#0f172a" />
              <rect x="9" y="74" width="17" height="17" fill="#ffffff" />
              <rect x="13" y="78" width="9" height="9" fill="#0f172a" />

              {/* Decorative data dots */}
              <rect x="35" y="10" width="6" height="6" fill="#f97316" />
              <rect x="45" y="20" width="12" height="6" fill="#0f172a" />
              <rect x="10" y="40" width="8" height="8" fill="#0f172a" />
              <rect x="35" y="45" width="20" height="10" fill="#0f172a" />
              <rect x="65" y="40" width="25" height="8" fill="#0f172a" />
              <rect x="40" y="65" width="15" height="15" fill="#f97316" />
              <rect x="70" y="70" width="20" height="20" fill="#0f172a" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-black text-orange-600">The Old Bull & Bush</p>
            <p className="text-xs text-slate-600 font-medium">
              Selected Location: <strong className="text-slate-900 font-mono uppercase font-black">{selectedTable.includes('Takeaway') ? selectedTable : `Table ${selectedTable}`}</strong>
            </p>
          </div>
        </div>

        {/* Table Selector Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select Dining Table or Counter:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {tableList.map((tbl) => {
              const isSelected = selectedTable === tbl || selectedTable === tbl.replace('Table ', '');
              return (
                <button
                  key={tbl}
                  onClick={() => {
                    onSelectTable(tbl);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200 scale-105 font-black'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {tbl.includes('Takeaway') ? (
                    <ShoppingBag className="w-4 h-4" />
                  ) : (
                    <Utensils className="w-4 h-4" />
                  )}
                  <span>{tbl.includes('Bar') || tbl.includes('Garden') || tbl.includes('Takeaway') ? tbl : `Table ${tbl}`}</span>
                  {isSelected && <Check className="w-3 h-3 text-white font-black" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            Orders placed will be dispatched straight to your selected table with real-time kitchen tracking.
          </p>
        </div>
      </div>
    </div>
  );
};
