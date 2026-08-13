import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Gemini API features will fallback to smart defaults.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-Memory Real-Time Store for Menu Stock & Orders (Simulating Supabase Realtime)
let menuStockStore: Record<string, { stock: number; isAvailable: boolean }> = {
  "item-1": { stock: 8, isAvailable: true }, // Fish & Chips
  "item-2": { stock: 3, isAvailable: true }, // Sunday Roast Beef (Low stock)
  "item-3": { stock: 12, isAvailable: true }, // Halal Smash Burger
  "item-4": { stock: 0, isAvailable: false }, // Vegan Shepherd's Pie (Sold out)
  "item-5": { stock: 15, isAvailable: true }, // Chicken Tikka Masala
  "item-6": { stock: 20, isAvailable: true }, // Full English Breakfast
  "item-7": { stock: 25, isAvailable: true }, // Artisan Flat White
  "item-8": { stock: 10, isAvailable: true }, // London Pride Pint
};

let liveOrdersStore: Array<{
  id: string;
  orderNumber: string;
  tableNumber: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  total: number;
  tip: number;
  totalWithTip: number;
  status: "Received" | "Preparing" | "Ready" | "Served";
  timestamp: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  commissionSaved: number;
}> = [
  {
    id: "ord-101",
    orderNumber: "#EAT-8021",
    tableNumber: "Table 4",
    items: [
      { id: "item-1", name: "Beer Battered Fish & Chips", quantity: 2, price: 15.5 },
      { id: "item-8", name: "London Pride Cask Ale Pint", quantity: 2, price: 5.8 },
    ],
    total: 42.6,
    tip: 5.32,
    totalWithTip: 47.92,
    status: "Preparing",
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    customerName: "Liam Smith",
    customerPhone: "+44 7700 900123",
    commissionSaved: 12.78,
  },
  {
    id: "ord-102",
    orderNumber: "#EAT-8022",
    tableNumber: "Table 2",
    items: [
      { id: "item-3", name: "Halal Angus Smash Burger & Fries", quantity: 1, price: 14.0 },
      { id: "item-7", name: "Artisan Flat White Coffee", quantity: 1, price: 3.8 },
    ],
    total: 17.8,
    tip: 2.22,
    totalWithTip: 20.02,
    status: "Received",
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    customerName: "Amina Khan",
    customerEmail: "sunainaalmas725@gmail.com",
    commissionSaved: 5.34,
  },
];

let marketingDispatchLogs: Array<{
  id: string;
  channel: "SMS" | "Email";
  recipient: string;
  offerCode: string;
  messageText: string;
  status: "Delivered" | "Queued";
  timestamp: string;
}> = [];

// SSE Real-time Subscription Clients
let sseClients: Array<express.Response> = [];

function notifyRealtimeClients(eventType: string, data: any) {
  const payload = `data: ${JSON.stringify({ type: eventType, data, timestamp: new Date().toISOString() })}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(payload);
    } catch (err) {
      // Ignore broken pipe
    }
  });
}

// API Routes

// 1. Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Eatsy UK Restaurant System Backend", time: new Date().toISOString() });
});

// 2. Real-time Event SSE Endpoint
app.get("/api/realtime/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  sseClients.push(res);

  req.on("close", () => {
    sseClients = sseClients.filter((client) => client !== res);
  });
});

// 3. Menu Stock API
app.get("/api/menu/stock", (_req, res) => {
  res.json({ stock: menuStockStore });
});

app.post("/api/menu/stock/update", (req, res) => {
  const { itemId, stock, isAvailable } = req.body;
  if (!itemId) {
    return res.status(400).json({ error: "itemId is required" });
  }

  const current = menuStockStore[itemId] || { stock: 10, isAvailable: true };
  menuStockStore[itemId] = {
    stock: typeof stock === "number" ? Math.max(0, stock) : current.stock,
    isAvailable: typeof isAvailable === "boolean" ? isAvailable : (typeof stock === "number" ? stock > 0 : current.isAvailable),
  };

  notifyRealtimeClients("STOCK_UPDATED", { itemId, ...menuStockStore[itemId] });
  res.json({ success: true, itemId, updated: menuStockStore[itemId] });
});

// 4. Live Orders API
app.get("/api/orders", (_req, res) => {
  res.json({ orders: liveOrdersStore });
});

app.post("/api/orders/create", (req, res) => {
  const { tableNumber, items, total, tip, customerName, customerPhone, customerEmail } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: "Cart items required" });
  }

  const orderNumber = `#EAT-${Math.floor(1000 + Math.random() * 9000)}`;
  const id = `ord-${Date.now()}`;
  const totalNum = Number(total) || 0;
  const tipNum = Number(tip) || 0;
  const commissionSaved = Number((totalNum * 0.30).toFixed(2)); // 30% Deliveroo fee saved

  const newOrder = {
    id,
    orderNumber,
    tableNumber: tableNumber || "Table 1",
    items,
    total: totalNum,
    tip: tipNum,
    totalWithTip: Number((totalNum + tipNum).toFixed(2)),
    status: "Received" as const,
    timestamp: new Date().toISOString(),
    customerName: customerName || "Guest Customer",
    customerPhone,
    customerEmail,
    commissionSaved,
  };

  // Decrement stock for ordered items
  items.forEach((item: { id: string; quantity: number }) => {
    if (menuStockStore[item.id]) {
      const currentStock = menuStockStore[item.id].stock;
      const newStock = Math.max(0, currentStock - item.quantity);
      menuStockStore[item.id] = {
        stock: newStock,
        isAvailable: newStock > 0,
      };
      notifyRealtimeClients("STOCK_UPDATED", { itemId: item.id, ...menuStockStore[item.id] });
    }
  });

  liveOrdersStore.unshift(newOrder);
  notifyRealtimeClients("ORDER_CREATED", newOrder);

  res.json({ success: true, order: newOrder });
});

