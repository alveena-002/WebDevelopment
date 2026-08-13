import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  changeTable: string;
  table: string;
  takeaway: string;
  orderNow: string;
  bookTable: string;
  searchPlaceholder: string;
  all: string;
  pubClassics: string;
  sundayRoast: string;
  cafeBreakfast: string;
  mainsAsian: string;
  drinksPints: string;
  dietaryHalal: string;
  dietaryVegan: string;
  dietaryGF: string;
  dietarySpicy: string;
  onlyLeft: string;
  soldOut: string;
  addToOrder: string;
  cart: string;
  viewCart: string;
  yourCart: string;
  items: string;
  subtotal: string;
  serviceTip: string;
  total: string;
  deliverooSaved: string;
  checkout: string;
  payWithCard: string;
  payWithApplePay: string;
  payAtTable: string;
  orderStatus: string;
  received: string;
  preparing: string;
  ready: string;
  served: string;
  estimatedWait: string;
  aiLoyalty: string;
  generateAIOffer: string;
  kitchenKDS: string;
  analytics: string;
  gmbBannerTitle: string;
  gmbBannerDesc: string;
  gmbWaitTime: string;
  realtimeStockSync: string;
  pointsBalance: string;
  referralTitle: string;
  copyCode: string;
  codeCopied: string;
  languageName: string;
  dir: 'ltr' | 'rtl';
}

