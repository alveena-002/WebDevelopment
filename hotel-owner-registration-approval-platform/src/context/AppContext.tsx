import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Hotel, 
  RoomCategory, 
  Booking, 
  Review, 
  CleaningRequest, 
  CleaningTeam, 
  UserProfile, 
  UserRole,
  NotificationItem,
  HotelStatus,
  HotelCategory,
  BookingStatus,
  CleaningStatus,
  VerificationChecklist,
  SupabaseConfig,
  AuditLogItem
} from '../types';
import { 
  INITIAL_HOTELS, 
  INITIAL_ROOMS, 
  INITIAL_BOOKINGS, 
  INITIAL_REVIEWS, 
  INITIAL_CLEANING_TEAMS, 
  INITIAL_CLEANING_REQUESTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS,
  DEMO_USERS 
} from '../data/seedData';

interface AppContextType {
  // User & Auth
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  switchUserRole: (userId: string) => void;
  registerNewOwner: (name: string, email: string, phone: string) => UserProfile;
  loginUser: (email: string, role?: UserRole, adminPasscode?: string) => { success: boolean; message?: string };
  registerUser: (userData: { name: string; email: string; phone?: string; role: UserRole; adminPasscode?: string; hotelName?: string }) => { success: boolean; message?: string };
  logoutUser: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: (initialRole?: UserRole, initialMode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalInitialRole: UserRole;
  authModalInitialMode: 'login' | 'register';
  
  // Hotels
  hotels: Hotel[];
  activePublicHotels: Hotel[];
  getHotelById: (id: string) => Hotel | undefined;
  getHotelByOwnerId: (ownerId: string) => Hotel | undefined;
  submitHotelRegistration: (data: Partial<Hotel>) => Hotel;
  adminApproveHotel: (hotelId: string, notes?: string) => void;
  adminRejectHotel: (hotelId: string, reason: string) => void;
  adminRequestInfo: (hotelId: string, notes: string) => void;
  adminSuspendHotel: (hotelId: string, reason: string) => void;
  adminReactivateHotel: (hotelId: string) => void;
  adminCreateHotelWithOptions: (hotelData: Partial<Hotel>, ownerInfo: { name: string; email: string; phone: string; isNewAccount: boolean; existingOwnerId?: string }) => Hotel;
  ownerUpdateHotelProfile: (hotelId: string, data: Partial<Hotel>) => void;
  ownerResubmitHotel: (hotelId: string, data: Partial<Hotel>) => void;
  updateVerificationChecklist: (hotelId: string, checklist: Partial<VerificationChecklist>) => void;
  
  // Rooms
  rooms: RoomCategory[];
  getRoomsByHotelId: (hotelId: string) => RoomCategory[];
  addRoomCategory: (hotelId: string, room: Omit<RoomCategory, 'id' | 'hotelId'>) => RoomCategory;
  updateRoomCategory: (roomId: string, room: Partial<RoomCategory>) => void;
  deleteRoomCategory: (roomId: string) => void;
  toggleRoomBlockedDate: (roomId: string, date: string) => void;
  
  // Bookings
  bookings: Booking[];
  getBookingsByHotelId: (hotelId: string) => Booking[];
  getBookingsByGuestId: (guestId: string) => Booking[];
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  updateBookingDetails: (bookingId: string, updates: Partial<Booking>) => void;
  
  // Cleaning Services
  cleaningRequests: CleaningRequest[];
  cleaningTeams: CleaningTeam[];
  getCleaningRequestsByHotelId: (hotelId: string) => CleaningRequest[];
  getEligibleCleaningCredits: (hotelId: string) => { earned: number; used: number; available: number; totalCompletedBookings: number };
  requestCleaningService: (hotelId: string, data: Omit<CleaningRequest, 'id' | 'hotelId' | 'hotelName' | 'requestedBy' | 'status' | 'createdAt' | 'creditsUsed'>) => CleaningRequest;
  adminAssignCleaningTeam: (requestId: string, teamId: string) => void;
  updateCleaningStatus: (requestId: string, status: CleaningStatus) => void;
  
  // Reviews
  reviews: Review[];
  getReviewsByHotelId: (hotelId: string) => Review[];
  addReview: (hotelId: string, review: Omit<Review, 'id' | 'hotelId' | 'createdAt'>) => void;
  replyToReview: (reviewId: string, replyText: string) => void;
  
  // Notifications
  notifications: NotificationItem[];
  userNotifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Favorites & Comparison
  favoriteHotelIds: string[];
  toggleFavoriteHotel: (hotelId: string) => void;
  comparedHotelIds: string[];
  toggleCompareHotel: (hotelId: string) => void;
  clearCompareHotels: () => void;
  resetToDemoData: () => void;

  // Supabase Config
  supabaseConfig: SupabaseConfig;
  updateSupabaseConfig: (config: Partial<SupabaseConfig>) => void;
  
  // Admin Features & Audits
  auditLogs: AuditLogItem[];
  adminUpdateHotelSanitationAndScore: (hotelId: string, sanitationScore: number, category?: HotelCategory, featured?: boolean) => void;
  adminVerifyDocument: (hotelId: string, docId: string, verified: boolean) => void;
  adminProcessPayoutBatch: () => void;

  // Toast Helper
  toastMessage: string | null;
  toastType: 'success' | 'info' | 'error';
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'hotel_platform_state_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or seed
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : DEMO_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_currentUser`);
    return saved ? JSON.parse(saved) : DEMO_USERS[0]; // Admin by default
  });

  const [hotels, setHotels] = useState<Hotel[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_hotels`);
    return saved ? JSON.parse(saved) : INITIAL_HOTELS;
  });

  const [favoriteHotelIds, setFavoriteHotelIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_favorites`);
    return saved ? JSON.parse(saved) : ['hotel_hunza_serai', 'hotel_shangrila_skardu'];
  });

  const [comparedHotelIds, setComparedHotelIds] = useState<string[]>([]);

  const [rooms, setRooms] = useState<RoomCategory[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_rooms`);
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_bookings`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_reviews`);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [cleaningRequests, setCleaningRequests] = useState<CleaningRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cleaning`);
    return saved ? JSON.parse(saved) : INITIAL_CLEANING_REQUESTS;
  });

  const [cleaningTeams] = useState<CleaningTeam[]>(INITIAL_CLEANING_TEAMS);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_auditLogs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_supabase`);
    return saved ? JSON.parse(saved) : {
      connected: false,
      projectUrl: 'https://xyzcompany.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_hotel_platform',
    };
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('info');

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_hotels`, JSON.stringify(hotels));
  }, [hotels]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_rooms`, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_bookings`, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_reviews`, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_cleaning`, JSON.stringify(cleaningRequests));
  }, [cleaningRequests]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_auditLogs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_supabase`, JSON.stringify(supabaseConfig));
  }, [supabaseConfig]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_favorites`, JSON.stringify(favoriteHotelIds));
  }, [favoriteHotelIds]);

  const logAuditActivity = (
    action: string, 
    target: string, 
    category: AuditLogItem['category'], 
    details?: string
  ) => {
    const logItem: AuditLogItem = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      adminName: currentUser.role === 'admin' ? currentUser.name : 'System Auditor',
      action,
      target,
      category,
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs(prev => [logItem, ...prev]);
  };

  const adminUpdateHotelSanitationAndScore = (
    hotelId: string, 
    sanitationScore: number, 
    category?: HotelCategory, 
    featured?: boolean
  ) => {
    setHotels(prev => prev.map(h => {
      if (h.id === hotelId) {
        const updated = {
          ...h,
          sanitationScore,
          category: category || h.category,
          featured: featured !== undefined ? featured : h.featured
        };
        return updated;
      }
      return h;
    }));

    const hotel = hotels.find(h => h.id === hotelId);
    if (hotel) {
      logAuditActivity(
        'Updated Sanitation Score & Quality Tier',
        hotel.name,
        'sanitation',
        `Sanitation score set to ${sanitationScore}%. Category: ${category || hotel.category}. Featured: ${featured ? 'Yes' : 'No'}.`
      );
    }
    showToast(`Updated sanitation score to ${sanitationScore}% and verified quality credentials!`, 'success');
  };

  const adminVerifyDocument = (hotelId: string, docId: string, verified: boolean) => {
    setHotels(prev => prev.map(h => {
      if (h.id === hotelId) {
        return {
          ...h,
          documents: h.documents.map(d => d.id === docId ? { ...d, verified } : d)
        };
      }
      return h;
    }));

    const hotel = hotels.find(h => h.id === hotelId);
    const doc = hotel?.documents.find(d => d.id === docId);
    if (hotel && doc) {
      logAuditActivity(
        verified ? 'Verified Legal Document' : 'Revoked Document Verification',
        `${hotel.name} — ${doc.name}`,
        'document',
        `Document ${doc.name} (${doc.type}) marked as ${verified ? 'Verified Official' : 'Unverified'}.`
      );
    }
    showToast(`Document ${verified ? 'verified and sealed' : 'unverified'}.`, 'info');
  };

  const adminProcessPayoutBatch = () => {
    const totalPending = bookings
      .filter(b => b.status !== 'Cancelled' && b.status !== 'Rejected')
      .reduce((sum, b) => sum + (b.totalAmount * 0.85), 0);

    logAuditActivity(
      'Executed Automated Partner Payout Settlement Batch',
      `All Verified Hotels ($${totalPending.toLocaleString()})`,
      'payout',
      `Transferred 85% net earnings ($${totalPending.toLocaleString()}) to bank accounts across ${hotels.length} partner properties. Reference #PAY-BATCH-${Date.now().toString().slice(-6)}`
    );

    showToast(`Settlement batch of $${totalPending.toLocaleString()} successfully processed and receipts dispatched!`, 'success');
  };

  const toggleFavoriteHotel = (hotelId: string) => {
    setFavoriteHotelIds(prev => {
      const exists = prev.includes(hotelId);
      const updated = exists ? prev.filter(id => id !== hotelId) : [...prev, hotelId];
      showToast(exists ? 'Removed from saved wishlist' : 'Added to saved wishlist ❤️', exists ? 'info' : 'success');
      return updated;
    });
  };

  const toggleCompareHotel = (hotelId: string) => {
    setComparedHotelIds(prev => {
      if (prev.includes(hotelId)) {
        return prev.filter(id => id !== hotelId);
      }
      if (prev.length >= 3) {
        showToast('You can compare up to 3 hotels at a time.', 'info');
        return prev;
      }
      showToast('Hotel added to comparison tray', 'success');
      return [...prev, hotelId];
    });
  };

  const clearCompareHotels = () => {
    setComparedHotelIds([]);
    showToast('Comparison cleared', 'info');
  };

  const resetToDemoData = () => {
    setHotels(INITIAL_HOTELS);
    setRooms(INITIAL_ROOMS);
    setBookings(INITIAL_BOOKINGS);
    setReviews(INITIAL_REVIEWS);
    setUsers(DEMO_USERS);
    setCleaningRequests(INITIAL_CLEANING_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setFavoriteHotelIds(['hotel_hunza_serai', 'hotel_shangrila_skardu']);
    setComparedHotelIds([]);
    showToast('Showcase reset to rich demonstration seed data!', 'success');
  };

  // Helper notification creator
  const addNotification = (userId: string, title: string, message: string, type: NotificationItem['type'], linkTo?: string) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title,
      message,
      type,
      linkTo,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Auth & Session Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<UserRole>('guest');
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (initialRole: UserRole = 'guest', initialMode: 'login' | 'register' = 'login') => {
    setAuthModalInitialRole(initialRole);
    setAuthModalInitialMode(initialMode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Switch User
  const switchUserRole = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      showToast(`Switched active view to ${found.name} (${found.role.toUpperCase()})`, 'info');
    }
  };

  const loginUser = (email: string, role?: UserRole, adminPasscode?: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    if (role === 'admin' && adminPasscode && adminPasscode !== 'ADMIN2026') {
      return { success: false, message: 'Invalid Admin Security Key. Master code is "ADMIN2026".' };
    }

    let matchedUser = users.find(u => u.email.toLowerCase() === normalizedEmail);
    
    if (!matchedUser) {
      const targetRole = role || 'guest';
      matchedUser = {
        id: `usr_${targetRole}_${Date.now()}`,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Verified User',
        email: normalizedEmail,
        role: targetRole,
        avatar: targetRole === 'admin' 
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
          : targetRole === 'owner'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      };
      setUsers(prev => [matchedUser!, ...prev]);
    } else if (role && matchedUser.role !== role) {
      matchedUser = { ...matchedUser, role };
      setUsers(prev => prev.map(u => u.id === matchedUser!.id ? matchedUser! : u));
    }

    setCurrentUser(matchedUser);
    showToast(`Signed in successfully as ${matchedUser.name} (${matchedUser.role.toUpperCase()})`, 'success');
    return { success: true };
  };

  const registerUser = (userData: { name: string; email: string; phone?: string; role: UserRole; adminPasscode?: string; hotelName?: string }) => {
    const normalizedEmail = userData.email.trim().toLowerCase();
    
    if (userData.role === 'admin' && userData.adminPasscode !== 'ADMIN2026') {
      return { success: false, message: 'Invalid Admin Security Code. Required: ADMIN2026' };
    }

    const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      setCurrentUser(existing);
      showToast(`Account already exists. Signed in as ${existing.name}!`, 'info');
      return { success: true };
    }

    const newUser: UserProfile = {
      id: `usr_${userData.role}_${Date.now()}`,
      name: userData.name,
      email: normalizedEmail,
      phone: userData.phone,
      role: userData.role,
      avatar: userData.role === 'admin' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : userData.role === 'owner'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    showToast(`Registered successfully! Welcome, ${newUser.name}.`, 'success');
    return { success: true };
  };

  const logoutUser = () => {
    const guestUser: UserProfile = {
      id: `guest_anon_${Date.now()}`,
      name: 'Guest Traveler',
      email: 'guest@hotelplatform.com',
      role: 'guest',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(guestUser);
    showToast('Logged out of session', 'info');
  };

  const registerNewOwner = (name: string, email: string, phone: string): UserProfile => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return existing;
    }
    const newOwner: UserProfile = {
      id: `user_owner_${Date.now()}`,
      name,
      email,
      phone,
      role: 'owner',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newOwner]);
    return newOwner;
  };

  // Filter public visible hotels
  const activePublicHotels = hotels.filter(h => h.status === 'Approved' || h.status === 'Active');

  const getHotelById = (id: string) => hotels.find(h => h.id === id);
  const getHotelByOwnerId = (ownerId: string) => hotels.find(h => h.ownerId === ownerId);

  // Option 2: Hotel Owner Registration Request
  const submitHotelRegistration = (data: Partial<Hotel>): Hotel => {
    // Check if current user is owner or create owner
    let owner = currentUser;
    if (currentUser.role !== 'owner') {
      owner = registerNewOwner(
        data.businessOwnerName || 'New Hotel Partner',
        data.email || 'partner@hotel.com',
        data.phone || '+92 300 0000000'
      );
    }

    const newHotelId = `hotel_${Date.now()}`;
    const newHotel: Hotel = {
      id: newHotelId,
      name: data.name || 'Untitled Hotel',
      businessOwnerName: data.businessOwnerName || owner.name,
      email: data.email || owner.email,
      phone: data.phone || owner.phone || '+92 300 0000000',
      address: data.address || '',
      city: data.city || 'Islamabad',
      country: data.country || 'Pakistan',
      googleMapsLocation: data.googleMapsLocation || { lat: 33.6844, lng: 73.0479, addressLookup: 'Islamabad' },
      description: data.description || '',
      numberOfRooms: data.numberOfRooms || 10,
      category: data.category || '3-Star Hotel',
      logoUrl: data.logoUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&auto=format&fit=crop&q=80',
      coverImageUrl: data.coverImageUrl || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80',
      galleryImages: data.galleryImages && data.galleryImages.length > 0 
        ? data.galleryImages 
        : [data.coverImageUrl || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80'],
      documents: data.documents || [],
      status: 'Pending Approval',
      verification: {
        licenseVerified: false,
        cnicVerified: false,
        locationVerified: false,
        photosVerified: false,
      },
      ownerId: owner.id,
      createdAt: new Date().toISOString(),
      statusUpdatedAt: new Date().toISOString(),
      averageRating: 0,
      reviewCount: 0,
    };

    // Update owner's hotelId
    const updatedOwner = { ...owner, hotelId: newHotelId };
    setUsers(prev => prev.map(u => u.id === owner.id ? updatedOwner : u));
    setCurrentUser(updatedOwner);

    setHotels(prev => [newHotel, ...prev]);

    // Create default sample room for owner
    const defaultRoom: RoomCategory = {
      id: `room_${newHotelId}_1`,
      hotelId: newHotelId,
      name: 'Deluxe Queen Room',
      description: 'Comfortable spacious room with air conditioning, premium linen, and complimentary Wi-Fi.',
      categoryType: 'Deluxe',
      pricePerNight: 95,
      totalRooms: data.numberOfRooms || 10,
      maxGuests: 2,
      bedType: '1 Queen Bed',
      sizeSqFt: 350,
      amenities: ['wifi', 'ac', 'breakfast', 'tv'],
      photos: [newHotel.coverImageUrl],
      isAvailable: true,
      blockedDates: [],
    };
    setRooms(prev => [...prev, defaultRoom]);

    // Notify Admin
    addNotification(
      'user_admin_1',
      'New Hotel Registration Request',
      `"${newHotel.name}" submitted by ${newHotel.businessOwnerName} in ${newHotel.city}. Requires verification and approval.`,
      'approval',
      'admin-pending'
    );

    showToast('Registration submitted successfully! Your application is now in Pending Approval.', 'success');
    return newHotel;
  };

  // Option 1: Admin Adds Hotel & Assigns Owner
  const adminCreateHotelWithOptions = (
    hotelData: Partial<Hotel>, 
    ownerInfo: { name: string; email: string; phone: string; isNewAccount: boolean; existingOwnerId?: string }
  ): Hotel => {
    let ownerId = ownerInfo.existingOwnerId;
    if (ownerInfo.isNewAccount || !ownerId) {
      const newOwner = registerNewOwner(ownerInfo.name, ownerInfo.email, ownerInfo.phone);
      ownerId = newOwner.id;
    }

    const newHotelId = `hotel_adm_${Date.now()}`;
    const newHotel: Hotel = {
      id: newHotelId,
      name: hotelData.name || 'Grand Premier Hotel',
      businessOwnerName: hotelData.businessOwnerName || ownerInfo.name,
      email: hotelData.email || ownerInfo.email,
      phone: hotelData.phone || ownerInfo.phone,
      address: hotelData.address || 'Commercial Area',
      city: hotelData.city || 'Islamabad',
      country: hotelData.country || 'Pakistan',
      googleMapsLocation: hotelData.googleMapsLocation || { lat: 33.6844, lng: 73.0479, addressLookup: 'Islamabad' },
      description: hotelData.description || 'Verified property curated directly by Platform Administration.',
      numberOfRooms: hotelData.numberOfRooms || 20,
      category: hotelData.category || '4-Star Hotel',
      logoUrl: hotelData.logoUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&auto=format&fit=crop&q=80',
      coverImageUrl: hotelData.coverImageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80',
      galleryImages: hotelData.galleryImages || ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80'],
      documents: hotelData.documents || [],
      status: 'Approved',
      verification: {
        licenseVerified: true,
        cnicVerified: true,
        locationVerified: true,
        photosVerified: true,
        reviewedByAdmin: currentUser.name,
        reviewedAt: new Date().toISOString(),
      },
      ownerId: ownerId!,
      createdAt: new Date().toISOString(),
      statusUpdatedAt: new Date().toISOString(),
      averageRating: 5.0,
      reviewCount: 1,
    };

    // Update owner with hotelId
    setUsers(prev => prev.map(u => u.id === ownerId ? { ...u, hotelId: newHotelId } : u));
    setHotels(prev => [newHotel, ...prev]);

    // Add default room
    const defaultRoom: RoomCategory = {
      id: `room_${newHotelId}_1`,
      hotelId: newHotelId,
      name: 'Executive King Suite',
      description: 'Fully furnished executive suite with work lounge, high speed wifi, and ensuite bathroom.',
      categoryType: 'Executive',
      pricePerNight: 120,
      totalRooms: newHotel.numberOfRooms,
      maxGuests: 2,
      bedType: '1 King Bed',
      sizeSqFt: 480,
      amenities: ['wifi', 'ac', 'breakfast', 'minibar', 'tv', 'workspace'],
      photos: [newHotel.coverImageUrl],
      isAvailable: true,
      blockedDates: [],
    };
    setRooms(prev => [...prev, defaultRoom]);

    // Send credentials notification to owner
    addNotification(
      ownerId!,
      'Your Hotel Profile is Created & Active',
      `Admin created and assigned "${newHotel.name}" to your account. You can now manage rooms, calendar, and bookings!`,
      'approval',
      'owner-dashboard'
    );

    showToast(`Hotel created and successfully assigned to ${ownerInfo.name}!`, 'success');
    return newHotel;
  };

  // Admin Approve
  const adminApproveHotel = (hotelId: string, notes?: string) => {
    setHotels(prev => prev.map(h => {
      if (h.id === hotelId) {
        return {
          ...h,
          status: 'Approved',
          adminNotes: notes || h.adminNotes,
          statusUpdatedAt: new Date().toISOString(),
          verification: {
            ...h.verification,
            reviewedByAdmin: currentUser.name,
            reviewedAt: new Date().toISOString(),
            licenseVerified: true,
            cnicVerified: true,
            locationVerified: true,
            photosVerified: true,
          }
        };
      }
      return h;
    }));

    const hotel = hotels.find(h => h.id === hotelId);
    if (hotel) {
      addNotification(
        hotel.ownerId,
        'Congratulations! Hotel Approved',
        `Your hotel "${hotel.name}" has been reviewed and approved by Platform Admin. Your full Hotel Owner Dashboard is now unlocked!`,
        'approval',
        'owner-dashboard'
      );
    }
    showToast('Hotel has been approved and is now live on the platform!', 'success');
  };

  // Admin Reject
  const adminRejectHotel = (hotelId: string, reason: string) => {
    setHotels(prev => prev.map(h => {
      if (h.id === hotelId) {
        return {
          ...h,
          status: 'Rejected',
          rejectionReason: reason,
          statusUpdatedAt: new Date().toISOString(),
          verification: {
            ...h.verification,
            reviewedByAdmin: currentUser.name,
            reviewedAt: new Date().toISOString(),
          }
        };
      }
      return h;
    }));

    const hotel = hotels.find(h => h.id === hotelId);
    if (hotel) {
      addNotification(
        hotel.ownerId,
        'Hotel Registration Rejected',
        `Your application for "${hotel.name}" was not approved: "${reason}". Please review the notes, update your documents/details, and resubmit.`,
        'rejection',
        'owner-resubmit'
      );
    }
    showToast('Application marked as Rejected with provided reasoning.', 'info');
  };

  // Admin Request Additional Info
  const adminRequestInfo = (hotelId: string, notes: string) => {
    setHotels(prev => prev.map(h => {
      if (h.id === hotelId) {
        return {
          ...h,
          adminNotes: notes,
          statusUpdatedAt: new Date().toISOString(),
        };
      }
      return h;
    }));

    const hotel = hotels.find(h => h.id === hotelId);
    if (hotel) {
      addNotification(
        hotel.ownerId,
        'Additional Information Requested',
        `Admin requested information regarding "${hotel.name}": ${notes}`,
        'info',
        'owner-dashboard'
      );
    }
    showToast('Information request sent to hotel owner.', 'info');
  };

  // Admin Suspend
  const adminSuspendHotel = (hotelId: string, reason: string) => {
    setHotels(prev => prev.map(h => {
      if (h.id === hotelId) {
        return {
          ...h,
          status: 'Suspended',
          suspensionReason: reason,
          statusUpdatedAt: new Date().toISOString(),
        };
      }
      return h;
    }));

    const hotel = hotels.find(h => h.id === hotelId);
    if (hotel) {
      addNotification(
        hotel.ownerId,
        'Hotel Suspended',
        `Your property "${hotel.name}" was temporarily suspended: ${reason}`,
        'rejection',
        'owner-dashboard'
      );
    }
    showToast('Hotel has been suspended from public booking.', 'info');
  };

  // Admin Reactivate
  const adminReactivateHotel = (hotelId: string) => {
    setHotels(prev => prev.map(h => {
      if (h.id === hotelId) {
        return {
          ...h,
          status: 'Approved',
          suspensionReason: undefined,
          statusUpdatedAt: new Date().toISOString(),
        };
      }
      return h;
    }));

    const hotel = hotels.find(h => h.id === hotelId);
    if (hotel) {
      addNotification(
        hotel.ownerId,
        'Hotel Reactivated',
        `Your property "${hotel.name}" has been reactivated and is accepting reservations.`,
        'approval',
        'owner-dashboard'
      );
    }
    showToast('Hotel reactivated successfully!', 'success');
  };

  // Owner Update Hotel Profile
  const ownerUpdateHotelProfile = (hotelId: string, data: Partial<Hotel>) => {
    setHotels(prev => prev.map(h => {
      if (h.id === hotelId) {
        return { ...h, ...data, statusUpdatedAt: new Date().toISOString() };
      }
      return h;
    }));
    showToast('Hotel profile updated successfully!', 'success');
  };

  // Owner Resubmit Application (After Rejection)
  const ownerResubmitHotel = (hotelId: string, data: Partial<Hotel>) => {
    setHotels(prev => prev.map(h => {
      if (h.id === hotelId) {
        return {
          ...h,
          ...data,
          status: 'Pending Approval',
          rejectionReason: undefined,
          statusUpdatedAt: new Date().toISOString(),
        };
      }
      return h;
    }));

    const hotel = hotels.find(h => h.id === hotelId);
    addNotification(
      'user_admin_1',
      'Hotel Application Resubmitted',
      `"${hotel?.name || 'Hotel'}" has updated their documents/information and resubmitted for approval.`,
      'approval',
      'admin-pending'
    );
    showToast('Application updated and resubmitted for admin review!', 'success');
  };

  // Update Verification Checklist
  const updateVerificationChecklist = (hotelId: string, checklist: Partial<VerificationChecklist>) => {
    setHotels(prev => prev.map(h => {
      if (h.id === hotelId) {
        return {
          ...h,
          verification: {
            ...h.verification,
            ...checklist,
            reviewedByAdmin: currentUser.name,
            reviewedAt: new Date().toISOString(),
          }
        };
      }
      return h;
    }));
    showToast('Verification items updated.', 'info');
  };

  // Rooms
  const getRoomsByHotelId = (hotelId: string) => rooms.filter(r => r.hotelId === hotelId);

  const addRoomCategory = (hotelId: string, roomData: Omit<RoomCategory, 'id' | 'hotelId'>): RoomCategory => {
    const newRoom: RoomCategory = {
      ...roomData,
      id: `room_${hotelId}_${Date.now()}`,
      hotelId,
      blockedDates: roomData.blockedDates || [],
    };
    setRooms(prev => [...prev, newRoom]);
    showToast(`Room category "${newRoom.name}" added successfully!`, 'success');
    return newRoom;
  };

  const updateRoomCategory = (roomId: string, data: Partial<RoomCategory>) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, ...data } : r));
    showToast('Room category updated.', 'success');
  };

  const deleteRoomCategory = (roomId: string) => {
    setRooms(prev => prev.filter(r => r.id !== roomId));
    showToast('Room category removed.', 'info');
  };

  const toggleRoomBlockedDate = (roomId: string, date: string) => {
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        const blocked = r.blockedDates || [];
        const exists = blocked.includes(date);
        const updated = exists ? blocked.filter(d => d !== date) : [...blocked, date];
        return { ...r, blockedDates: updated };
      }
      return r;
    }));
  };

  // Bookings
  const getBookingsByHotelId = (hotelId: string) => bookings.filter(b => b.hotelId === hotelId);
  const getBookingsByGuestId = (guestId: string) => bookings.filter(b => b.guestId === guestId);

  const createBooking = (bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: `book_${Date.now()}`,
      bookingNumber: `RES-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      isEligibleForCleaningCredit: true,
    };

    setBookings(prev => [newBooking, ...prev]);

    // Notify Hotel Owner
    const hotel = hotels.find(h => h.id === bookingData.hotelId);
    if (hotel) {
      addNotification(
        hotel.ownerId,
        'New Guest Reservation Received',
        `${bookingData.guestName} booked ${bookingData.roomName} for ${bookingData.totalNights} nights ($${bookingData.totalAmount}).`,
        'booking',
        'owner-bookings'
      );
    }

    // Notify Admin
    addNotification(
      'user_admin_1',
      'Platform Booking Confirmed',
      `${bookingData.guestName} completed booking at ${bookingData.hotelName} ($${bookingData.totalAmount}).`,
      'booking'
    );

    showToast(`Booking ${newBooking.bookingNumber} confirmed successfully!`, 'success');
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status };
      }
      return b;
    }));
    showToast(`Reservation status updated to "${status}".`, 'info');
  };

  const updateBookingDetails = (bookingId: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const updated = { ...b, ...updates };
        // Recalculate total if dates or price changed
        if (updates.checkInDate || updates.checkOutDate || updates.pricePerNight) {
          const checkIn = new Date(updated.checkInDate);
          const checkOut = new Date(updated.checkOutDate);
          const diffDays = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));
          updated.totalNights = diffDays;
          if (updated.pricePerNight) {
            updated.totalAmount = diffDays * updated.pricePerNight;
          }
        }
        return updated;
      }
      return b;
    }));
    showToast('Reservation details and schedule updated successfully.', 'success');
  };

  // Free Cleaning Calculation & Requests
  const getCleaningRequestsByHotelId = (hotelId: string) => {
    return cleaningRequests.filter(c => c.hotelId === hotelId);
  };

  // 1 Free cleaning credit earned for every 3 completed bookings!
  const getEligibleCleaningCredits = (hotelId: string) => {
    const hotelBookings = bookings.filter(b => b.hotelId === hotelId && b.status === 'Completed');
    const hotelCleaningReqs = cleaningRequests.filter(c => c.hotelId === hotelId && c.status !== 'Cancelled');
    
    const totalCompletedBookings = hotelBookings.length;
    // 1 credit per 3 completed bookings (minimum 1 initial gift credit for approved hotels)
    const earned = Math.max(1, Math.floor(totalCompletedBookings / 3) + 1);
    const used = hotelCleaningReqs.reduce((acc, req) => acc + req.creditsUsed, 0);
    const available = Math.max(0, earned - used);

    return { earned, used, available, totalCompletedBookings };
  };

  const requestCleaningService = (
    hotelId: string,
    data: Omit<CleaningRequest, 'id' | 'hotelId' | 'hotelName' | 'requestedBy' | 'status' | 'createdAt' | 'creditsUsed'>
  ): CleaningRequest => {
    const hotel = hotels.find(h => h.id === hotelId);
    const newReq: CleaningRequest = {
      ...data,
      id: `clean_req_${Date.now()}`,
      hotelId,
      hotelName: hotel?.name || 'Hotel Property',
      requestedBy: currentUser.name,
      status: 'Requested',
      createdAt: new Date().toISOString(),
      creditsUsed: 1,
    };

    setCleaningRequests(prev => [newReq, ...prev]);

    // Notify Admin
    addNotification(
      'user_admin_1',
      'Complimentary Cleaning Request',
      `${hotel?.name} submitted a cleaning service request for ${data.preferredDate} (${data.cleaningType}). Assign a cleaning crew.`,
      'cleaning',
      'admin-cleaning'
    );

    showToast('Complimentary cleaning service requested! Admin operations team will assign a certified crew.', 'success');
    return newReq;
  };

  const adminAssignCleaningTeam = (requestId: string, teamId: string) => {
    const team = cleaningTeams.find(t => t.id === teamId);
    setCleaningRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Assigned',
          assignedTeamId: teamId,
          assignedTeamName: team?.name,
          assignedTeamPhone: team?.phone,
        };
      }
      return r;
    }));

    const req = cleaningRequests.find(r => r.id === requestId);
    const hotel = hotels.find(h => h.id === req?.hotelId);
    if (hotel && req) {
      addNotification(
        hotel.ownerId,
        'Cleaning Crew Dispatched',
        `"${team?.name}" has been assigned for your cleaning request on ${req.preferredDate}. Team Lead: ${team?.teamLead} (${team?.phone}).`,
        'cleaning',
        'owner-cleaning'
      );
    }
    showToast(`Cleaning crew ${team?.name} assigned to hotel request!`, 'success');
  };

  const updateCleaningStatus = (requestId: string, status: CleaningStatus) => {
    setCleaningRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status,
          completedAt: status === 'Completed' ? new Date().toISOString() : r.completedAt,
        };
      }
      return r;
    }));
    showToast(`Cleaning status updated to "${status}".`, 'info');
  };

  // Reviews
  const getReviewsByHotelId = (hotelId: string) => reviews.filter(r => r.hotelId === hotelId);

  const addReview = (hotelId: string, reviewData: Omit<Review, 'id' | 'hotelId' | 'createdAt'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      hotelId,
      createdAt: new Date().toISOString(),
    };

    setReviews(prev => [newRev, ...prev]);

    // Recalculate hotel average rating
    const existing = reviews.filter(r => r.hotelId === hotelId);
    const all = [...existing, newRev];
    const avg = all.reduce((sum, r) => sum + r.rating, 0) / all.length;
    
    setHotels(prev => prev.map(h => {
      if (h.id === hotelId) {
        return {
          ...h,
          averageRating: Math.round(avg * 10) / 10,
          reviewCount: all.length,
        };
      }
      return h;
    }));

    const hotel = hotels.find(h => h.id === hotelId);
    if (hotel) {
      addNotification(
        hotel.ownerId,
        'New Guest Review Received',
        `${reviewData.guestName} gave a ${reviewData.rating}-star review for your property. You can respond now.`,
        'info',
        'owner-reviews'
      );
    }

    showToast('Review submitted! Thank you for your feedback.', 'success');
  };

  const replyToReview = (reviewId: string, replyText: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          ownerReply: {
            text: replyText,
            repliedAt: new Date().toISOString(),
          }
        };
      }
      return r;
    }));
    showToast('Response to review posted successfully.', 'success');
  };

  // Notifications
  const userNotifications = notifications.filter(n => {
    if (currentUser.role === 'admin') return true;
    return n.userId === currentUser.id;
  });

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const updateSupabaseConfig = (config: Partial<SupabaseConfig>) => {
    setSupabaseConfig(prev => ({ ...prev, ...config }));
    showToast('Supabase configuration updated.', 'success');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      users,
      switchUserRole,
      registerNewOwner,
      loginUser,
      registerUser,
      logoutUser,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      authModalInitialRole,
      authModalInitialMode,
      hotels,
      activePublicHotels,
      getHotelById,
      getHotelByOwnerId,
      submitHotelRegistration,
      adminApproveHotel,
      adminRejectHotel,
      adminRequestInfo,
      adminSuspendHotel,
      adminReactivateHotel,
      adminCreateHotelWithOptions,
      ownerUpdateHotelProfile,
      ownerResubmitHotel,
      updateVerificationChecklist,
      rooms,
      getRoomsByHotelId,
      addRoomCategory,
      updateRoomCategory,
      deleteRoomCategory,
      toggleRoomBlockedDate,
      bookings,
      getBookingsByHotelId,
      getBookingsByGuestId,
      createBooking,
      updateBookingStatus,
      updateBookingDetails,
      cleaningRequests,
      cleaningTeams,
      getCleaningRequestsByHotelId,
      getEligibleCleaningCredits,
      requestCleaningService,
      adminAssignCleaningTeam,
      updateCleaningStatus,
      reviews,
      getReviewsByHotelId,
      addReview,
      replyToReview,
      notifications,
      userNotifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      favoriteHotelIds,
      toggleFavoriteHotel,
      comparedHotelIds,
      toggleCompareHotel,
      clearCompareHotels,
      resetToDemoData,
      supabaseConfig,
      updateSupabaseConfig,
      auditLogs,
      adminUpdateHotelSanitationAndScore,
      adminVerifyDocument,
      adminProcessPayoutBatch,
      toastMessage,
      toastType,
      showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
