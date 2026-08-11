const express = require('express');
const db = require('../db');
const router = express.Router();

// GET /api/services — list services + job types + live prices
router.get('/services', async (req, res) => {
  const rows = await db.prepare('SELECT * FROM part_prices ORDER BY trade, job_type_id').all();
  const grouped = {};
  rows.forEach(r => {
    grouped[r.trade] = grouped[r.trade] || [];
    grouped[r.trade].push({
      id: r.job_type_id, name: r.job_type_name,
      part: r.part_cost, labour: r.labour_cost,
    });
  });
  res.json(grouped);
});

// POST /api/quotes  { trade, jobTypeId }  -> instant priced quote
router.post('/quotes', async (req, res) => {
  const { trade, jobTypeId } = req.body;
  const row = await db.prepare('SELECT * FROM part_prices WHERE trade = ? AND job_type_id = ?').get(trade, jobTypeId);
  if (!row) return res.status(404).json({ error: 'Unknown service or job type' });

  const part = row.part_cost, labour = row.labour_cost;
  const vat = +( (part + labour) * 0.2 ).toFixed(2);
  const total = +(part + labour + vat).toFixed(2);
  res.json({ trade, jobTypeId, jobTypeName: row.job_type_name, part, labour, vat, total });
});

module.exports = router;
