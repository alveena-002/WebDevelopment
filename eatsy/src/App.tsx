import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GmbBanner } from './components/GmbBanner';
import { TableSelectorModal } from './components/TableSelectorModal';
import { MenuView } from './components/MenuView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { LoyaltyView } from './components/LoyaltyView';
import { ReservationView } from './components/ReservationView';
import { KitchenKdsView } from './components/KitchenKdsView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

import { MenuItem, CartItem, Order, Language } from './types';
import { INITIAL_MENU_ITEMS } from './data/mockMenu';
import { i18nDict } from './lib/i18n';

export default function App() {
  const [activeTab, setActiveTab] = useState<'menu' | 'gmb' | 'book' | 'loyalty' | 'kds' | 'analytics'>('menu');
  const [language, setLanguage] = useState<Language>('en');
  const [tableNumber, setTableNumber] = useState<string>('4'); // Default scanned table

  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const [tipPercent, setTipPercent] = useState<number>(12.5);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string>('');
  const [realtimeConnected, setRealtimeConnected] = useState<boolean>(true);

  // Synchronize RTL layout direction whenever language changes
  useEffect(() => {
    const dir = i18nDict[language].dir;
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  // Initial backend fetch for orders & stock, and establish SSE Real-time event listener
  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch((err) => console.log('Backend sync offline fallback', err));

    fetch('/api/menu/stock')
      .then((res) => res.json())
      .then((data) => {
        if (data.stock) {
          setMenuItems((prev) =>
            prev.map((item) => {
              const live = data.stock[item.id];
              if (live) {
                return { ...item, stock: live.stock, isAvailable: live.isAvailable };
              }
              return item;
            })
          );
        }
      })
      .catch((err) => console.log('Stock sync fallback', err));

    // Subscribe to backend Realtime SSE Stream
    const eventSource = new EventSource('/api/realtime/stream');
    eventSource.onopen = () => setRealtimeConnected(true);
    eventSource.onerror = () => setRealtimeConnected(false);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'STOCK_UPDATED') {
          const { itemId, stock, isAvailable } = payload.data;
          setMenuItems((prev) =>
            prev.map((m) => (m.id === itemId ? { ...m, stock, isAvailable } : m))
          );
        } else if (payload.type === 'ORDER_CREATED') {
          const newOrd = payload.data;
          setOrders((prev) => [newOrd, ...prev.filter((o) => o.id !== newOrd.id)]);
        } else if (payload.type === 'ORDER_STATUS_CHANGED') {
          const { orderId, status } = payload.data;
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status } : o))
          );
          setActiveOrder((prev) => (prev && prev.id === orderId ? { ...prev, status } : prev));
        }
      } catch (err) {
        console.error('SSE Message Error', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Cart Handlers
  const handleAddToCart = (
    item: MenuItem,
    selectedOptions: Record<string, string> = {},
    instructions: string = ''
  ) => {
    const cartItemId = `${item.id}-${JSON.stringify(selectedOptions)}-${instructions}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((c) => c.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          cartItemId,
          menuItem: item,
          quantity: 1,
          selectedOptions,
          specialInstructions: instructions,
        },
      ];
    });
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((c) => (c.cartItemId === cartItemId ? { ...c, quantity: newQty } : c))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((c) => c.cartItemId !== cartItemId));
  };

  const handleProceedToCheckout = (tipPct: number, discountCode: string) => {
    setTipPercent(tipPct);
    setAppliedDiscountCode(discountCode);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsOrderTrackerOpen(true);
  };

  // Kitchen KDS status change handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      await fetch('/api/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update status on backend', err);
    }
  };

  // Kitchen KDS stock update handler
  const handleUpdateStock = async (itemId: string, newStock: number, isAvailable: boolean) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, stock: newStock, isAvailable } : m))
    );

    try {
      await fetch('/api/menu/stock/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, stock: newStock, isAvailable }),
      });
    } catch (err) {
      console.error('Failed to update stock on backend', err);
    }
  };

  const cartCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, c) => {
    let p = c.menuItem.price;
    if (c.selectedOptions) {
      Object.entries(c.selectedOptions).forEach(([g, choice]) => {
        const opt = c.menuItem.options?.find((o) => o.name === g);
        const match = opt?.choices.find((ch) => ch.label === choice);
        if (match) p += match.extraPrice;
      });
    }
    return acc + p * c.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-orange-50/60 text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Header & Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        tableNumber={tableNumber}
        setIsTableModalOpen={setIsTableModalOpen}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        setIsCartOpen={setIsCartOpen}
        realtimeConnected={realtimeConnected}
      />

      {/* Main View Content */}
      <main className="pb-24">
        {activeTab === 'menu' && (
          <>
            <MenuView
              menuItems={menuItems}
              onAddToCart={handleAddToCart}
              language={language}
              tableNumber={tableNumber}
            />
          </>
        )}

        {activeTab === 'gmb' && (
          <GmbBanner
            language={language}
            onOrderNow={() => setActiveTab('menu')}
            onBookTable={() => setActiveTab('book')}
            tableNumber={tableNumber}
          />
        )}

        {activeTab === 'book' && <ReservationView language={language} />}

        {activeTab === 'loyalty' && <LoyaltyView language={language} />}

        {activeTab === 'kds' && (
          <KitchenKdsView
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            menuItems={menuItems}
            onUpdateStock={handleUpdateStock}
            language={language}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsDashboard orders={orders} language={language} />}
      </main>

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
        language={language}
        tableNumber={tableNumber}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        tipPercent={tipPercent}
        discountCode={appliedDiscountCode}
        tableNumber={tableNumber}
        language={language}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        order={activeOrder}
        language={language}
      />

      <TableSelectorModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        selectedTable={tableNumber}
        onSelectTable={setTableNumber}
        language={language}
      />
    </div>
  );
}
