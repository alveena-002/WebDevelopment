import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, HeartHandshake } from 'lucide-react';
import { CartItem, Language } from '../types';
import { i18nDict } from '../lib/i18n';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (tipPercent: number, discountCode: string) => void;
  language: Language;
  tableNumber: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  language,
  tableNumber,
}) => {
  if (!isOpen) return null;
  const t = i18nDict[language];

  const [tipPercent, setTipPercent] = useState<number>(12.5); // Standard UK service charge
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const subtotal = cartItems.reduce((acc, item) => {
    let itemPrice = item.menuItem.price;
    if (item.selectedOptions) {
      Object.entries(item.selectedOptions).forEach(([group, choice]) => {
        const optionGroup = item.menuItem.options?.find((o) => o.name === group);
        const matchChoice = optionGroup?.choices.find((c) => c.label === choice);
        if (matchChoice) itemPrice += matchChoice.extraPrice;
      });
    }
    return acc + itemPrice * item.quantity;
  }, 0);

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code.includes('EATSY') || code === 'WELCOME5' || code === 'REFERRAL5') {
      setAppliedPromo(code);
      setDiscountAmount(5.0); // £5 discount
    } else {
      alert('Invalid code. Try "EATSY5" or "WELCOME5" for £5 off!');
    }
  };

  const calculatedSubtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const tipAmount = (calculatedSubtotalAfterDiscount * tipPercent) / 100;
  const total = calculatedSubtotalAfterDiscount + tipAmount;
  const commissionSaved = subtotal * 0.30; // 30% saved vs Deliveroo

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white border-l-2 border-orange-100 w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t.yourCart}</h2>
              <p className="text-xs text-orange-600 font-bold">
                Target: <span className="text-slate-800 uppercase font-mono font-black">{tableNumber ? `${t.table} ${tableNumber}` : t.takeaway}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-100">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-500 font-bold">Your basket is currently empty.</p>
              <p className="text-xs text-slate-400 font-medium">Add delicious pub classics or craft drinks from the menu!</p>
            </div>
          ) : (
            cartItems.map((item) => {
              let unitPrice = item.menuItem.price;
              if (item.selectedOptions) {
                Object.entries(item.selectedOptions).forEach(([group, choice]) => {
                  const optionGroup = item.menuItem.options?.find((o) => o.name === group);
                  const matchChoice = optionGroup?.choices.find((c) => c.label === choice);
                  if (matchChoice) unitPrice += matchChoice.extraPrice;
                });
              }

              return (
                <div key={item.cartItemId} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.menuItem.name}</h4>
                      {/* Options */}
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          {Object.entries(item.selectedOptions)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' • ')}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-[10px] text-orange-600 italic font-bold mt-0.5">
                          "{item.specialInstructions}"
                        </p>
                      )}
                    </div>

                    <p className="text-xs font-mono font-black text-orange-600">
                      £{(unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">
                      £{unitPrice.toFixed(2)} each
                    </span>

                    <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="text-slate-500 hover:text-slate-800 p-0.5"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-slate-900 font-mono px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="text-slate-500 hover:text-slate-800 p-0.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="text-red-500 hover:text-red-600 p-0.5 ml-1 border-l border-slate-200 pl-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
            {/* Promo Code Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Promo Code (e.g. EATSY5)"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 font-medium text-xs rounded-xl pl-9 pr-3 py-2 uppercase focus:outline-none focus:border-orange-500"
                />
              </div>
              <button
                onClick={handleApplyPromo}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold px-3 rounded-xl border border-orange-200 cursor-pointer"
              >
                Apply
              </button>
            </div>

            {appliedPromo && (
              <div className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs p-2 rounded-xl flex items-center justify-between font-bold">
                <span>Code {appliedPromo} Applied!</span>
                <span>-£5.00</span>
              </div>
            )}

            {/* Staff Service Tip Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5 text-orange-500" />
                  {t.serviceTip} (Optional):
                </span>
                <span className="font-mono font-bold text-orange-600">£{tipAmount.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 10, 12.5, 15].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setTipPercent(pct)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      tipPercent === pct
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pct === 0 ? 'No Tip' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200 font-medium">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-mono">£{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Loyalty Discount</span>
                  <span className="font-mono">-£{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>{t.total}</span>
                <span className="font-mono text-orange-600 text-base">£{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Deliveroo Commission Savings Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 text-center text-xs text-emerald-800 font-bold flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>You saved <strong className="text-emerald-700 font-black">£{commissionSaved.toFixed(2)}</strong> direct app fee!</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => onProceedToCheckout(tipPercent, appliedPromo)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98 text-sm"
            >
              <span>{t.checkout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