app.post("/api/orders/status", (req, res) => {
  const { orderId, status } = req.body;
  const order = liveOrdersStore.find((o) => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  order.status = status;
  notifyRealtimeClients("ORDER_STATUS_CHANGED", { orderId, status, orderNumber: order.orderNumber });
  res.json({ success: true, order });
});

// 5. Gemini AI Personalized Loyalty Offer Generator
app.post("/api/ai/generate-offer", async (req, res) => {
  try {
    const { customerName, occasion, favoriteCategory, visitCount, language } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response if no API key set
      const promoCode = `EATSY-${(occasion || "SPECIAL").toUpperCase().slice(0, 4)}-${Math.floor(100 + Math.random() * 900)}`;
      return res.json({
        promoCode,
        discountTitle: "20% Off Your Next High-Street Feast",
        smsCopy: `Hi ${customerName || "Foodie"}! Enjoy 20% OFF at The Red Lion & Kitchen today! Use code ${promoCode} at QR table checkout or online. Saved 30% direct with Eatsy!`,
        emailSubject: `Exclusive UK Pub & Cafe Offer for ${customerName || "you"}!`,
        emailBody: `Dear ${customerName || "Customer"},\n\nWe love having you at The Red Lion & Kitchen! As a valued guest (${visitCount || 3} visits), here is an exclusive 20% voucher: ${promoCode}.\n\nOrder via QR code on your phone to skip the queue & get instant table delivery!\n\nWarm regards,\nThe Eatsy High-Street Team`,
        targetPerks: ["20% Discount", "Free Artisan Coffee Upgrade", "Priority Table Serving"],
      });
    }

    const prompt = `You are the AI Marketing & Loyalty Assistant for "The Red Lion & Kitchen", a popular UK High-Street pub & cafe using Eatsy digital ordering system.
Customer Details:
- Name: ${customerName || "Valued Customer"}
- Occasion/Preference: ${occasion || "Regular High-Street Visit"}
- Favorite Food Category: ${favoriteCategory || "Pub Classics & Sunday Roast"}
- Visit History: ${visitCount || 3} visits
- Target Language: ${language || "English"}

Generate a personalized, warm, British high-street promotional campaign offer. Output ONLY valid JSON in the following format:
{
  "promoCode": "EATSY-XXXX-123",
  "discountTitle": "Catchy 3-5 word offer title",
  "smsCopy": "SMS text under 160 chars with promo code and UK warmth",
  "emailSubject": "Compelling email subject line",
  "emailBody": "Friendly 3-paragraph email with British pub/cafe style, details on saving delivery fees by ordering direct",
  "targetPerks": ["Perk 1", "Perk 2", "Perk 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const parsedData = JSON.parse(jsonText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini AI offer generation error:", error);
    res.status(500).json({
      error: "Failed to generate AI offer",
      details: error?.message || String(error),
    });
  }
});

// 6. Twilio/SendGrid Dispatch Simulator API
app.post("/api/marketing/dispatch", (req, res) => {
  const { channel, recipient, offerCode, messageText } = req.body;

  const logEntry = {
    id: `log-${Date.now()}`,
    channel: channel || "SMS",
    recipient: recipient || "+44 7700 900123",
    offerCode: offerCode || "EATSY-20",
    messageText: messageText || "Special offer dispatched!",
    status: "Delivered" as const,
    timestamp: new Date().toISOString(),
  };

  marketingDispatchLogs.unshift(logEntry);
  notifyRealtimeClients("DISPATCH_LOGGED", logEntry);

  res.json({
    success: true,
    provider: channel === "SMS" ? "Twilio SMS API" : "SendGrid Email API",
    log: logEntry,
  });
});

app.get("/api/marketing/logs", (_req, res) => {
  res.json({ logs: marketingDispatchLogs });
});

// Vite Middleware for Dev, Static serving for Prod
async function startApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Eatsy UK Restaurant System Server running on http://0.0.0.0:${PORT}`);
  });
}

startApp();
