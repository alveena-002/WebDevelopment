const express = require('express');
const PDFDocument = require('pdfkit');
const db = require('../db');
const router = express.Router();

// Stripe only initialises if a real secret key is supplied — the routes
// below still work in "demo" mode without one so the API is runnable
// out of the box; see README for wiring up real payments.
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// GET /api/bookings/:id/invoice.pdf — server-generated PDF (Section 6.2 of the spec)
router.get('/bookings/:id/invoice.pdf', async (req, res) => {
  const b = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  const eng = await db.prepare('SELECT * FROM engineers WHERE id = ?').get(b.engineer_id);
  const engUser = eng ? await db.prepare('SELECT * FROM users WHERE id = ?').get(eng.user_id) : null;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Invoice-${b.id}.pdf`);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(20).font('Helvetica-Bold').text('TradePro 360', { continued: false });
  doc.fontSize(9).font('Helvetica').fillColor('#5C6672')
    .text('123 Trade Street, London \u00b7 VAT GB123456789');
  doc.moveUp(2);
  doc.fontSize(10).fillColor('#000').text(`Invoice ${b.id}`, { align: 'right' });
  doc.fontSize(9).fillColor('#5C6672').text(new Date(b.created_at).toLocaleDateString('en-GB'), { align: 'right' });

  doc.moveDown(2);
  doc.fontSize(11).fillColor('#000').font('Helvetica-Bold').text('Billed to');
  doc.font('Helvetica').fontSize(10)
    .text(b.customer_name)
    .text(b.customer_phone)
    .text(b.address_label || '');

  doc.moveDown(1.5);
  const tableTop = doc.y;
  doc.font('Helvetica-Bold').fontSize(10);
  doc.text('Description', 50, tableTop);
  doc.text('Amount', 450, tableTop, { width: 100, align: 'right' });
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor('#E2DED3').stroke();

  let y = tableTop + 24;
  doc.font('Helvetica').fontSize(10);
  const engName = engUser ? engUser.name : 'Assigned engineer';
  const rows = [
    [`${b.job_type_name} \u2014 parts & materials`, b.part_cost],
    [`${b.job_type_name} \u2014 labour (${engName})`, b.labour_cost],
    ['VAT (20%)', b.vat],
  ];
  rows.forEach(([label, amt]) => {
    doc.text(label, 50, y);
    doc.text(`\u00a3${amt.toFixed(2)}`, 450, y, { width: 100, align: 'right' });
    y += 20;
  });
  doc.moveTo(50, y).lineTo(550, y).strokeColor('#E2DED3').stroke();
  y += 10;
  doc.font('Helvetica-Bold').fontSize(13);
  doc.text('Total due', 50, y);
  doc.text(`\u00a3${b.total.toFixed(2)}`, 450, y, { width: 100, align: 'right' });

  doc.fontSize(9).font('Helvetica').fillColor('#5C6672')
    .text('Thank you for booking with TradePro 360.', 50, 760);

  doc.end();
});

// POST /api/bookings/:id/pay-now — creates a Stripe PaymentIntent (or a
// demo stand-in if no Stripe key is configured).
router.post('/bookings/:id/pay-now', async (req, res) => {
  const b = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!b) return res.status(404).json({ error: 'Booking not found' });

  if (!stripe) {
    // Demo mode — no real charge, mirrors what the webhook would do on success.
    await db.prepare(`UPDATE bookings SET paid = 1, payment_method = 'now' WHERE id = ?`).run(b.id);
    return res.json({ demoMode: true, message: 'STRIPE_SECRET_KEY not set — simulated success. See README.', paid: true });
  }

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(b.total * 100),
    currency: 'gbp',
    metadata: { bookingId: b.id },
  });
  await db.prepare(`UPDATE bookings SET stripe_payment_intent_id = ?, payment_method = 'now' WHERE id = ?`).run(intent.id, b.id);
  res.json({ clientSecret: intent.client_secret });
});

// POST /api/bookings/:id/pay-later — flags the booking for invoiced payment
router.post('/bookings/:id/pay-later', async (req, res) => {
  const b = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  await db.prepare(`UPDATE bookings SET payment_method = 'later' WHERE id = ?`).run(b.id);
  res.json({ ok: true, message: 'Invoice will be emailed/texted with a hosted payment link on completion.' });
});

// POST /api/stripe/webhook — where Stripe confirms real payments (Section 6.1)
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.status(400).json({ error: 'Stripe not configured' });
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }
  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const bookingId = intent.metadata.bookingId;
    await db.prepare(`UPDATE bookings SET paid = 1 WHERE id = ?`).run(bookingId);
  }
  res.json({ received: true });
});

module.exports = router;
