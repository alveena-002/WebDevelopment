export type UserRole = 'admin' | 'owner' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  hotelId?: string; // If owner, assigned hotel id
  createdAt: string;
}

export type HotelStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Active' | 'Suspended' | 'Rejected';

export type HotelCategory = 
  | '1-Star Hotel'
  | '2-Star Hotel'
  | '3-Star Hotel'
  | '4-Star Hotel'
  | '5-Star Luxury'
  | 'Boutique Hotel'
  | 'Guest House'
  | 'Serviced Apartment'
  | 'Resort & Spa'
  | 'Heritage Villa';

export interface HotelDocument {
  id: string;
  name: string;
  type: 'business_license' | 'cnic_front' | 'cnic_back' | 'tax_cert' | 'other';
  url: string;
  fileSize?: string;
  uploadedAt: string;
  verified?: boolean;
}

export interface Coordinates {
  lat: number;
  lng: number;
  addressLookup?: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string; // lucide icon identifier
  category: 'general' | 'room' | 'wellness' | 'dining';
}

export interface RoomCategory {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  categoryType: 'Standard' | 'Deluxe' | 'Executive' | 'Suite' | 'Presidential' | 'Family Room' | 'Studio';
  pricePerNight: number;
  totalRooms: number;
  maxGuests: number;
  bedType: string;
  sizeSqFt: number;
  amenities: string[];
  photos: string[];
  isAvailable: boolean;
  blockedDates?: string[]; // YYYY-MM-DD
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  priceMultiplier: number;
  isBlocked: boolean;
  customPrice?: number;
  notes?: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Checked-In' | 'Completed' | 'Cancelled' | 'Rejected';

export interface Booking {
  id: string;
  bookingNumber: string;
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomName: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  totalNights: number;
  numberOfGuests: number;
  pricePerNight: number;
  totalAmount: number;
  status: BookingStatus;
  specialRequests?: string;
  createdAt: string;
  isEligibleForCleaningCredit?: boolean; // Completed bookings that count towards free cleaning
}

export interface Review {
  id: string;
  hotelId: string;
  bookingId?: string;
  guestName: string;
  guestAvatar?: string;
  rating: number; // 1 to 5
  cleanlinessRating: number;
  serviceRating: number;
  locationRating: number;
  comment: string;
  createdAt: string;
  ownerReply?: {
    text: string;
    repliedAt: string;
  };
}

export type CleaningStatus = 'Requested' | 'Assigned' | 'In-Progress' | 'Completed' | 'Cancelled';

export interface CleaningRequest {
  id: string;
  hotelId: string;
  hotelName: string;
  requestedBy: string;
  roomNumbers: string[];
  cleaningType: 'Deep Clean' | 'Standard Turnover' | 'Lobby & Common Areas' | 'Disinfection & Sanitization';
  preferredDate: string;
  preferredTimeSlot: 'Morning (09:00 - 12:00)' | 'Afternoon (12:00 - 15:00)' | 'Evening (15:00 - 18:00)';
  specialInstructions?: string;
  status: CleaningStatus;
  assignedTeamId?: string;
  assignedTeamName?: string;
  assignedTeamPhone?: string;
  completedAt?: string;
  createdAt: string;
  creditsUsed: number;
}

export interface CleaningTeam {
  id: string;
  name: string;
  teamLead: string;
  phone: string;
  activeZone: string;
  currentWorkload: number;
  rating: number;
}

export interface VerificationChecklist {
  licenseVerified: boolean;
  cnicVerified: boolean;
  locationVerified: boolean;
  photosVerified: boolean;
  reviewedByAdmin?: string;
  reviewedAt?: string;
}

export interface Hotel {
  id: string;
  name: string;
  businessOwnerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  googleMapsLocation: Coordinates;
  description: string;
  numberOfRooms: number;
  category: HotelCategory;
  
  // Images & Docs
  logoUrl: string;
  coverImageUrl: string;
  galleryImages: string[];
  documents: HotelDocument[];
  
  // Status flow
  status: HotelStatus;
  rejectionReason?: string;
  adminNotes?: string;
  suspensionReason?: string;
  statusUpdatedAt?: string;
  
  // Verification
  verification: VerificationChecklist;
  
  // Owner assignment
  ownerId: string;
  createdAt: string;
  
  // Rating & stats & visual metadata
  averageRating: number;
  reviewCount: number;
  featured?: boolean;
  highlights?: string[];
  distanceToAirport?: string;
  distanceToCityCenter?: string;
  sanitationScore?: number;
  tags?: string[];
}

export interface NotificationItem {
  id: string;
  userId: string; // 'admin' or owner/guest user id
  title: string;
  message: string;
  type: 'approval' | 'rejection' | 'booking' | 'cleaning' | 'system' | 'info';
  linkTo?: string;
  read: boolean;
  createdAt: string;
}

export interface SupabaseConfig {
  connected: boolean;
  projectUrl: string;
  anonKey: string;
}

export interface AuditLogItem {
  id: string;
  adminName: string;
  action: string;
  target: string;
  category: 'approval' | 'rejection' | 'dispatch' | 'sanitation' | 'payout' | 'suspension' | 'document';
  timestamp: string;
  details?: string;
}

