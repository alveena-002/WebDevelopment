const express = require('express');
const { v4: uuid } = require('uuid');
const db = require('../db');
const { findNearestEngineer } = require('../dispatch');
const { requireAuth, optionalAuth } = require('./auth');
const storage = require('../storage');

module.exports = function (io) {
  const router = express.Router();
  const TENANT_ID = 'tenant_demo'; // single-tenant demo; multi-tenant lookup would key off subdomain/JWT

  // POST /api/bookings — create booking, run AI dispatch, notify over WebSocket
  router.post('/bookings', async (req, res) => {
    const { customerName, customerPhone, addressLabel, lat, lng, trade, jobTypeId } = req.body;
    if (!customerName || !customerPhone || lat == null || lng == null || !trade || !jobTypeId) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const price = await db.prepare('SELECT * FROM part_prices WHERE trade = ? AND job_type_id = ?').get(trade, jobTypeId);
    if (!price) return res.status(404).json({ error: 'Unknown job type' });

    const part = price.part_cost, labour = price.labour_cost;
    const vat = +((part + labour) * 0.2).toFixed(2);
    const total = +(part + labour + vat).toFixed(2);

    const match = await findNearestEngineer(TENANT_ID, trade, lat, lng);
    if (!match) {
      return res.status(409).json({ error: 'No available engineers for this trade right now. Job has been queued.' });
    }

    const id = 'TP' + uuid().slice(0, 6).toUpperCase();
    await db.prepare(`
      INSERT INTO bookings (id, tenant_id, customer_name, customer_phone, customer_lat, customer_lng,
        address_label, service, job_type_id, job_type_name, engineer_id, part_cost, labour_cost, vat, total,
        status, distance_km, eta_min)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(id, TENANT_ID, customerName, customerPhone, lat, lng, addressLabel || '', trade, jobTypeId,
      price.job_type_name, match.engineer.id, part, labour, vat, total, 'dispatched', match.distanceKm, match.etaMin);

    await db.prepare(`UPDATE engineers SET status = 'busy' WHERE id = ?`).run(match.engineer.id);

    const booking = await getBookingWithEngineer(id);
    io.to(id).emit('booking:update', booking);
    res.status(201).json(booking);
  });

  // GET /api/bookings/mine — the logged-in engineer's own assigned jobs
  // (registered before /:id so "mine" isn't swallowed by the wildcard route)
  router.get('/bookings/mine', requireAuth(['engineer']), async (req, res) => {
    const eng = await db.prepare('SELECT id FROM engineers WHERE user_id = ?').get(req.user.id);
    if (!eng) return res.status(404).json({ error: 'No engineer profile linked to this account' });
    const rows = await db.prepare(`SELECT * FROM bookings WHERE engineer_id = ? ORDER BY created_at DESC`).all(eng.id);
    res.json(await Promise.all(rows.map(b => attachEngineer(b))));
  });

  // GET /api/bookings/:id
  router.get('/bookings/:id', async (req, res) => {
    const booking = await getBookingWithEngineer(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  });

  // GET /api/bookings — admin dashboard listing (owner/admin only)
  router.get('/bookings', requireAuth(['owner', 'admin']), async (req, res) => {
    const rows = await db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    res.json(await Promise.all(rows.map(b => attachEngineer(b))));
  });

  // PATCH /api/bookings/:id/status  { status }
  const VALID = ['pending', 'dispatched', 'en_route', 'in_progress', 'completed', 'cancelled'];
  router.patch('/bookings/:id/status', optionalAuth(), async (req, res) => {
    const { status } = req.body;
    if (!VALID.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // If a logged-in engineer is making this call, they must be the assigned engineer.
    // (Anonymous calls are still allowed so the "simulate" demo button keeps working —
    // a real production deployment should make auth mandatory here.)
    if (req.user && req.user.role === 'engineer') {
      const eng = await db.prepare('SELECT id FROM engineers WHERE user_id = ?').get(req.user.id);
      if (!eng || eng.id !== booking.engineer_id) {
        return res.status(403).json({ error: 'You are not the engineer assigned to this job' });
      }
    }

    await db.prepare(`UPDATE bookings SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, booking.id);
    if (status === 'completed' || status === 'cancelled') {
      await db.prepare(`UPDATE engineers SET status = 'available' WHERE id = ?`).run(booking.engineer_id);
    }
    const updated = await getBookingWithEngineer(booking.id);
    io.to(booking.id).emit('booking:update', updated);
    res.json(updated);
  });

  // POST /api/bookings/:id/location — engineer app pushes a GPS ping
  router.post('/bookings/:id/location', optionalAuth(), async (req, res) => {
    const { lat, lng } = req.body;
    const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (req.user && req.user.role === 'engineer') {
      const eng = await db.prepare('SELECT id FROM engineers WHERE user_id = ?').get(req.user.id);
      if (!eng || eng.id !== booking.engineer_id) {
        return res.status(403).json({ error: 'You are not the engineer assigned to this job' });
      }
    }

    await db.prepare(`UPDATE engineers SET lat = ?, lng = ? WHERE id = ?`).run(lat, lng, booking.engineer_id);
    io.to(booking.id).emit('engineer:location', { bookingId: booking.id, lat, lng, at: new Date().toISOString() });
    res.json({ ok: true });
  });

  // ---- Chat ----
  router.get('/bookings/:id/messages', async (req, res) => {
    res.json(await db.prepare('SELECT * FROM chat_messages WHERE booking_id = ? ORDER BY created_at').all(req.params.id));
  });
  router.post('/bookings/:id/messages', async (req, res) => {
    const { sender, body } = req.body;
    if (!['customer', 'engineer'].includes(sender) || !body) return res.status(400).json({ error: 'Invalid message' });
    const msg = { id: uuid(), booking_id: req.params.id, sender, body, created_at: new Date().toISOString() };
    await db.prepare('INSERT INTO chat_messages (id, booking_id, sender, body) VALUES (?,?,?,?)').run(msg.id, msg.booking_id, sender, body);
    io.to(req.params.id).emit('chat:message', msg);
    res.status(201).json(msg);
  });

  // ---- Photos ----
  // Accepts either a data: URI (what TradePro360.html sends, read via
  // FileReader client-side) or an already-hosted URL. Stored through the
  // storage abstraction (S3 if configured, local disk under /uploads
  // otherwise) — the raw base64 string is never written to the database.
  router.post('/bookings/:id/photos', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'url required' });

    let storedUrl;
    try {
      const publicBaseUrl = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
      storedUrl = await storage.savePhoto(req.params.id, url, publicBaseUrl);
    } catch (err) {
      return res.status(400).json({ error: `Could not store photo: ${err.message}` });
    }

    const photo = { id: uuid(), booking_id: req.params.id, url: storedUrl, created_at: new Date().toISOString() };
    await db.prepare('INSERT INTO job_photos (id, booking_id, url) VALUES (?,?,?)').run(photo.id, photo.booking_id, storedUrl);
    io.to(req.params.id).emit('photo:new', photo);
    res.status(201).json(photo);
  });

  // ---- Reviews ----
  router.post('/bookings/:id/review', async (req, res) => {
    const { stars, comment } = req.body;
    const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status !== 'completed') return res.status(409).json({ error: 'Job must be completed before it can be reviewed' });
    await db.prepare('INSERT OR REPLACE INTO reviews (id, booking_id, stars, comment) VALUES (?,?,?,?)')
      .run('rv_' + booking.id, booking.id, stars, comment || '');
    res.status(201).json({ ok: true });
  });

  async function attachEngineer(b) {
    const eng = await db.prepare(`
      SELECT e.*, u.name FROM engineers e JOIN users u ON u.id = e.user_id WHERE e.id = ?
    `).get(b.engineer_id);
    return { ...b, engineer: eng };
  }
  async function getBookingWithEngineer(id) {
    const b = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    return b ? attachEngineer(b) : null;
  }

  return router;
};
