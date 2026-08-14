
# Eatsy — UK High-Street Restaurant Management System

Eatsy is a full-stack restaurant ordering and management platform built for UK high-street restaurants. It combines **QR-code table ordering**, **real-time kitchen operations**, **dynamic stock control**, **smart loyalty rewards**, and **multi-language analytics** in a single application.

## Features

- **QR Table Ordering** — Customers scan a table QR code and order directly from their phone.
- **Live Menu & Cart** — Browse menu items, add to cart, and checkout with tip and discount code support.
- **Real-Time Order Tracking** — Live order status updates via Server-Sent Events (SSE).
- **Kitchen Display System (KDS)** — A dedicated view for kitchen staff to manage incoming orders.
- **Dynamic Stock Control** — Menu item availability updates live across all connected clients.
- **Loyalty Rewards** — Points and rewards system to encourage repeat customers.
- **Table Reservations** — Customers can book tables in advance.
- **Analytics Dashboard** — Sales and performance insights for restaurant owners/managers.
- **AI-Powered Offers** — Uses the Gemini API to generate personalized marketing offers.
- **Multi-language Support** — Built-in i18n with right-to-left (RTL) layout support.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Express, tsx (TypeScript execution) |
| AI | Google Gemini API (`@google/genai`) |
| Charts | Recharts |
| Icons / Animation | lucide-react, motion |

## Project Structure

```
eatsy/
├── server.ts               # Express backend (API routes, SSE, Gemini integration)
├── src/
│   ├── App.tsx              # Main app shell & state management
│   ├── main.tsx             # React entry point
│   ├── types.ts             # Shared TypeScript types
│   ├── components/          # UI components (Menu, Cart, Checkout, KDS, Analytics, etc.)
│   ├── data/mockMenu.ts     # Sample menu data
│   └── lib/i18n.ts          # Translations & language config
├── assets/                  # Static assets
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A [Gemini API key](https://aistudio.google.com/apikey) (free from Google AI Studio)

## Setup & Run Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy the example file and fill in your own values:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local`:
   ```
   GEMINI_API_KEY="your-actual-gemini-api-key"
   APP_URL="http://localhost:3000"
   ```

3. **Start the app**
   ```bash
   npm run dev
   ```
   This runs the Express server with the Vite dev server. Open **http://localhost:3000** in your browser.

## Other Commands

| Command | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Build frontend (Vite) and bundle backend for production |
| `npm run start` | Run the production build (`dist/server.cjs`) |
| `npm run lint` | Type-check the project with TypeScript (no output files) |
| `npm run clean` | Remove build output (`dist/`, `server.js`) |

## API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Health check |
| `/api/realtime/stream` | GET | SSE stream for live updates |
| `/api/menu/stock` | GET | Fetch current menu stock levels |
| `/api/menu/stock/update` | POST | Update stock for a menu item |
| `/api/orders` | GET | Fetch all orders |
| `/api/orders/create` | POST | Create a new order |
| `/api/orders/status` | POST | Update an order's status |
| `/api/ai/generate-offer` | POST | Generate an AI-powered marketing offer (Gemini) |
| `/api/marketing/dispatch` | POST | Dispatch a marketing offer |
| `/api/marketing/logs` | GET | Fetch marketing dispatch logs |

## Notes

- Without a valid `GEMINI_API_KEY`, all features will work **except** the AI-generated offers.
- `.env.example` is a template only — never commit your real `.env.local` file (it's already git-ignored).


<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/c91aedb4-be9f-43c5-b265-ac7ae14e9122" />
<img width="1366" height="728" alt="image (1)" src="https://github.com/user-attachments/assets/bee90937-6e97-4c55-8b1e-ef933accf3b3" />
<img width="1366" height="728" alt="image (2)" src="https://github.com/user-attachments/assets/ab1c47d3-66e8-40a5-a746-3a69691ca206" />
<img width="1366" height="728" alt="image (3)" src="https://github.com/user-attachments/assets/110b5cbe-b8b6-44d7-81b5-33a7a4a9c698" />
<img width="1366" height="728" alt="image (4)" src="https://github.com/user-attachments/assets/a4454f36-1237-487a-b013-348e8e944888" />
<img width="1366" height="728" alt="image (5)" src="https://github.com/user-attachments/assets/95a31da6-e9b7-4229-912b-eecbe250fd32" />
<img width="1366" height="728" alt="image (6)" src="https://github.com/user-attachments/assets/463afcd9-8025-4f60-82e2-ecdd40cc6c9a" />
<img width="1366" height="728" alt="image (7)" src="https://github.com/user-attachments/assets/dfebccff-cf67-4970-bdcb-31b2f5847a5a" />
<img width="1366" height="728" alt="image (8)" src="https://github.com/user-attachments/assets/5cd3aab1-77bb-49a0-b4eb-95646733c61a" />
<img width="1366" height="728" alt="image (9)" src="https://github.com/user-attachments/assets/7381b4dd-d32e-4b66-8d8d-3d88b63b6c4d" />
<img width="1366" height="728" alt="image (10)" src="https://github.com/user-attachments/assets/39fbac65-5c0b-40de-beb0-882c4961ac11" />
<img width="1366" height="728" alt="image (11)" src="https://github.com/user-attachments/assets/9d98c34f-aac4-432a-8b75-0265d0789e3d" />
<img width="1366" height="728" alt="image (12)" src="https://github.com/user-attachments/assets/f6121a8e-0164-46e7-9b01-f53edad6d483" />
<img width="1366" height="728" alt="image (13)" src="https://github.com/user-attachments/assets/22e94e61-90ce-45a0-bd64-c2d2a48e6246" />
<img width="1366" height="728" alt="image (14)" src="https://github.com/user-attachments/assets/c21c8453-61f7-4057-b4f8-47aa4374a636" />
<img width="1366" height="728" alt="image (15)" src="https://github.com/user-attachments/assets/f2b2b541-0c27-40fc-a08b-3493d777a058" />
<img width="1366" height="728" alt="image (16)" src="https://github.com/user-attachments/assets/f948db23-4a21-442f-b956-5fb009a294f4" />
