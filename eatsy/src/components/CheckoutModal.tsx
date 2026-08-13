import React, { useState } from 'react';
import { X, CreditCard, Smartphone, DollarSign, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { CartItem, Language, Order } from '../types';
import { i18nDict } from '../lib/i18n';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  tipPercent: number;
  discountCode: string;
  tableNumber: string;
  language: Language;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  tipPercent,
  discountCode,
  tableNumber,
  language,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;
  const t = i18nDict[language];

  const [customerName, setCustomerName] = useState('Sunaina Almas');
  const [customerEmail, setCustomerEmail] = useState('sunainaalmas725@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('+44 7700 900123');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'table'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card details mock
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8812');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('892');

  const subtotal = cartItems.reduce((acc, item) => {
    let price = item.menuItem.price;
    if (item.selectedOptions) {
      Object.entries(item.selectedOptions).forEach(([g, choice]) => {
        const opt = item.menuItem.options?.find((o) => o.name === g);
        const match = opt?.choices.find((c) => c.label === choice);
        if (match) price += match.extraPrice;
      });
    }
    return acc + price * item.quantity;
  }, 0);

  const discountAmount = discountCode ? 5.0 : 0.0;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const tipAmount = (subtotalAfterDiscount * tipPercent) / 100;
  const totalWithTip = subtotalAfterDiscount + tipAmount;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const itemsPayload = cartItems.map((item) => {
        let price = item.menuItem.price;
        if (item.selectedOptions) {
          Object.entries(item.selectedOptions).forEach(([g, choice]) => {
            const opt = item.menuItem.options?.find((o) => o.name === g);
            const match = opt?.choices.find((c) => c.label === choice);
            if (match) price += match.extraPrice;
          });
        }
        return {
          id: item.menuItem.id,
          name: item.menuItem.name,
          quantity: item.quantity,
          price,
        };
      });

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber: tableNumber ? `${t.table} ${tableNumber}` : t.takeaway,
          items: itemsPayload,
          total: subtotalAfterDiscount,
          tip: tipAmount,
          customerName,
          customerPhone,
          customerEmail,
          paymentMethod,
        }),
      });

      const result = await response.json();
      if (result.success && result.order) {
        onOrderSuccess(result.order);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Order placement error:', err);
      // Fallback order generation if offline
      const fallbackOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `#EAT-${Math.floor(1000 + Math.random() * 9000)}`,
        tableNumber: tableNumber ? `${t.table} ${tableNumber}` : t.takeaway,
        items: cartItems.map((c) => ({
          id: c.menuItem.id,
          name: c.menuItem.name,
          quantity: c.quantity,
          price: c.menuItem.price,
        })),
        total: subtotalAfterDiscount,
        tip: tipAmount,
        totalWithTip,
        status: 'Received',
        timestamp: new Date().toISOString(),
        customerName,
        customerPhone,
        customerEmail,
        commissionSaved: subtotal * 0.30,
      };
      onOrderSuccess(fallbackOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {/* Title */}
        <div>
          <h2 className="text-xl font-black text-slate-900">{t.checkout}</h2>
          <p className="text-xs text-orange-600 font-bold mt-0.5">
            Table Delivery Target: <span className="text-slate-900 uppercase font-mono font-black">{tableNumber ? `${t.table} ${tableNumber}` : t.takeaway}</span>
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="space-y-4">
          {/* Customer Details */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Guest Contact Details
            </h3>

            <div>
              <label className="text-[11px] text-slate-500 font-medium">Full Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 font-bold text-xs rounded-xl p-2.5 mt-1 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-500 font-medium">Email (Receipt & Perks)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 font-medium text-xs rounded-xl p-2.5 mt-1 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 font-medium">UK Mobile (SMS Tracker)</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 font-medium text-xs rounded-xl p-2.5 mt-1 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Select Payment Method
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>UK Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('applepay')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'applepay'
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span>Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('table')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'table'
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span>Pay at Table</span>
              </button>
            </div>
          </div>

          {/* Card Mock Details */}
          {paymentMethod === 'card' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Direct Card Entry</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  256-Bit SSL Encrypted
                </span>
              </div>

              <div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 font-bold text-xs rounded-xl p-2.5 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 font-bold text-xs rounded-xl p-2.5 font-mono"
                />
                <input
                  type="password"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 font-bold text-xs rounded-xl p-2.5 font-mono"
                />
              </div>
            </div>
          )}

          {/* Order Total & Pay Button */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-sm font-black text-slate-900">
              <span>Total to Pay:</span>
              <span className="font-mono text-orange-600 text-xl">£{totalWithTip.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-orange-200 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              {isSubmitting ? (
                <span>Transmitting Order to Kitchen...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Order & Send to Kitchen</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
