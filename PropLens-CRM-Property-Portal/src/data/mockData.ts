import {
  Property,
  BuyerProfile,
  Landlord,
  FinancialStatement,
  MaintenanceTicket,
  TenancyAlert,
  OfferNegotiation,
  SyndicationLog,
  GMBAgencyProfile,
} from '../types';

export const initialProperties: Property[] = [
  {
    id: 'prop-101',
    title: 'The Kensington Grand Georgian Townhouse',
    address: '14 Rutland Gate, Knightsbridge',
    postcode: 'SW7 1BD',
    city: 'London',
    price: 3250000,
    type: 'sale',
    bedrooms: 5,
    bathrooms: 4,
    receptionRooms: 3,
    areaSqFt: 3850,
    epcRating: 'C',
    councilTaxBand: 'H',
    tenure: 'Freehold',
    hasGarden: true,
    hasParking: true,
    schoolCatchmentRating: 'Outstanding',
    virtualTourUrl: 'https://my.matterport.com/show/?m=sample_kensington_tour',
    panoramas: [
      {
        id: 'pano-1',
        name: 'Grand Reception Room',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { x: 30, y: 45, title: 'Marble Fireplace', description: 'Original 1840 Victorian marble mantelpiece with working gas flue.' },
          { x: 70, y: 35, title: 'Floor-to-Ceiling Windows', description: 'Restored sash windows overlooking communal gardens.' }
        ]
      },
      {
        id: 'pano-2',
        name: 'Chef Kitchen & Dining',
        imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { x: 50, y: 50, title: 'Gaggenau Appliances', description: 'Integrated dual ovens, wine cooler, and induction hob.' }
        ]
      },
      {
        id: 'pano-3',
        name: 'Master Suite & Dressing Room',
        imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { x: 40, y: 60, title: 'Custom Joinery', description: 'Solid oak bespoke fitted wardrobes with interior lighting.' }
        ]
      },
      {
        id: 'pano-4',
        name: 'Landscaped Walled Garden',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An immaculate five-bedroom Georgian residence situated in the prestigious heart of Knightsbridge. Boasting high ceiling proportions, restored period details, private underground garaging, and a secluded south-facing walled courtyard garden.',
    features: [
      'Grade II Listed Georgian Architecture',
      'South-Facing Private Garden',
      'Secure Underground Parking for 2 Cars',
      'Bespoke Italian Kitchen with Gaggenau Appliances',
      'Walk to Hyde Park and Harrods'
    ],
    status: 'Available',
    portals: {
      rightmove: 'synced',
      zoopla: 'synced',
      onthemarket: 'synced',
      lastSyncedAt: '2026-08-13 09:15'
    },
    landlordId: 'land-1',
    landlordName: 'Lord Alistair Sterling',
    createdAt: '2026-08-01'
  },
  {
    id: 'prop-102',
    title: 'Deansgate Waterside Penthouse',
    address: '88 Deansgate Locks, City Centre',
    postcode: 'M3 4EN',
    city: 'Manchester',
    price: 685000,
    type: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    receptionRooms: 1,
    areaSqFt: 1620,
    epcRating: 'B',
    councilTaxBand: 'F',
    tenure: 'Leasehold',
    hasGarden: false,
    hasParking: true,
    schoolCatchmentRating: 'Good',
    virtualTourUrl: 'https://my.matterport.com/show/?m=sample_manchester_tour',
    panoramas: [
      {
        id: 'pano-m1',
        name: 'Sky Lounge & Terrace',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80'
      },
      {
        id: 'pano-m2',
        name: 'Open Plan Living',
        imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A spectacular duplex penthouse on the 24th floor overlooking the Manchester skyline and River Irwell. Features a wrap-around private terrace, concierge service, and EV charging bays.',
    features: [
      '24th Floor Panoramic Skyline Views',
      'Wrap-Around Private Roof Terrace',
      'Allocated Secure EV Parking Space',
      '24/7 Hotel-Style Concierge & Resident Gym',
      'Hyperfast 1Gbps Fibre Optic Internet'
    ],
    status: 'Under Offer',
    portals: {
      rightmove: 'synced',
      zoopla: 'synced',
      onthemarket: 'pending',
      lastSyncedAt: '2026-08-12 14:30'
    },
    landlordId: 'land-2',
    landlordName: 'Victoria Pemberton',
    createdAt: '2026-08-05'
  },
  {
    id: 'prop-103',
    title: 'Clifton Village Period Villa',
    address: '22 Royal York Crescent, Clifton',
    postcode: 'BS8 4JX',
    city: 'Bristol',
    price: 1450000,
    type: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    receptionRooms: 2,
    areaSqFt: 2900,
    epcRating: 'C',
    councilTaxBand: 'G',
    tenure: 'Freehold',
    hasGarden: true,
    hasParking: true,
    schoolCatchmentRating: 'Outstanding',
    virtualTourUrl: 'https://my.matterport.com/show/?m=sample_clifton_tour',
    panoramas: [
      {
        id: 'pano-b1',
        name: 'Drawing Room',
        imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Situated on the famous Royal York Crescent with panoramic views across Bristol Suspension Bridge and Avon Gorge. Meticulously updated with modern underfloor heating and bespoke conservatory.',
    features: [
      'Views of Clifton Suspension Bridge',
      'Access to Royal York Private Communal Gardens',
      'Apsley House Primary School Catchment (Outstanding)',
      'Converted Wine Cellar & Gym',
      'Gated Off-Street Parking'
    ],
    status: 'Available',
    portals: {
      rightmove: 'synced',
      zoopla: 'synced',
      onthemarket: 'synced',
      lastSyncedAt: '2026-08-11 11:00'
    },
    landlordId: 'land-3',
    landlordName: 'Dr. Harrison Finch',
    createdAt: '2026-08-02'
  },
  {
    id: 'prop-104',
    title: 'Edinburgh New Town Luxury Apartment',
    address: '45 Heriot Row, City Centre',
    postcode: 'EH3 6EX',
    city: 'Edinburgh',
    price: 3200, // Monthly Rent
    type: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    receptionRooms: 1,
    areaSqFt: 1250,
    epcRating: 'B',
    councilTaxBand: 'E',
    tenure: 'Freehold',
    hasGarden: true,
    hasParking: false,
    schoolCatchmentRating: 'Outstanding',
    virtualTourUrl: 'https://my.matterport.com/show/?m=sample_edinburgh_tour',
    panoramas: [
      {
        id: 'pano-e1',
        name: 'Georgian Sitting Room',
        imageUrl: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An elegant first floor luxury residence facing Queen Street Gardens. Furnished to designer standards with high ceilings, ornate cornicing, working shutters, and private key access to Queen Street Private Gardens.',
    features: [
      'Queen Street Private Gardens Key Access',
      'Designer Italian Furnishings Included',
      'Short Walk to St James Quarter & Waverley Station',
      'Fully Managed Lettings Service'
    ],
    status: 'Available',
    portals: {
      rightmove: 'synced',
      zoopla: 'synced',
      onthemarket: 'synced',
      lastSyncedAt: '2026-08-10 16:20'
    },
    landlordId: 'land-1',
    landlordName: 'Lord Alistair Sterling',
    createdAt: '2026-08-08'
  },
  {
    id: 'prop-105',
    title: 'Edgbaston Executive Detached Family Residence',
    address: '12 Calthorpe Road, Edgbaston',
    postcode: 'B15 1TR',
    city: 'Birmingham',
    price: 895000,
    type: 'sale',
    bedrooms: 5,
    bathrooms: 3,
    receptionRooms: 3,
    areaSqFt: 3100,
    epcRating: 'B',
    councilTaxBand: 'G',
    tenure: 'Freehold',
    hasGarden: true,
    hasParking: true,
    schoolCatchmentRating: 'Outstanding',
    virtualTourUrl: 'https://my.matterport.com/show/?m=sample_birmingham_tour',
    panoramas: [
      {
        id: 'pano-bg1',
        name: 'Family Kitchen & Sunroom',
        imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A beautifully renovated Arts & Crafts style family home set within private gated grounds in Calthorpe Estate. Offers solar PV panels, triple garage, and expansive 120ft landscaped lawn.',
    features: [
      'Calthorpe Estate Gated Setting',
      'Solar PV Array & EPC Rating B',
      'King Edward VI High School Catchment',
      'Detached Triple Garage & Driveway'
    ],
    status: 'Available',
    portals: {
      rightmove: 'synced',
      zoopla: 'pending',
      onthemarket: 'synced',
      lastSyncedAt: '2026-08-12 18:00'
    },
    landlordId: 'land-4',
    landlordName: 'Sajid Mahmood',
    createdAt: '2026-08-07'
  }
];

export const initialBuyers: BuyerProfile[] = [
  {
    id: 'buy-201',
    name: 'Sir Charles Thornton',
    email: 'charles.thornton@marlborough.co.uk',
    phone: '+44 7700 900123',
    propertyType: 'sale',
    budgetMin: 2500000,
    budgetMax: 3500000,
    preferredLocations: ['London', 'Knightsbridge', 'Kensington', 'Mayfair'],
    minBeds: 4,
    requiresGarden: true,
    requiresParking: true,
    preferredEpc: ['A', 'B', 'C'],
    fundingStatus: 'Cash Buyer',
    status: 'Active',
    notes: 'Looking for prime central London period property for immediate family relocation. Funds cleared in UK bank.'
  },
  {
    id: 'buy-202',
    name: 'Gemma & Marcus Vance',
    email: 'marcus.vance@techhorizon.io',
    phone: '+44 7891 234567',
    propertyType: 'sale',
    budgetMin: 600000,
    budgetMax: 750000,
    preferredLocations: ['Manchester', 'Deansgate', 'Salford Quays'],
    minBeds: 2,
    requiresGarden: false,
    requiresParking: true,
    preferredEpc: ['A', 'B'],
    fundingStatus: 'Mortgage Approved (DIP)',
    status: 'Active',
    notes: 'Decision In Principle with HSBC for £700k. Wants high floor penthouse with balcony or terrace.'
  },
  {
    id: 'buy-203',
    name: 'Dr. Aris Thorne',
    email: 'a.thorne@bristol.ac.uk',
    phone: '+44 7412 889900',
    propertyType: 'sale',
    budgetMin: 1200000,
    budgetMax: 1600000,
    preferredLocations: ['Bristol', 'Clifton', 'Redland'],
    minBeds: 4,
    requiresGarden: true,
    requiresParking: true,
    preferredEpc: ['B', 'C'],
    fundingStatus: 'Property Chain (1 Level)',
    status: 'Active',
    notes: 'House in Redland already SSTC for £980k. Urgent need for Clifton school catchment.'
  },
  {
    id: 'buy-204',
    name: 'Elena Rostova',
    email: 'elena.rostova@edinburghinvest.com',
    phone: '+44 7555 432109',
    propertyType: 'rent',
    budgetMin: 2800,
    budgetMax: 3800,
    preferredLocations: ['Edinburgh', 'New Town', 'West End'],
    minBeds: 2,
    requiresGarden: false,
    requiresParking: false,
    fundingStatus: 'Chain Free',
    status: 'Active',
    notes: 'Corporate lease relocation for financial executive. Requires fully furnished property.'
  }
];

export const initialLandlords: Landlord[] = [
  {
    id: 'land-1',
    name: 'Lord Alistair Sterling',
    email: 'alistair@sterlingholdings.co.uk',
    phone: '+44 20 7946 0111',
    bankAccount: 'Coutts & Co •••• 4821',
    managementFeePercent: 10,
    propertiesCount: 2
  },
  {
    id: 'land-2',
    name: 'Victoria Pemberton',
    email: 'v.pemberton@pembertonestates.com',
    phone: '+44 161 496 0222',
    bankAccount: 'Barclays Wealth •••• 9102',
    managementFeePercent: 12,
    propertiesCount: 1
  },
  {
    id: 'land-3',
    name: 'Dr. Harrison Finch',
    email: 'harrison.finch@cliftonmed.co.uk',
    phone: '+44 117 496 0333',
    bankAccount: 'NatWest Premier •••• 1154',
    managementFeePercent: 10,
    propertiesCount: 1
  },
  {
    id: 'land-4',
    name: 'Sajid Mahmood',
    email: 'sajid@mahmoodproperty.co.uk',
    phone: '+44 121 496 0444',
    bankAccount: 'HSBC Commercial •••• 7733',
    managementFeePercent: 8,
    propertiesCount: 1
  }
];

export const initialFinancialStatements: FinancialStatement[] = [
  {
    id: 'stmt-801',
    landlordId: 'land-1',
    landlordName: 'Lord Alistair Sterling',
    propertyId: 'prop-104',
    propertyAddress: '45 Heriot Row, Edinburgh EH3 6EX',
    period: 'July 2026',
    grossRent: 3200,
    managementFee: 320, // 10%
    maintenanceDeductions: 150, // Boiler service check
    netPayout: 2730,
    status: 'Paid',
    payoutDate: '2026-08-01'
  },
  {
    id: 'stmt-802',
    landlordId: 'land-1',
    landlordName: 'Lord Alistair Sterling',
    propertyId: 'prop-101',
    propertyAddress: '14 Rutland Gate, Knightsbridge SW7 1BD',
    period: 'July 2026',
    grossRent: 12500, // Luxury let equivalent or commercial holding
    managementFee: 1250,
    maintenanceDeductions: 420,
    netPayout: 10830,
    status: 'Paid',
    payoutDate: '2026-08-01'
  },
  {
    id: 'stmt-803',
    landlordId: 'land-2',
    landlordName: 'Victoria Pemberton',
    propertyId: 'prop-102',
    propertyAddress: '88 Deansgate Locks, Manchester M3 4EN',
    period: 'August 2026',
    grossRent: 2850,
    managementFee: 342, // 12%
    maintenanceDeductions: 0,
    netPayout: 2508,
    status: 'Pending Disbursement',
    payoutDate: '2026-08-15'
  }
];

export const initialMaintenanceTickets: MaintenanceTicket[] = [
  {
    id: 'maint-501',
    propertyId: 'prop-104',
    propertyAddress: '45 Heriot Row, Edinburgh EH3 6EX',
    landlordId: 'land-1',
    tenantName: 'Elena Rostova',
    tenantContact: '+44 7555 432109',
    title: 'Hot Water Pressure Drop on Master En-Suite',
    description: 'Combi boiler system showing E11 pressure fault code when running primary bath filler.',
    category: 'Heating/Boiler',
    priority: 'High',
    status: 'Contractor Assigned',
    estimatedCost: 180,
    landlordApproved: true,
    createdAt: '2026-08-11'
  },
  {
    id: 'maint-502',
    propertyId: 'prop-101',
    propertyAddress: '14 Rutland Gate, Knightsbridge SW7 1BD',
    landlordId: 'land-1',
    tenantName: 'Lord Sterling Estate Manager',
    tenantContact: '+44 20 7946 0111',
    title: 'Automated Security Gate Sensor Calibration',
    description: 'Rear lane vehicle entrance optical sensor intermittently holding gate open.',
    category: 'Electrical',
    priority: 'Medium',
    status: 'Reported',
    estimatedCost: 250,
    landlordApproved: false,
    createdAt: '2026-08-12'
  }
];

export const initialTenancyAlerts: TenancyAlert[] = [
  {
    id: 'ten-901',
    propertyId: 'prop-104',
    propertyAddress: '45 Heriot Row, Edinburgh EH3 6EX',
    landlordId: 'land-1',
    tenantName: 'Elena Rostova',
    monthlyRent: 3200,
    astExpiryDate: '2026-09-30',
    daysToExpiry: 48,
    gasSafetyExpiry: '2026-11-15',
    epcExpiry: '2031-04-10',
    depositAmount: 4800,
    renewalStatus: 'Renewal Pending'
  },
  {
    id: 'ten-902',
    propertyId: 'prop-102',
    propertyAddress: '88 Deansgate Locks, Manchester M3 4EN',
    landlordId: 'land-2',
    tenantName: 'Liam O’Connor',
    monthlyRent: 2850,
    astExpiryDate: '2026-08-28',
    daysToExpiry: 15,
    gasSafetyExpiry: '2026-09-10',
    epcExpiry: '2029-01-20',
    depositAmount: 3400,
    renewalStatus: 'Notice Due'
  }
];

export const initialOffers: OfferNegotiation[] = [
  {
    id: 'off-301',
    propertyId: 'prop-102',
    propertyTitle: 'Deansgate Waterside Penthouse',
    propertyAddress: '88 Deansgate Locks, Manchester M3 4EN',
    askingPrice: 685000,
    buyerId: 'buy-202',
    buyerName: 'Gemma & Marcus Vance',
    buyerEmail: 'marcus.vance@techhorizon.io',
    fundingType: 'Mortgage Approved (DIP)',
    offerAmount: 670000,
    sellerCounterAmount: 680000,
    status: 'Countered',
    agentNotes: 'Vendor willing to include all luxury fitted Miele laundry appliances at £680,000.',
    updatedAt: '2026-08-12 16:45',
    history: [
      {
        id: 'h-1',
        timestamp: '2026-08-11 10:00',
        actor: 'Buyer',
        action: 'Initial Offer Submitted',
        amount: 660000,
        note: 'Submitted with HSBC DIP document attached.'
      },
      {
        id: 'h-2',
        timestamp: '2026-08-11 14:30',
        actor: 'Landlord/Vendor',
        action: 'Offer Declined',
        amount: 660000,
        note: 'Vendor felt £660k was below fair market value for penthouse unit.'
      },
      {
        id: 'h-3',
        timestamp: '2026-08-12 09:15',
        actor: 'Buyer',
        action: 'Revised Offer Submitted',
        amount: 670000,
        note: 'Increased offer by £10,000.'
      },
      {
        id: 'h-4',
        timestamp: '2026-08-12 16:45',
        actor: 'Landlord/Vendor',
        action: 'Counter Offer Issued',
        amount: 680000,
        note: 'Counter offer set at £680,000 including custom blinds and kitchen white goods.'
      }
    ]
  },
  {
    id: 'off-302',
    propertyId: 'prop-101',
    propertyTitle: 'The Kensington Grand Georgian Townhouse',
    propertyAddress: '14 Rutland Gate, Knightsbridge SW7 1BD',
    askingPrice: 3250000,
    buyerId: 'buy-201',
    buyerName: 'Sir Charles Thornton',
    buyerEmail: 'charles.thornton@marlborough.co.uk',
    fundingType: 'Cash Buyer',
    offerAmount: 3180000,
    status: 'Pending Review',
    agentNotes: 'Cash funds verified via Coutts bank letter. Vendor reviewing in evening board meeting.',
    updatedAt: '2026-08-13 08:30',
    history: [
      {
        id: 'h-20',
        timestamp: '2026-08-13 08:30',
        actor: 'Buyer',
        action: 'Initial Offer Submitted',
        amount: 3180000,
        note: 'Unconditional cash offer with 14-day completion target.'
      }
    ]
  }
];

export const initialSyndicationLogs: SyndicationLog[] = [
  {
    id: 'log-1',
    propertyId: 'prop-101',
    propertyTitle: '14 Rutland Gate, Knightsbridge',
    portal: 'Rightmove',
    status: 'success',
    timestamp: '2026-08-13 09:15:02',
    message: 'Listing successfully published via Real-Time Data Feed (RTDF) v3.',
    referenceCode: 'RM-LONDON-98812'
  },
  {
    id: 'log-2',
    propertyId: 'prop-101',
    propertyTitle: '14 Rutland Gate, Knightsbridge',
    portal: 'Zoopla',
    status: 'success',
    timestamp: '2026-08-13 09:15:04',
    message: 'Listing feed acknowledged by ZPG API Gateway.',
    referenceCode: 'ZP-8849201'
  },
  {
    id: 'log-3',
    propertyId: 'prop-102',
    propertyTitle: '88 Deansgate Locks, Manchester',
    portal: 'OnTheMarket',
    status: 'pending',
    timestamp: '2026-08-12 14:30:10',
    message: 'Queued in OTM API batch queue for next hourly sync window.',
    referenceCode: 'OTM-MCR-2201'
  }
];

export const initialAgencyProfile: GMBAgencyProfile = {
  agencyName: 'PropLens Premier Estates & Lettings',
  tagline: 'London & UK Regional Luxury Property Specialists',
  branchCity: 'Knightsbridge & Central London',
  address: '102 Brompton Road, Knightsbridge, London SW3 1JJ',
  phone: '+44 20 7584 9000',
  rating: 4.9,
  reviewCount: 142,
  gmbUrl: 'https://maps.google.com/?cid=proplens_knightsbridge_agency',
  customDomain: 'proplens.co.uk/agencies/premier-london',
  seoMetaTitle: 'Premier Estate & Letting Agents Knightsbridge & Kensington | PropLens',
  seoMetaDescription: 'Search luxury homes for sale and let in Knightsbridge, Kensington, Manchester & Bristol. Instant 360 virtual tours, direct landlord reports, and verified buyer matching.',
  neighborhoodHighlights: [
    'Walking distance to Hyde Park, Harrods & V&A Museum',
    'Outstanding OFSTED rated state & independent schools',
    'Direct Heathrow Express connections via Paddington & South Kensington Station',
    'High rental yield growth across prime residential zones (+6.4% YoY)'
  ]
};
