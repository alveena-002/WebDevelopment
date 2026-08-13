import React, { useState } from 'react';
import { ChefHat, Clock, CheckCircle2, AlertTriangle, RefreshCw, Radio, Utensils, Volume2, Plus, Minus, Power } from 'lucide-react';
import { Order, MenuItem, Language } from '../types';
import { i18nDict } from '../lib/i18n';

interface KitchenKdsViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  menuItems: MenuItem[];
  onUpdateStock: (itemId: string, newStock: number, isAvailable: boolean) => void;
  language: Language;
}

export const KitchenKdsView: React.FC<KitchenKdsViewProps> = ({
  orders,
  onUpdateOrderStatus,
  menuItems,
  onUpdateStock,
  language,
}) => {
  const t = i18nDict[language];
  const [activeTab, setActiveTab] = useState<'tickets' | 'stock'>('tickets');
  const [audioEnabled, setAudioEnabled] = useState(true);

  const receivedOrders = orders.filter((o) => o.status === 'Received');
  const preparingOrders = orders.filter((o) => o.status === 'Preparing');
  const readyOrders = orders.filter((o) => o.status === 'Ready');
  const servedOrders = orders.filter((o) => o.status === 'Served');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-900">
      {/* Header bar */}
      <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{t.kitchenKDS}</h1>
            <p className="text-xs text-slate-500 font-medium">Live POS Order Ticket Board & Dynamic Stock Controller</p>
          </div>
        </div>

        {/* View Switcher & Audio toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2.5 rounded-2xl border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              audioEnabled ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Chime Alert</span>
          </button>

          <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex gap-1">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tickets'
                  ? 'bg-orange-500 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Order Tickets ({orders.filter((o) => o.status !== 'Served').length})
            </button>

            <button
              onClick={() => setActiveTab('stock')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'stock'
                  ? 'bg-orange-500 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Live Menu Stock ({menuItems.filter((m) => m.stock <= 3).length} Low)
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'tickets' ? (
        /* Kanban Columns */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Column 1: Received */}
          <div className="bg-white border-2 border-orange-100 rounded-3xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Received ({receivedOrders.length})</span>
              </h3>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {receivedOrders.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8 font-medium">No new tickets</p>
              ) : (
                receivedOrders.map((ord) => (
                  <div key={ord.id} className="bg-slate-50 p-4 rounded-2xl border border-rose-200 space-y-3 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-orange-600 font-mono font-black text-sm">{ord.orderNumber}</span>
                        <p className="text-xs font-black text-slate-900 uppercase font-mono">{ord.tableNumber}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(ord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-700 font-medium divide-y divide-slate-200">
                      {ord.items.map((it, i) => (
                        <div key={i} className="pt-1 first:pt-0 flex justify-between">
                          <span>{it.quantity}x {it.name}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Preparing')}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl text-xs cursor-pointer shadow-sm"
                    >
                      Start Preparing 👨‍🍳
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: Preparing */}
          <div className="bg-white border-2 border-orange-100 rounded-3xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5" />
                <span>Preparing ({preparingOrders.length})</span>
              </h3>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {preparingOrders.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8 font-medium">Kitchen clear</p>
              ) : (
                preparingOrders.map((ord) => (
                  <div key={ord.id} className="bg-slate-50 p-4 rounded-2xl border border-orange-200 space-y-3 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-orange-600 font-mono font-black text-sm">{ord.orderNumber}</span>
                        <p className="text-xs font-black text-slate-900 uppercase font-mono">{ord.tableNumber}</p>
                      </div>
                      <span className="text-[10px] text-orange-700 font-bold bg-orange-100 px-2 py-0.5 rounded">
                        In Oven
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-700 font-medium divide-y divide-slate-200">
                      {ord.items.map((it, i) => (
                        <div key={i} className="pt-1 first:pt-0 flex justify-between">
                          <span>{it.quantity}x {it.name}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Ready')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer shadow-sm"
                    >
                      Mark Ready for Table 🔔
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 3: Ready */}
          <div className="bg-white border-2 border-orange-100 rounded-3xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" />
                <span>Ready ({readyOrders.length})</span>
              </h3>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {readyOrders.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8 font-medium">Pass is clear</p>
              ) : (
                readyOrders.map((ord) => (
                  <div key={ord.id} className="bg-slate-50 p-4 rounded-2xl border border-emerald-200 space-y-3 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-orange-600 font-mono font-black text-sm">{ord.orderNumber}</span>
                        <p className="text-xs font-black text-slate-900 uppercase font-mono">{ord.tableNumber}</p>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded animate-pulse">
                        Plated
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-700 font-medium divide-y divide-slate-200">
                      {ord.items.map((it, i) => (
                        <div key={i} className="pt-1 first:pt-0 flex justify-between">
                          <span>{it.quantity}x {it.name}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Served')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs cursor-pointer shadow-sm"
                    >
                      Complete & Served ✅
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 4: Served History */}
          <div className="bg-white border-2 border-orange-100 rounded-3xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Served ({servedOrders.length})</span>
              </h3>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto opacity-75">
              {servedOrders.map((ord) => (
                <div key={ord.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-900 font-bold">{ord.orderNumber}</span>
                    <span className="text-slate-500">{ord.tableNumber}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">£{ord.totalWithTip.toFixed(2)} Paid</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Real-Time Stock Management Control Panel */
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Dynamic Real-Time Menu Stock Controller</h2>
              <p className="text-xs text-slate-500 font-medium">1-click toggle automatically updates customer phone menus in real time!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((m) => {
              const isOut = !m.isAvailable || m.stock <= 0;
              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    isOut
                      ? 'bg-rose-50 border-rose-200'
                      : m.stock <= 3
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={m.image} alt={m.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono font-medium">
                        Stock: <strong className={isOut ? 'text-rose-600' : 'text-orange-600'}>{m.stock} Units</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Stock modifier buttons */}
                    <button
                      onClick={() => onUpdateStock(m.id, Math.max(0, m.stock - 1), m.stock - 1 > 0)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onUpdateStock(m.id, m.stock + 5, true)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Sold Out Switch */}
                    <button
                      onClick={() => onUpdateStock(m.id, isOut ? 10 : 0, !isOut ? false : true)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isOut
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-rose-600 text-white shadow-sm'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{isOut ? 'Restock (10)' : 'Mark Sold Out'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
