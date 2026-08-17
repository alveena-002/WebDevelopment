import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import {
  initialProperties,
  initialBuyers,
  initialLandlords,
  initialFinancialStatements,
  initialMaintenanceTickets,
  initialTenancyAlerts,
  initialOffers,
  initialSyndicationLogs,
  initialAgencyProfile
} from './src/data/mockData';
import { Property, BuyerProfile, OfferNegotiation, SyndicationLog, MaintenanceTicket } from './src/types';

// In-memory persistent database store
let properties = [...initialProperties];
let buyers = [...initialBuyers];
let landlords = [...initialLandlords];
let financialStatements = [...initialFinancialStatements];
let maintenanceTickets = [...initialMaintenanceTickets];
let tenancyAlerts = [...initialTenancyAlerts];
let offers = [...initialOffers];
let syndicationLogs = [...initialSyndicationLogs];
let agencyProfile = { ...initialAgencyProfile };

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'proplens-server',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Properties API
  app.get('/api/properties', (req, res) => {
    res.json(properties);
  });

  app.post('/api/properties', (req, res) => {
    const newProp: Property = {
      ...req.body,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      portals: req.body.portals || {
        rightmove: 'not_listed',
        zoopla: 'not_listed',
        onthemarket: 'not_listed'
      },
      status: req.body.status || 'Available',
      panoramas: req.body.panoramas || [
        {
          id: `pano-${Date.now()}-1`,
          name: 'Main Living Space',
          imageUrl: req.body.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
        }
      ]
    };
    properties.unshift(newProp);
    res.status(201).json(newProp);
  });

  app.put('/api/properties/:id', (req, res) => {
    const { id } = req.params;
    const index = properties.findIndex(p => p.id === id);
    if (index !== -1) {
      properties[index] = { ...properties[index], ...req.body };
      res.json(properties[index]);
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  });

  // Buyers API
  app.get('/api/buyers', (req, res) => {
    res.json(buyers);
  });

  app.post('/api/buyers', (req, res) => {
    const newBuyer: BuyerProfile = {
      ...req.body,
      id: `buy-${Date.now()}`,
      status: 'Active'
    };
    buyers.unshift(newBuyer);
    res.status(201).json(newBuyer);
  });

  // Auto-Listing Syndication Endpoint
  app.post('/api/syndicate', (req, res) => {
    const { propertyIds, portals } = req.body as {
      propertyIds: string[];
      portals: ('rightmove' | 'zoopla' | 'onthemarket')[];
    };

    if (!propertyIds || !portals || portals.length === 0) {
      res.status(400).json({ error: 'Missing propertyIds or portals array' });
      return;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLogs: SyndicationLog[] = [];

    propertyIds.forEach(id => {
      const prop = properties.find(p => p.id === id);
      if (prop) {
        portals.forEach(portal => {
          prop.portals[portal] = 'synced';
          prop.portals.lastSyncedAt = timestamp;

          const refPrefix = portal === 'rightmove' ? 'RM' : portal === 'zoopla' ? 'ZP' : 'OTM';
          const refCode = `${refPrefix}-${Math.floor(100000 + Math.random() * 900000)}`;

          const log: SyndicationLog = {
            id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            propertyId: prop.id,
            propertyTitle: prop.title,
            portal: portal === 'rightmove' ? 'Rightmove' : portal === 'zoopla' ? 'Zoopla' : 'OnTheMarket',
            status: 'success',
            timestamp,
            message: `Syndicated via API connector to ${portal.toUpperCase()} portal feed.`,
            referenceCode: refCode
          };
          newLogs.push(log);
          syndicationLogs.unshift(log);
        });
      }
    });

    res.json({
      success: true,
      message: `Successfully syndicated ${propertyIds.length} property/properties to ${portals.join(', ')}.`,
      logs: newLogs,
      properties
    });
  });

  app.get('/api/syndication-logs', (req, res) => {
    res.json(syndicationLogs);
  });

  // AI Buyer Matcher API (using Gemini 3.6 Flash)
  app.post('/api/ai-match', async (req, res) => {
    try {
      const { propertyId, buyerId } = req.body;

      const targetProperty = properties.find(p => p.id === propertyId);
      const targetBuyer = buyers.find(b => b.id === buyerId);

      const candidateProperties = targetProperty ? [targetProperty] : properties;
      const candidateBuyers = targetBuyer ? [targetBuyer] : buyers;

      const prompt = `
You are PropLens AI, an expert UK Real Estate Buyer Matcher and Estate Agent Assistant.
Perform a smart buyer preference match evaluation between the following UK Buyer Profiles and Property Listings.

Buyers Data:
${JSON.stringify(candidateBuyers, null, 2)}

Properties Data:
${JSON.stringify(candidateProperties, null, 2)}

For each buyer and property combination, compute a matchScore (0 to 100), keyReasons, mismatchFactors, suggestedAction, draftEmailTemplate, and draftWhatsappMessage.
Return a valid JSON array matching this exact schema:
[
  {
    "buyerId": "string",
    "buyerName": "string",
    "buyerEmail": "string",
    "propertyId": "string",
    "matchScore": number,
    "keyReasons": ["string"],
    "mismatchFactors": ["string"],
    "suggestedAction": "string",
    "draftEmailTemplate": "string",
    "draftWhatsappMessage": "string"
  }
]
Sort results by matchScore descending. Provide professional, persuasive UK real estate agent style communications.
`;

      const geminiResponse = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                buyerId: { type: Type.STRING },
                buyerName: { type: Type.STRING },
                buyerEmail: { type: Type.STRING },
                propertyId: { type: Type.STRING },
                matchScore: { type: Type.NUMBER },
                keyReasons: { type: Type.ARRAY, items: { type: Type.STRING } },
                mismatchFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedAction: { type: Type.STRING },
                draftEmailTemplate: { type: Type.STRING },
                draftWhatsappMessage: { type: Type.STRING }
              },
              required: ['buyerId', 'buyerName', 'propertyId', 'matchScore', 'keyReasons', 'draftEmailTemplate', 'draftWhatsappMessage']
            }
          }
        }
      });

      const jsonText = geminiResponse.text || '[]';
      const matches = JSON.parse(jsonText);
      res.json(matches);
    } catch (error: any) {
      console.error('AI Match Error:', error);
      res.status(500).json({
        error: 'Failed to generate AI buyer matches',
        details: error?.message || String(error)
      });
    }
  });

  // AI Description Generator (for new property listings)
  app.post('/api/ai-valuation-description', async (req, res) => {
    try {
      const { title, address, city, price, type, bedrooms, bathrooms, features } = req.body;

      const prompt = `
You are a senior UK Estate Agency copywriter for PropLens Luxury Real Estate.
Write a rich, highly appealing property listing description and 5 bullet point key features for a property with these details:
Title: ${title}
Address: ${address}, ${city}
Type: ${type === 'rent' ? 'For Rent' : 'For Sale'} at £${price?.toLocaleString('en-GB')}
Bedrooms: ${bedrooms}, Bathrooms: ${bathrooms}
Features specified: ${Array.isArray(features) ? features.join(', ') : features}

Return JSON with keys: "description" (string) and "features" (array of strings). Use professional UK real estate terminology (e.g. Freehold, EPC, sash windows, en-suite, fitted kitchen, transport links).
`;

      const geminiResponse = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              features: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['description', 'features']
          }
        }
      });

      const result = JSON.parse(geminiResponse.text || '{}');
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to generate listing text', details: error.message });
    }
  });

  // Offers & Negotiation API
  app.get('/api/offers', (req, res) => {
    res.json(offers);
  });

  app.post('/api/offers', (req, res) => {
    const { propertyId, buyerName, buyerEmail, offerAmount, fundingType, agentNotes } = req.body;
    const prop = properties.find(p => p.id === propertyId);

    const newOffer: OfferNegotiation = {
      id: `off-${Date.now()}`,
      propertyId,
      propertyTitle: prop ? prop.title : 'Property Listing',
      propertyAddress: prop ? prop.address : 'UK Address',
      askingPrice: prop ? prop.price : offerAmount,
      buyerId: req.body.buyerId || `buy-${Date.now()}`,
      buyerName,
      buyerEmail,
      fundingType: fundingType || 'Mortgage Approved (DIP)',
      offerAmount: Number(offerAmount),
      status: 'Pending Review',
      agentNotes: agentNotes || 'New buyer offer submitted via portal.',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          actor: 'Buyer',
          action: 'Offer Submitted',
          amount: Number(offerAmount),
          note: `Submitted initial offer of £${Number(offerAmount).toLocaleString('en-GB')}`
        }
      ]
    };

    offers.unshift(newOffer);
    if (prop) {
      prop.status = 'Under Offer';
    }
    res.status(201).json(newOffer);
  });

  app.put('/api/offers/:id', (req, res) => {
    const { id } = req.params;
    const { status, counterAmount, note, actor } = req.body;

    const offerIndex = offers.findIndex(o => o.id === id);
    if (offerIndex !== -1) {
      const offer = offers[offerIndex];
      offer.status = status || offer.status;
      if (counterAmount) {
        offer.sellerCounterAmount = Number(counterAmount);
      }
      offer.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

      offer.history.unshift({
        id: `h-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actor: actor || 'Agent',
        action: `Status changed to ${status}${counterAmount ? ` (£${Number(counterAmount).toLocaleString('en-GB')})` : ''}`,
        amount: counterAmount ? Number(counterAmount) : offer.offerAmount,
        note: note || `Updated offer negotiation status.`
      });

      // If accepted or SSTC, update property status
      if (status === 'Accepted' || status === 'SSTC' || status === 'Let Agreed') {
        const prop = properties.find(p => p.id === offer.propertyId);
        if (prop) {
          prop.status = prop.type === 'rent' ? 'Let Agreed' : 'SSTC';
        }
      }

      res.json(offer);
    } else {
      res.status(404).json({ error: 'Offer not found' });
    }
  });

  // Landlord Portal API
  app.get('/api/landlords', (req, res) => {
    res.json(landlords);
  });

  app.get('/api/financials', (req, res) => {
    const landlordId = req.query.landlordId as string;
    if (landlordId) {
      res.json(financialStatements.filter(f => f.landlordId === landlordId));
    } else {
      res.json(financialStatements);
    }
  });

  app.get('/api/maintenance', (req, res) => {
    const landlordId = req.query.landlordId as string;
    if (landlordId) {
      res.json(maintenanceTickets.filter(m => m.landlordId === landlordId));
    } else {
      res.json(maintenanceTickets);
    }
  });

  app.post('/api/maintenance/:id/approve', (req, res) => {
    const { id } = req.params;
    const ticket = maintenanceTickets.find(m => m.id === id);
    if (ticket) {
      ticket.landlordApproved = true;
      ticket.status = 'In Progress';
      res.json(ticket);
    } else {
      res.status(404).json({ error: 'Maintenance ticket not found' });
    }
  });

  app.get('/api/tenancies', (req, res) => {
    const landlordId = req.query.landlordId as string;
    if (landlordId) {
      res.json(tenancyAlerts.filter(t => t.landlordId === landlordId));
    } else {
      res.json(tenancyAlerts);
    }
  });

  // AI-Generated Search Preview (marketing tool)
  // Note: this generates a preview of how a Google AI Overview *could* read for
  // this agency's listings, using Gemini. It is not a live Google SERP result —
  // no third party can inject content into Google's actual search results via
  // API. Use this to preview/tune copy before it's picked up organically via
  // real SEO/GMB optimisation (see /api/places/agency-profile for the agency's
  // actual live Google Business Profile data).
  app.get('/api/gmb-search', async (req, res) => {
    const query = (req.query.q as string || '').toLowerCase();

    // Filter properties based on city, address, bedrooms, or type
    const matched = properties.filter(p => {
      if (!query) return true;
      return (
        p.city.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query) ||
        p.postcode.toLowerCase().includes(query) ||
        (query.includes('garden') && p.hasGarden) ||
        (query.includes('rent') && p.type === 'rent') ||
        (query.includes('sale') && p.type === 'sale') ||
        (query.includes('parking') && p.hasParking)
      );
    });

    let aiSummary = '';
    if (query) {
      try {
        const prompt = `
You are Google Search AI Snippet for UK Housing. A user searched Google for: "${query}".
The estate agency "PropLens Premier Estates" has ${matched.length} live matching properties in their database.
Properties found: ${matched.map(m => `${m.title} (£${m.price.toLocaleString('en-GB')}, ${m.bedrooms} beds, ${m.city})`).join('; ')}

Write a concise 2-sentence Google Search AI overview highlighting availability, price range, and a call-to-action to view live 360 virtual tours on the agent's GMB landing page.
`;
        const aiRes = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt
        });
        aiSummary = aiRes.text || '';
      } catch (e) {
        aiSummary = `Found ${matched.length} active listings matching "${query}" on PropLens. View direct live 360 tours and submit instant offers.`;
      }
    }

    res.json({
      query,
      resultsCount: matched.length,
      aiSummary,
      agencyProfile,
      properties: matched
    });
  });

  // --- REAL GOOGLE PLACES INTEGRATION ---
  // Unlike Rightmove/Zoopla/OnTheMarket (which require a signed agency-level
  // feed agreement with each portal), Google's Geocoding and Places APIs are
  // publicly available with a standard API key, so these endpoints call the
  // real Google APIs rather than simulating them.
  const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

  async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    if (!PLACES_API_KEY) return null;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${PLACES_API_KEY}`;
    const geoRes = await fetch(url);
    const geoData: any = await geoRes.json();
    const loc = geoData?.results?.[0]?.geometry?.location;
    return loc ? { lat: loc.lat, lng: loc.lng } : null;
  }

  async function nearbySearch(lat: number, lng: number, type: string, keyword?: string) {
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: '1500',
      type,
      key: PLACES_API_KEY
    });
    if (keyword) params.set('keyword', keyword);
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`;
    const nearRes = await fetch(url);
    const nearData: any = await nearRes.json();
    return (nearData?.results || []).slice(0, 3).map((r: any) => ({
      name: r.name,
      rating: r.rating ?? null,
      userRatingsTotal: r.user_ratings_total ?? null,
      vicinity: r.vicinity ?? null
    }));
  }

  // Live nearby amenities (schools, train stations, supermarkets) for a property address
  app.get('/api/places/nearby-amenities', async (req, res) => {
    const { address, postcode, city } = req.query as { address?: string; postcode?: string; city?: string };

    if (!PLACES_API_KEY) {
      res.json({
        live: false,
        reason: 'GOOGLE_PLACES_API_KEY not configured. Set it in your .env to enable live nearby-amenities data.',
        amenities: null
      });
      return;
    }

    try {
      const fullAddress = [address, postcode, city, 'UK'].filter(Boolean).join(', ');
      const coords = await geocodeAddress(fullAddress);

      if (!coords) {
        res.json({ live: false, reason: 'Could not geocode this address.', amenities: null });
        return;
      }

      const [schools, stations, supermarkets] = await Promise.all([
        nearbySearch(coords.lat, coords.lng, 'school'),
        nearbySearch(coords.lat, coords.lng, 'train_station'),
        nearbySearch(coords.lat, coords.lng, 'supermarket')
      ]);

      res.json({
        live: true,
        coords,
        amenities: { schools, stations, supermarkets }
      });
    } catch (error: any) {
      res.status(500).json({ live: false, reason: error?.message || 'Places API request failed', amenities: null });
    }
  });

  // Live Google Business Profile data for the agency (real rating & review count)
  app.get('/api/places/agency-profile', async (req, res) => {
    if (!PLACES_API_KEY) {
      res.json({
        live: false,
        reason: 'GOOGLE_PLACES_API_KEY not configured. Set it in your .env to pull the agency\'s live Google rating.',
        profile: null
      });
      return;
    }

    try {
      const query = `${agencyProfile.agencyName} ${agencyProfile.branchCity} estate agent`;
      const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${PLACES_API_KEY}`;
      const findRes = await fetch(findUrl);
      const findData: any = await findRes.json();
      const placeId = findData?.candidates?.[0]?.place_id;

      if (!placeId) {
        res.json({ live: false, reason: 'No matching Google Business Profile found for this agency name.', profile: null });
        return;
      }

      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,formatted_address,formatted_phone_number,opening_hours,url&key=${PLACES_API_KEY}`;
      const detailsRes = await fetch(detailsUrl);
      const detailsData: any = await detailsRes.json();
      const r = detailsData?.result;

      if (!r) {
        res.json({ live: false, reason: 'Could not fetch place details.', profile: null });
        return;
      }

      res.json({
        live: true,
        profile: {
          name: r.name,
          rating: r.rating ?? null,
          userRatingsTotal: r.user_ratings_total ?? null,
          address: r.formatted_address ?? null,
          phone: r.formatted_phone_number ?? null,
          openNow: r.opening_hours?.open_now ?? null,
          googleMapsUrl: r.url ?? null
        }
      });
    } catch (error: any) {
      res.status(500).json({ live: false, reason: error?.message || 'Places API request failed', profile: null });
    }
  });

  // GMB SEO Landing Page AI Generator
  app.post('/api/ai-gmb-seo', async (req, res) => {
    try {
      const { agencyName, city } = req.body;
      const prompt = `
Generate an SEO-Optimized Google Business Profile (GMB) Landing Page Strategy and JSON-LD Schema markup for:
Agency Name: ${agencyName || agencyProfile.agencyName}
Branch City: ${city || agencyProfile.branchCity}

Return JSON with:
"seoMetaTitle": string,
"seoMetaDescription": string,
"localAreaGuide": string (300 word guide to local schools, transport, market trends, and housing yields in ${city}),
"schemaJsonLd": string (valid JSON-LD for RealEstateAgent schema),
"keyKeywords": array of strings
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to generate GMB SEO content', details: error.message });
    }
  });

  // --- VITE MIDDLEWARE / PRODUCTION SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PropLens UK Estate CRM & Portal running at http://localhost:${PORT}`);
  });
}

startServer();
