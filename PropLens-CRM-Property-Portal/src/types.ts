export type PropertyType = 'sale' | 'rent';
export type PropertyStatus = 'Available' | 'Under Offer' | 'SSTC' | 'Let Agreed';
export type EpcRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type CouncilTaxBand = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
export type Tenure = 'Freehold' | 'Leasehold' | 'Share of Freehold';

export interface PortalSyndicationStatus {
  rightmove: 'synced' | 'pending' | 'failed' | 'not_listed';
  zoopla: 'synced' | 'pending' | 'failed' | 'not_listed';
  onthemarket: 'synced' | 'pending' | 'failed' | 'not_listed';
  lastSyncedAt?: string;
}

export interface PanoramaRoom {
  id: string;
  name: string;
  imageUrl: string;
  hotspots?: { x: number; y: number; title: string; description: string }[];
}

export interface Property {
  id: string;
  title: string;
  address: string;
  postcode: string;
  city: string;
  price: number;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  receptionRooms: number;
  areaSqFt: number;
  epcRating: EpcRating;
  councilTaxBand: CouncilTaxBand;
  tenure: Tenure;
  hasGarden: boolean;
  hasParking: boolean;
  schoolCatchmentRating: 'Outstanding' | 'Good' | 'Requires Improvement';
  virtualTourUrl?: string;
  panoramas: PanoramaRoom[];
  images: string[];
  description: string;
  features: string[];
  status: PropertyStatus;
  portals: PortalSyndicationStatus;
  landlordId?: string;
  landlordName?: string;
  createdAt: string;
}

export interface BuyerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyType: PropertyType;
  budgetMin: number;
  budgetMax: number;
  preferredLocations: string[];
  minBeds: number;
  requiresGarden: boolean;
  requiresParking: boolean;
  preferredEpc?: EpcRating[];
  fundingStatus: 'Cash Buyer' | 'Mortgage Approved (DIP)' | 'Property Chain (1 Level)' | 'Chain Free';
  status: 'Active' | 'Under Offer' | 'Completed' | 'Inactive';
  notes?: string;
}

export interface BuyerMatchResult {
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  propertyId: string;
  matchScore: number; // 0 - 100
  keyReasons: string[];
  mismatchFactors: string[];
  suggestedAction: string;
  draftEmailTemplate: string;
  draftWhatsappMessage: string;
}

export interface Landlord {
  id: string;
  name: string;
  email: string;
  phone: string;
  bankAccount: string;
  managementFeePercent: number; // e.g. 10%
  propertiesCount: number;
}

export interface FinancialStatement {
  id: string;
  landlordId: string;
  landlordName: string;
  propertyId: string;
  propertyAddress: string;
  period: string; // e.g., "August 2026"
  grossRent: number;
  managementFee: number;
  maintenanceDeductions: number;
  netPayout: number;
  status: 'Paid' | 'Pending Disbursement' | 'Processing';
  payoutDate: string;
}

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  propertyAddress: string;
  landlordId: string;
  tenantName: string;
  tenantContact: string;
  title: string;
  description: string;
  category: 'Plumbing' | 'Electrical' | 'Heating/Boiler' | 'Structural' | 'Appliance' | 'General';
  priority: 'Emergency' | 'High' | 'Medium' | 'Low';
  status: 'Reported' | 'Contractor Assigned' | 'In Progress' | 'Resolved';
  estimatedCost: number;
  landlordApproved: boolean;
  createdAt: string;
}

export interface TenancyAlert {
  id: string;
  propertyId: string;
  propertyAddress: string;
  landlordId: string;
  tenantName: string;
  monthlyRent: number;
  astExpiryDate: string;
  daysToExpiry: number;
  gasSafetyExpiry: string;
  epcExpiry: string;
  depositAmount: number;
  renewalStatus: 'Notice Due' | 'Renewal Pending' | 'Renewed' | 'Vacating';
}

export interface OfferNegotiation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  askingPrice: number;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  fundingType: 'Cash Buyer' | 'Mortgage Approved (DIP)' | 'Property Chain (1 Level)' | 'Chain Free';
  offerAmount: number;
  sellerCounterAmount?: number;
  status: 'Pending Review' | 'Countered' | 'Accepted' | 'Declined' | 'SSTC' | 'Let Agreed';
  agentNotes: string;
  updatedAt: string;
  history: {
    id: string;
    timestamp: string;
    actor: 'Buyer' | 'Agent' | 'Landlord/Vendor';
    action: string;
    amount?: number;
    note?: string;
  }[];
}

export interface SyndicationLog {
  id: string;
  propertyId: string;
  propertyTitle: string;
  portal: 'Rightmove' | 'Zoopla' | 'OnTheMarket';
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  message: string;
  referenceCode?: string;
}

export interface GMBAgencyProfile {
  agencyName: string;
  tagline: string;
  branchCity: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  gmbUrl: string;
  customDomain: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  neighborhoodHighlights: string[];
}
