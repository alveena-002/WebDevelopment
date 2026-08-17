# PropLens — CRM & Property Portal

Automated property CRM and syndication portal for UK estate and letting agents, featuring AI-assisted buyer matching, 360° virtual tour viewing, landlord financial reports, real-time offer negotiations, and GMB SEO landing page integration.

## Features

- **Property Catalog** — manage sale and rental listings with photos, panoramas, and portal sync status
- **AI Buyer Matcher** — scores buyers against properties and drafts outreach emails/WhatsApp messages
- **Syndication Hub** — push listings to Rightmove, Zoopla, and OnTheMarket, with sync logs
- **Virtual Tour Viewer** — 360° panorama walkthroughs per property
- **Offer Tracker** — negotiation history, counter-offers, and status changes
- **Landlord Portal** — financial statements, maintenance tickets, and tenancy alerts
- **GMB Search Portal** — AI-generated Google Business Profile SEO content and live search preview

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Express (API server) + Vite middleware for dev
- Google Gemini API (`@google/genai`) for AI matching, listing copy, and SEO content
- Google Places & Geocoding APIs for live local-area data and agency ratings

## What's live vs. simulated

| Feature | Status |
|---|---|
| AI Buyer Matcher | ✅ Live — real Gemini API call |
| Offer & Negotiation Tracker | ✅ Live — functional backend (in-memory store) |
| Landlord Portal (financials, maintenance, tenancy alerts) | ✅ Live — functional backend (in-memory store) |
| Nearby schools / train stations / supermarkets | ✅ Live — real Google Places API |
| Agency Google rating & review count | ✅ Live — real Google Places API |
| AI listing description generator | ✅ Live — real Gemini API call |
| GMB SEO landing page content generator | ✅ Live — real Gemini API call |
| Rightmove / Zoopla / OnTheMarket syndication | ⚠️ Simulated — these portals only grant feed API access to agencies with a signed agreement, so this generates realistic reference codes and status updates without calling their real APIs. Swap in real credentials once the agency has portal API access. |
| "Google Search AI Overview" preview | ⚠️ Simulated by design — no third party can inject content into Google's actual search results; this previews how AI-Overview-style copy could read, to help tune SEO/GMB content |
| 360° virtual tour viewer | ⚠️ UI is real and functional, but uses static panorama images rather than true 360° video capture (e.g. Matterport) |

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and set:
   - `GEMINI_API_KEY` — from https://aistudio.google.com/app/apikey
   - `GOOGLE_PLACES_API_KEY` — from Google Cloud Console (enable Places API + Geocoding API); optional, but the Local Area and live agency rating sections show a "DEMO DATA" fallback without it.
3. Run the app in development:
   ```
   npm run dev
   ```
4. Open http://localhost:3000

## Build & Deploy

```
npm run build
npm start
```

This builds the client with Vite and bundles the Express server into `dist/server.cjs`, then serves the production build on port 3000.
