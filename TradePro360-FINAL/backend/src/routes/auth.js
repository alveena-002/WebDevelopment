const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const TENANT_ID = 'tenant_demo';

const router = express.Router();

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, name: user.name, tenantId: user.tenant_id }, JWT_SECRET, { expiresIn: '12h' });
}

// POST /api/auth/register  { name, email, password, role }
router.post('/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'name, email, password and role are required' });
  if (!['customer', 'engineer', 'owner'].includes(role)) return res.status(400).json({ error: 'role must be customer, engineer or owner' });

  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'An account with that email already exists' });

  const hash = await bcrypt.hash(password, 10);
  const id = uuid();
  await db.prepare(`INSERT INTO users (id, tenant_id, role, name, email, password_hash) VALUES (?,?,?,?,?,?)`)
    .run(id, TENANT_ID, role, name, email.toLowerCase(), hash);

  const user = { id, role, name, tenant_id: TENANT_ID };
  res.status(201).json({ token: signToken(user), user: { id, name, role } });
});

// POST /api/auth/login  { email, password }
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  const user = await db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user || !user.password_hash) return res.status(401).json({ error: 'Invalid email or password' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

  // If this user is an engineer, include their engineer_id — the engineer
  // app needs it to fetch "my bookings" and push location updates.
  let engineerId = null;
  if (user.role === 'engineer') {
    const eng = await db.prepare('SELECT id FROM engineers WHERE user_id = ?').get(user.id);
    engineerId = eng ? eng.id : null;
  }

  res.json({ token: signToken(user), user: { id: user.id, name: user.name, role: user.role, engineerId } });
});

// GET /api/auth/me — sanity check for a token
router.get('/auth/me', requireAuth(), (req, res) => res.json({ user: req.user }));

// ---- Middleware ----
// requireAuth() -> any logged-in user. requireAuth(['owner','admin']) -> only those roles.
function requireAuth(allowedRoles) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing Authorization: Bearer <token> header' });
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { id: payload.sub, role: payload.role, name: payload.name, tenantId: payload.tenantId };
      if (allowedRoles && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: `This action requires one of: ${allowedRoles.join(', ')}` });
      }
      next();
    } catch (e) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

// optionalAuth — attaches req.user if a valid token is present, but never blocks the request.
// Used on endpoints that support both the anonymous demo flow and real logged-in engineers.
function optionalAuth() {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = { id: payload.sub, role: payload.role, name: payload.name, tenantId: payload.tenantId };
      } catch (e) { /* ignore invalid token, proceed anonymously */ }
    }
    next();
  };
}

module.exports = { router, requireAuth, optionalAuth };
