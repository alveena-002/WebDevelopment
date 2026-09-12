
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

<img width="1366" height="728" alt="image (17)" src="https://github.com/user-attachments/assets/693d6792-c8cf-4c24-b60e-f35ae3ed272a" />
<img width="1366" height="728" alt="image (18)" src="https://github.com/user-attachments/assets/af932428-b159-4edb-8b39-5eb9bc368380" />
<img width="1366" height="728" alt="image (19)" src="https://github.com/user-attachments/assets/45cff078-95fd-4490-b8b0-77bd49522cd7" />
<img width="1366" height="728" alt="image (20)" src="https://github.com/user-attachments/assets/3f7b2fe4-794c-46df-890b-d688b1ffe282" />
<img width="1366" height="728" alt="image (21)" src="https://github.com/user-attachments/assets/1c8124ff-797d-4c4d-b45e-96ae98e9ffce" />
<img width="1366" height="728" alt="image (22)" src="https://github.com/user-attachments/assets/306b054c-a2dc-4070-b8ec-0e8d464584b7" />
<img width="1366" height="728" alt="image (23)" src="https://github.com/user-attachments/assets/68854250-423b-472f-9927-653b93c2b5e2" />
<img width="1366" height="728" alt="image (24)" src="https://github.com/user-attachments/assets/587d66aa-b6c2-4a8d-b2b2-6acb1e4af612" />
<img width="1366" height="728" alt="image (25)" src="https://github.com/user-attachments/assets/3ec3bdc6-16f0-46db-be0b-10072514e557" />
<img width="1366" height="728" alt="image (26)" src="https://github.com/user-attachments/assets/6f357ade-400f-4cb2-81ea-4c0a2d947f8b" />
<img width="1366" height="728" alt="image (27)" src="https://github.com/user-attachments/assets/e713fec0-fc02-4f22-a36a-5a0c62deb8f5" />
<img width="1366" height="728" alt="image (28)" src="https://github.com/user-attachments/assets/463be581-e1e6-463c-bb16-561376a350e3" />
<img width="1366" height="728" alt="image (29)" src="https://github.com/user-attachments/assets/39a77b25-6acc-4ee2-a462-7eefaf58c8ff" />
<img width="1366" height="728" alt="image (30)" src="https://github.com/user-attachments/assets/5106ffc5-d02f-4634-b5be-782c38d300ce" />
<img width="1366" height="728" alt="image (31)" src="https://github.com/user-attachments/assets/e5f24519-f7f2-48a6-a945-945348e01c52" />
<img width="1366" height="728" alt="image (32)" src="https://github.com/user-attachments/assets/d1471c9d-8e54-4e5b-9794-a8efd5983f4d" />
<img width="1366" height="728" alt="image (33)" src="https://github.com/user-attachments/assets/0a377a83-c6fd-4cf8-8675-bec95a23837d" />
<img width="1366" height="728" alt="image (34)" src="https://github.com/user-attachments/assets/fcae1fdf-f52c-4613-af89-33da2bf77fc8" />
<img width="1366" height="728" alt="image (35)" src="https://github.com/user-attachments/assets/28b2cb5b-3e3e-4c21-824f-c2106306f45c" />
<img width="1366" height="728" alt="image (36)" src="https://github.com/user-attachments/assets/ff0c9c05-c432-444f-9763-7d69e5162781" />
<img width="1366" height="728" alt="image (37)" src="https://github.com/user-attachments/assets/07855f1d-ee0c-4872-a345-38b277974213" />
