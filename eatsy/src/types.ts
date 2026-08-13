export type Language = 'en' | 'ur' | 'pl' | 'ar';

export interface MenuItem {
  id: string;
  name: string;
  category: 'pub-classics' | 'sunday-roast' | 'cafe-breakfast' | 'mains-asian' | 'drinks';
  price: number; // GBP £
  description: string;
  image: string;
  dietary: {
    isHalal?: boolean;
    isVegan?: boolean;
    isVegetarian?: boolean;
    isGlutenFree?: boolean;
    isSpicy?: boolean;
  };
  stock: number;
  isAvailable: boolean;
  prepTimeMins: number;
  popularTag?: string;
  calories?: number;
  options?: Array<{
    name: string;
    choices: Array<{ label: string; extraPrice: number }>;
  }>;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: Record<string, string>;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  total: number;
  tip: number;
  totalWithTip: number;
  status: 'Received' | 'Preparing' | 'Ready' | 'Served';
  timestamp: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentMethod?: string;
  discountCode?: string;
  commissionSaved: number;
}

export interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  partySize: number;
  date: string;
  timeSlot: string;
  tablePreference: 'Indoor Pub' | 'Glass Garden' | 'Leather Booth' | 'High Bar Table';
  specialRequests?: string;
  status: 'Confirmed' | 'Seated' | 'Cancelled';
  createdAt: string;
}

export interface LoyaltyProfile {
  customerName: string;
  phone: string;
  email: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
  referralCode: string;
  visitCount: number;
  totalSaved: number;
}

export interface MarketingLog {
  id: string;
  channel: 'SMS' | 'Email';
  recipient: string;
  offerCode: string;
  messageText: string;
  status: 'Delivered' | 'Queued';
  timestamp: string;
}
