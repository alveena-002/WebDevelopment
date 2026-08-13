import React, { useState } from 'react';
import { Search, Flame, Sparkles, Filter, RefreshCw, CheckCircle2 } from 'lucide-react';
import { MenuItem, Language } from '../types';
import { MenuItemCard } from './MenuItemCard';
import { i18nDict } from '../lib/i18n';

interface MenuViewProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, selectedOptions?: Record<string, string>, instructions?: string) => void;
  language: Language;
  tableNumber: string;
}

export const MenuView: React.FC<MenuViewProps> = ({
  menuItems,
  onAddToCart,
  language,
  tableNumber,
}) => {
  const t = i18nDict[language];
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterHalal, setFilterHalal] = useState<boolean>(false);
  const [filterVegan, setFilterVegan] = useState<boolean>(false);
  const [filterGF, setFilterGF] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: t.all },
    { id: 'pub-classics', label: t.pubClassics },
    { id: 'sunday-roast', label: t.sundayRoast },
    { id: 'mains-asian', label: t.mainsAsian },
    { id: 'cafe-breakfast', label: t.cafeBreakfast },
    { id: 'drinks', label: t.drinksPints },
  ];

  const filteredItems = menuItems.filter((item) => {
    // Category check
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;

    // Search check
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Dietary filters
    if (filterHalal && !item.dietary.isHalal) return false;
    if (filterVegan && !item.dietary.isVegan) return false;
    if (filterGF && !item.dietary.isGlutenFree) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Search & Dietary Filters Bar */}
      <div className="bg-white border-2 border-orange-100 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-orange-500 font-medium transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Dietary Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setFilterHalal(!filterHalal)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ${
                filterHalal
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <span>{t.dietaryHalal}</span>
              {filterHalal && <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setFilterVegan(!filterVegan)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ${
                filterVegan
                  ? 'bg-green-100 text-green-800 border-green-300 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <span>{t.dietaryVegan}</span>
              {filterVegan && <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setFilterGF(!filterGF)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ${
                filterGF
                  ? 'bg-orange-100 text-orange-800 border-orange-300 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <span>{t.dietaryGF}</span>
              {filterGF && <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-orange-100/80 pt-3 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-12 text-center space-y-3 shadow-sm">
          <Filter className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No dishes found matching your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            Try resetting your dietary search tags or choosing another category above.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setFilterHalal(false);
              setFilterVegan(false);
              setFilterGF(false);
            }}
            className="bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-orange-600 transition-colors cursor-pointer shadow-md shadow-orange-200"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
              language={language}
            />
          ))}
        </div>
      )}
    </div>
  );
};
