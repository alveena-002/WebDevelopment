require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');

const db = require('./db');
const quotesRoutes = require('./routes/quotes');
const adminRoutes = require('./routes/admin');
const paymentsRoutes = require('./routes/payments');
const { router: authRoutes } = require('./routes/auth');
const { UPLOAD_DIR } = require('./storage');

const app = express();
const server = http.createServer(app);

// CORS — comma-separated allowlist via CORS_ORIGIN (e.g.
// "https://app.example.com,https://admin.example.com"). Defaults to
// wildcard when unset so local dev / opening the HTML files directly
// keeps working exactly as before.
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()).filter(Boolean)
  : '*';
const io = new Server(server, { cors: { origin: corsOrigins } });

app.use(helmet({
  // Job photos and the invoice PDF are fetched cross-origin by the
  // standalone HTML apps, so keep the defaults from blocking that.
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({ origin: corsOrigins }));

// Stripe webhook needs the raw body, so it's mounted before express.json()
app.use('/api', paymentsRoutes);
app.use(express.json({ limit: '5mb' }));

// Local-disk photo fallback (only used when S3 env vars aren't set — see
// src/storage.js) is served statically here.
app.use('/uploads', express.static(UPLOAD_DIR));

// Rate limiting on the endpoints most worth protecting: auth (brute force /
// credential stuffing) and booking creation (spam / abuse of AI dispatch).
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });
const bookingLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false });
app.use('/api/auth', authLimiter);
app.use('/api/bookings', (req, res, next) => (req.method === 'POST' && req.path === '/' ? bookingLimiter(req, res, next) : next()));

const bookingsRoutes = require('./routes/bookings')(io);

app.use('/api', authRoutes);
app.use('/api', quotesRoutes);
app.use('/api', bookingsRoutes);
app.use('/api', adminRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'tradepro360-api', database: process.env.DATABASE_URL ? 'postgres' : 'sqlite' }));

// ---------------- WebSocket ----------------
// Clients join a room per booking to receive status, location and chat
// updates in real time (Section 5 of the architecture spec).
io.on('connection', (socket) => {
  socket.on('join', (bookingId) => socket.join(bookingId));
  socket.on('leave', (bookingId) => socket.leave(bookingId));
});

const PORT = process.env.PORT || 4000;

// Wait for migrations + seed data (a real round-trip against Postgres; an
// already-resolved promise against SQLite) before accepting traffic.
db.ready.then(() => {
  server.listen(PORT, () => {
    console.log(`TradePro 360 API listening on http://localhost:${PORT}`);
    console.log(`Database: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite (zero-setup default)'}`);
    console.log(`Try:  curl http://localhost:${PORT}/api/health`);
  });
}).catch((err) => {
  console.error('Failed to initialise database:', err);
  process.exit(1);
});
