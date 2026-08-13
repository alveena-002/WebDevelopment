import React from 'react';
import { X, CheckCircle2, Clock, ChefHat, Utensils, QrCode, ShieldCheck, Sparkles, Printer } from 'lucide-react';
import { Order, Language } from '../types';
import { i18nDict } from '../lib/i18n';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  language: Language;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  order,
  language,
}) => {
  if (!isOpen || !order) return null;
  const t = i18nDict[language];

  const statusSteps: Array<{ key: Order['status']; label: string; icon: React.ReactNode }> = [
    { key: 'Received', label: t.received, icon: <Clock className="w-4 h-4" /> },
    { key: 'Preparing', label: t.preparing, icon: <ChefHat className="w-4 h-4" /> },
    { key: 'Ready', label: t.ready, icon: <Utensils className="w-4 h-4" /> },
    { key: 'Served', label: t.served, icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);
  const pointsEarned = Math.floor(order.totalWithTip);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-2 border-orange-100 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Real-Time Order Sync Active</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">{t.orderStatus}</h2>
          <p className="text-xs text-orange-600 font-mono font-bold">{order.orderNumber} • {order.tableNumber}</p>
        </div>

        {/* Live Order Status Progress Steps */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Kitchen Progress</span>
            <span className="text-orange-600 animate-pulse font-mono font-black">{order.status}</span>
          </div>

          <div className="relative flex items-center justify-between">
            {/* Progress Bar Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
              }}
            />

            {statusSteps.map((step, idx) => {
              const isDone = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-orange-500 text-white ring-4 ring-orange-200 scale-110 shadow-md font-black'
                        : isDone
                        ? 'bg-orange-500 text-white font-bold'
                        : 'bg-white text-slate-400 border border-slate-300'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold text-center max-w-[70px] ${
                      isDone ? 'text-orange-600' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center text-xs text-slate-700 font-medium">
            <p>
              Est. Kitchen Delivery: <strong className="text-emerald-600 font-mono font-bold">8 – 12 Mins</strong>
            </p>
          </div>
        </div>

        {/* Digital Receipt Card */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <p className="text-xs font-bold text-slate-900">The Old Bull & Bush</p>
              <p className="text-[10px] text-slate-500">Digital Receipt • High St, N1 8ED</p>
            </div>
            <Printer
              className="w-4 h-4 text-slate-400 hover:text-slate-700 cursor-pointer"
              onClick={() => window.print()}
            />
          </div>

          {/* Itemized list */}
          <div className="space-y-2 text-xs divide-y divide-slate-200">
            {order.items.map((it, i) => (
              <div key={i} className="pt-2 first:pt-0 flex justify-between text-slate-700 font-medium">
                <span>
                  {it.quantity}x {it.name}
                </span>
                <span className="font-mono text-orange-600 font-bold">£{(it.price * it.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-3 border-t border-slate-200 space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Food & Drinks Subtotal</span>
              <span className="font-mono">£{order.total.toFixed(2)}</span>
            </div>
            {order.tip > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Staff Service Charge</span>
                <span className="font-mono">£{order.tip.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
              <span>Total Paid</span>
              <span className="font-mono text-orange-600 text-base">£{order.totalWithTip.toFixed(2)}</span>
            </div>
          </div>

          {/* Loyalty & Commission Highlights */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="bg-orange-100 border border-orange-200 p-2.5 rounded-2xl text-center">
              <p className="text-[10px] text-orange-800 uppercase font-bold">Loyalty Points Earned</p>
              <p className="text-base font-black text-orange-600 font-mono">+{pointsEarned} PTS</p>
            </div>

            <div className="bg-emerald-100 border border-emerald-200 p-2.5 rounded-2xl text-center">
              <p className="text-[10px] text-emerald-800 uppercase font-bold">Direct Savings</p>
              <p className="text-base font-black text-emerald-600 font-mono">£{order.commissionSaved.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-2xl text-xs transition-colors cursor-pointer border border-slate-200"
        >
          Keep Tracking in Background
        </button>
      </div>
    </div>
  );
};
