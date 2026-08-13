import React, { useState } from 'react';
import { Plus, Flame, Sparkles, Check, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { MenuItem, Language } from '../types';
import { i18nDict } from '../lib/i18n';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, selectedOptions?: Record<string, string>, instructions?: string) => void;
  language: Language;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart, language }) => {
  const t = i18nDict[language];
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Default options setup
  React.useEffect(() => {
    if (item.options) {
      const initial: Record<string, string> = {};
      item.options.forEach((opt) => {
        if (opt.choices.length > 0) {
          initial[opt.name] = opt.choices[0].label;
        }
      });
      setSelectedOptions(initial);
    }
  }, [item]);

  const handleDirectAdd = () => {
    if (!item.isAvailable || item.stock <= 0) return;

    if (item.options && item.options.length > 0) {
      setIsOptionModalOpen(true);
      return;
    }

    onAddToCart(item);
    triggerAnimation();
  };

  const handleModalConfirmAdd = () => {
    onAddToCart(item, selectedOptions, specialInstructions);
    setIsOptionModalOpen(false);
    triggerAnimation();
  };

  const triggerAnimation = () => {
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const isSoldOut = !item.isAvailable || item.stock <= 0;
  const isLowStock = item.stock > 0 && item.stock <= 5;

  return (
    <>
      <div
        className={`bg-white border-2 rounded-3xl overflow-hidden shadow-sm transition-all flex flex-col justify-between ${
          isSoldOut
            ? 'border-slate-200 opacity-70'
            : 'border-orange-100 hover:border-orange-300 hover:shadow-md'
        }`}
      >
        <div>
          {/* Item Image Header with Badges */}
          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
            <img
              src={item.image}
              alt={item.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isSoldOut ? 'grayscale filter blur-[1px]' : 'hover:scale-105'
              }`}
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Sold Out Banner Overlay */}
            {isSoldOut && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
                <span className="bg-red-600 text-white font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl shadow-xl border border-red-400">
                  {t.soldOut}
                </span>
              </div>
            )}

            {/* Popular / Stock Tag */}
            {!isSoldOut && item.popularTag && (
              <div className="absolute top-3 left-3 bg-orange-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-white" />
                <span>{item.popularTag}</span>
              </div>
            )}

            {/* Low Stock Alert */}
            {!isSoldOut && isLowStock && (
              <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-red-300 animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                <span>{t.onlyLeft.replace('{count}', String(item.stock))}</span>
              </div>
            )}

            {/* Price Badge */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-orange-600 font-mono font-black text-base px-3 py-1 rounded-xl border border-orange-100 shadow-sm">
              £{item.price.toFixed(2)}
            </div>
          </div>

          {/* Item Info Content */}
          <div className="p-5 space-y-3">
            {/* Dietary Badges */}
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold uppercase tracking-wider">
              {item.dietary.isHalal && (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                  {t.dietaryHalal}
                </span>
              )}
              {item.dietary.isVegan && (
                <span className="bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded-md">
                  {t.dietaryVegan}
                </span>
              )}
              {item.dietary.isGlutenFree && (
                <span className="bg-orange-100 text-orange-800 border border-orange-200 px-2 py-0.5 rounded-md">
                  {t.dietaryGF}
                </span>
              )}
              {item.dietary.isSpicy && (
                <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 fill-red-600" />
                  {t.dietarySpicy}
                </span>
              )}
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1 ml-auto font-bold">
                <Clock className="w-2.5 h-2.5" />
                {item.prepTimeMins} mins
              </span>
            </div>

            {/* Dish Name */}
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {item.name}
            </h3>

            {/* Dish Description */}
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
              {item.description}
            </p>
          </div>
        </div>

        {/* Action Add Button */}
        <div className="p-5 pt-0">
          <button
            onClick={handleDirectAdd}
            disabled={isSoldOut}
            className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              addedAnimation
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                : isSoldOut
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-orange-100 hover:bg-orange-500 text-orange-800 hover:text-white border border-orange-200 active:scale-98 shadow-sm font-black'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-white stroke-[3]" />
                <span>Added to Order!</span>
              </>
            ) : isSoldOut ? (
              <span>{t.soldOut}</span>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>{item.options ? 'Customize & Add' : t.addToOrder}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Customize Options Modal */}
      {isOptionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-orange-100 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative text-slate-900">
            <div className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-2xl object-cover border border-orange-200"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                <p className="text-orange-600 font-mono font-black text-sm">£{item.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Dynamic Options List */}
            {item.options &&
              item.options.map((optGroup) => (
                <div key={optGroup.name} className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {optGroup.name}:
                  </label>
                  <div className="space-y-1.5">
                    {optGroup.choices.map((choice) => {
                      const isChoiceSelected = selectedOptions[optGroup.name] === choice.label;
                      return (
                        <button
                          key={choice.label}
                          onClick={() =>
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [optGroup.name]: choice.label,
                            }))
                          }
                          className={`w-full p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isChoiceSelected
                              ? 'bg-orange-50 border-orange-500 text-orange-800 shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{choice.label}</span>
                          <div className="flex items-center gap-2">
                            {choice.extraPrice > 0 && (
                              <span className="text-orange-600 font-mono font-black">+£{choice.extraPrice.toFixed(2)}</span>
                            )}
                            {isChoiceSelected && <Check className="w-3.5 h-3.5 text-orange-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

            {/* Special Instructions Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Special Kitchen Request:
              </label>
              <input
                type="text"
                placeholder="e.g. Extra hot sauce, no butter on toast..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsOptionModalOpen(false)}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-2xl text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleModalConfirmAdd}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-1 shadow-lg shadow-orange-200"
              >
                <span>Add to Basket</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
