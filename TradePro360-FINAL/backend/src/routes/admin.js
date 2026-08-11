const express = require('express');
const db = require('../db');
const { requireAuth } = require('./auth');
const router = express.Router();

// GET /api/engineers — roster for the admin dashboard (owner/admin only)
router.get('/engineers', requireAuth(['owner', 'admin']), async (req, res) => {
  const rows = await db.prepare(`
    SELECT e.id, e.trade, e.lat, e.lng, e.status, e.rating_avg, u.name
    FROM engineers e JOIN users u ON u.id = e.user_id
    ORDER BY u.name
  `).all();
  res.json(rows);
});

// GET /api/admin/summary — KPIs for the dashboard (owner/admin only)
router.get('/admin/summary', requireAuth(['owner', 'admin']), async (req, res) => {
  const totalBookings = (await db.prepare('SELECT COUNT(*) c FROM bookings').get()).c;
  const revenue = (await db.prepare('SELECT COALESCE(SUM(total),0) s FROM bookings WHERE paid = 1').get()).s;
  const avgRating = (await db.prepare('SELECT AVG(stars) a FROM reviews').get()).a;
  const availableEngineers = (await db.prepare(`SELECT COUNT(*) c FROM engineers WHERE status = 'available'`).get()).c;
  res.json({
    totalBookings: +totalBookings,
    revenue: +Number(revenue).toFixed(2),
    avgRating: avgRating ? +Number(avgRating).toFixed(2) : null,
    availableEngineers: +availableEngineers,
  });
});

module.exports = router;