export const i18nDict: Record<Language, Translations> = {
  en: {
    appName: 'Eatsy',
    tagline: 'UK High-Street Restaurant System',
    changeTable: 'Change Table',
    table: 'Table',
    takeaway: 'Takeaway Counter',
    orderNow: 'Order Now',
    bookTable: 'Book a Table',
    searchPlaceholder: 'Search dishes, beers, coffees...',
    all: 'All Menu',
    pubClassics: 'Pub Classics',
    sundayRoast: 'Sunday Roast',
    cafeBreakfast: 'Cafe & Breakfast',
    mainsAsian: 'High-Street Mains',
    drinksPints: 'Pints & Drinks',
    dietaryHalal: 'Halal',
    dietaryVegan: 'Vegan',
    dietaryGF: 'Gluten Free',
    dietarySpicy: 'Spicy',
    onlyLeft: 'Only {count} Left!',
    soldOut: 'Sold Out',
    addToOrder: 'Add to Order',
    cart: 'Order Basket',
    viewCart: 'View Basket',
    yourCart: 'Your Table Basket',
    items: 'items',
    subtotal: 'Subtotal',
    serviceTip: 'Staff Tip',
    total: 'Total to Pay',
    deliverooSaved: 'Saved vs 30% App Fees!',
    checkout: 'Proceed to Checkout',
    payWithCard: 'Pay Direct via Card',
    payWithApplePay: 'Pay with Apple Pay',
    payAtTable: 'Pay Cash/Card at Table',
    orderStatus: 'Live Order Tracker',
    received: 'Order Received',
    preparing: 'In Kitchen',
    ready: 'Ready for Table',
    served: 'Served',
    estimatedWait: 'Est. Prep Time',
    aiLoyalty: 'Smart Loyalty & Rewards',
    generateAIOffer: 'Generate Special Offer',
    kitchenKDS: 'Kitchen Display & Staff POS',
    analytics: 'Revenue & Commission Analytics',
    gmbBannerTitle: 'Found us on Google Maps?',
    gmbBannerDesc: 'Order direct from your table & save high-street apps commission!',
    gmbWaitTime: 'Live Kitchen Wait: 12-15 Mins',
    realtimeStockSync: 'Live Stock Sync Active',
    pointsBalance: 'Eatsy Foodie Points',
    referralTitle: 'Give £5, Get £5 Referral Code',
    copyCode: 'Copy Promo Code',
    codeCopied: 'Code Copied!',
    languageName: 'English',
    dir: 'ltr',
  },
  ur: {
    appName: 'ایٹسی',
    tagline: 'یوکے ہائی اسٹریٹ ریسٹورنٹ سسٹم',
    changeTable: 'ٹیبل تبدیل کریں',
    table: 'ٹیبل',
    takeaway: 'ٹیک اوے کاؤنٹر',
    orderNow: 'آرڈر کریں',
    bookTable: 'ٹیبل بک کریں',
    searchPlaceholder: 'کھانے، چائے، مشروبات تلاش کریں...',
    all: 'تمام مینو',
    pubClassics: 'پب کلاسیک',
    sundayRoast: 'سنڈے روسٹ',
    cafeBreakfast: 'کیفے اور ناشتہ',
    mainsAsian: 'ہائی اسٹریٹ کھانے',
    drinksPints: 'مشروبات اور پینٹ',
    dietaryHalal: 'حلال',
    dietaryVegan: 'ویگن',
    dietaryGF: 'گلوٹین فری',
    dietarySpicy: 'مسالہ دار',
    onlyLeft: 'صرف {count} باقی ہیں!',
    soldOut: 'ختم ہو گیا',
    addToOrder: 'آرڈر میں شامل کریں',
    cart: 'ٹوکری',
    viewCart: 'ٹوکری دیکھیں',
    yourCart: 'آپ کی ٹیبل ٹوکری',
    items: 'اشیاء',
    subtotal: 'ذیلی کل',
    serviceTip: 'اسٹاف ٹپ',
    total: 'کل رقم',
    deliverooSaved: 'ایپ کمیشن پر بچت!',
    checkout: 'ادائیگی کریں',
    payWithCard: 'کارڈ سے ادائیگی',
    payWithApplePay: 'ایپل پے سے ادائیگی',
    payAtTable: 'ٹیبل پر ادائیگی کریں',
    orderStatus: 'لائیو آرڈر ٹریکر',
    received: 'آرڈر موصول ہوا',
    preparing: 'باورچی خانے میں تیار ہو رہا ہے',
    ready: 'ٹیبل کے لیے تیار',
    served: 'پیش کر دیا گیا',
    estimatedWait: 'تخمینی وقت',
    aiLoyalty: 'سمارٹ لائلٹی اور ریوارڈز',
    generateAIOffer: 'خاص پیشکش حاصل کریں',
    kitchenKDS: 'کچن ڈسپلے ڈیش بورڈ',
    analytics: 'آمدنی اور اینالیٹکس',
    gmbBannerTitle: 'گوگل میپس پر تلاش کیا؟',
    gmbBannerDesc: 'براہ راست اپنی ٹیبل سے آرڈر کریں اور کمیشن بچائیں!',
    gmbWaitTime: 'لائیو کچن وقت: 12-15 منٹ',
    realtimeStockSync: 'لائیو اسٹاک سنک فعال',
    pointsBalance: 'ایٹسی پوائنٹس',
    referralTitle: 'ریفرل کوڈ - £5 چھوٹ',
    copyCode: 'کوڈ کاپی کریں',
    codeCopied: 'کوڈ کاپی ہو گیا!',
    languageName: 'اردو',
    dir: 'rtl',
  },
  pl: {
    appName: 'Eatsy',
    tagline: 'System Restauracyjny UK',
    changeTable: 'Zmień Stolik',
    table: 'Stolik',
    takeaway: 'Na Wynos',
    orderNow: 'Zamów Teraz',
    bookTable: 'Zarezerwuj Stolik',
    searchPlaceholder: 'Szukaj dań, piwa, kawy...',
    all: 'Całe Menu',
    pubClassics: 'Klasyki Pubowe',
    sundayRoast: 'Niedzielna Pieczeń',
    cafeBreakfast: 'Kawiarnia i Śniadanie',
    mainsAsian: 'Dania Główne',
    drinksPints: 'Napoje i Piwo',
    dietaryHalal: 'Halal',
    dietaryVegan: 'Wegańskie',
    dietaryGF: 'Bez Glutenu',
    dietarySpicy: 'Ostre',
    onlyLeft: 'Zostało tylko {count}!',
    soldOut: 'Wyprzedane',
    addToOrder: 'Dodaj do Zamówienia',
    cart: 'Koszyk',
    viewCart: 'Zobacz Koszyk',
    yourCart: 'Twój Koszyk Stolika',
    items: 'przedmioty',
    subtotal: 'Suma częściowa',
    serviceTip: 'Napiwek dla Obsługi',
    total: 'Do Zapłaty',
    deliverooSaved: 'Oszczędność na prowizji!',
    checkout: 'Przejdź do Płatności',
    payWithCard: 'Płać Kartą',
    payWithApplePay: 'Płać z Apple Pay',
    payAtTable: 'Płać przy Stoliku',
    orderStatus: 'Śledzenie Zamówienia',
    received: 'Przyjęto Zamówienie',
    preparing: 'W Kuchni',
    ready: 'Gotowe do Wydania',
    served: 'Podane',
    estimatedWait: 'Czas Przygotowania',
    aiLoyalty: 'Program Lojalnościowy',
    generateAIOffer: 'Generuj Ofertę',
    kitchenKDS: 'System Kuchenny KDS',
    analytics: 'Analityka i Przychody',
    gmbBannerTitle: 'Znaleziono w Google Maps?',
    gmbBannerDesc: 'Zamawiaj bezpośrednio ze stolika i oszczędzaj na prowizji!',
    gmbWaitTime: 'Czas oczekiwania: 12-15 minut',
    realtimeStockSync: 'Synchronizacja Magazynu Live',
    pointsBalance: 'Punkty Lojalnościowe Eatsy',
    referralTitle: 'Poleć znajomemu (£5 zniżki)',
    copyCode: 'Kopiuj Kod',
    codeCopied: 'Skopiowano Kod!',
    languageName: 'Polski',
    dir: 'ltr',
  },
  ar: {
    appName: 'إيتسي',
    tagline: 'نظام المطاعم الرقمي في بريطانيا',
    changeTable: 'تغيير الطاولة',
    table: 'طاولة',
    takeaway: 'طلب خارجي',
    orderNow: 'اطلب الآن',
    bookTable: 'احجز طاولة',
    searchPlaceholder: 'ابحث عن الوجبات، القهوة، المشروبات...',
    all: 'القائمة الكاملة',
    pubClassics: 'أطباق حانة كلاسيكية',
    sundayRoast: 'شواء الأحد',
    cafeBreakfast: 'مقاهي وإفطار',
    mainsAsian: 'الأطباق الرئيسية',
    drinksPints: 'مشروبات وعصائر',
    dietaryHalal: 'حلال',
    dietaryVegan: 'نباتي',
    dietaryGF: 'خالي من الجلوتين',
    dietarySpicy: 'حار',
    onlyLeft: 'متبقي {count} فقط!',
    soldOut: 'نفذت الكمية',
    addToOrder: 'أضف إلى الطلب',
    cart: 'السلة',
    viewCart: 'عرض السلة',
    yourCart: 'سلة الطاولة الخاصة بك',
    items: 'عناصر',
    subtotal: 'المجموع الفرعي',
    serviceTip: 'إكرامية الخدمة',
    total: 'المبلغ الإجمالي',
    deliverooSaved: 'وفرت عمولة تطبيقات التوصيل!',
    checkout: 'متابعة الدفع',
    payWithCard: 'الدفع بالبطاقة',
    payWithApplePay: 'الدفع بواسطة Apple Pay',
    payAtTable: 'الدفع عند الطاولة',
    orderStatus: 'تتبع الطلب المباشر',
    received: 'تم استلام الطلب',
    preparing: 'جاري التحضير في المطبخ',
    ready: 'جاهز للتقديم',
    served: 'تم التقديم',
    estimatedWait: 'الوقت المتوقع',
    aiLoyalty: 'نظام الولاء والمكافآت الذكي',
    generateAIOffer: 'إنشاء عرض خاص',
    kitchenKDS: 'شاشة المطبخ ونظام الموظفين',
    analytics: 'تحليلات الإيرادات والعمولات',
    gmbBannerTitle: 'وجدت كافيهنا في خرائط جوجل؟',
    gmbBannerDesc: 'اطلب مباشرة من طاولتك ووفر عمولة التطبيقات!',
    gmbWaitTime: 'وقت الانتظار المباشر: 12-15 دقيقة',
    realtimeStockSync: 'مزامنة المخزون المباشرة نشطة',
    pointsBalance: 'نقاط إيتسي',
    referralTitle: 'كود الإحالة - خصم £5',
    copyCode: 'نسخ الكود',
    codeCopied: 'تم نسخ الكود!',
    languageName: 'العربية',
    dir: 'rtl',
  },
};
