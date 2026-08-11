// SQLite backend — the zero-setup default. Uses Node's built-in
// `node:sqlite` (stable since Node 22.5, no native compilation required)
// instead of the better-sqlite3 native module — this removes the single
// biggest cause of "npm install" failing on a machine without a C++ build
// toolchain (Xcode CLT / build-essential / windows-build-tools). Requires
// Node.js 22.5.0 or newer.
//
// This module is picked by ../db/index.js whenever DATABASE_URL is unset.
// See ../db/postgres.js for the production alternative.
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, '../../tradepro360.db'));
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

// ---------------------------------------------------------------
// Schema — a simplified, SQLite-portable version of the PostgreSQL
// design in TradePro360-Architecture.docx. Swap this file for a
// Postgres/PostGIS connection when moving to production; the rest
// of the codebase talks to `db` through the same query shape.
// ---------------------------------------------------------------
db.exec(`
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  accent_color TEXT DEFAULT '#FF9F1C',
  subdomain TEXT UNIQUE,
  gmb_location_id TEXT,
  stripe_account_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id),
  role TEXT CHECK(role IN ('customer','engineer','owner','admin')) NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  password_hash TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS engineers (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  tenant_id TEXT REFERENCES tenants(id),
  trade TEXT CHECK(trade IN ('plumbing','electrical','cleaning')) NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  status TEXT CHECK(status IN ('available','busy','offline')) DEFAULT 'available',
  rating_avg REAL DEFAULT 4.8,
  service_radius_km REAL DEFAULT 40
);

CREATE TABLE IF NOT EXISTS part_prices (
  id TEXT PRIMARY KEY,
  trade TEXT NOT NULL,
  job_type_id TEXT NOT NULL,
  job_type_name TEXT NOT NULL,
  part_cost REAL NOT NULL,
  labour_cost REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id),
  customer_name TEXT,
  customer_phone TEXT,
  customer_lat REAL,
  customer_lng REAL,
  address_label TEXT,
  service TEXT NOT NULL,
  job_type_id TEXT NOT NULL,
  job_type_name TEXT NOT NULL,
  engineer_id TEXT REFERENCES engineers(id),
  part_cost REAL, labour_cost REAL, vat REAL, total REAL,
  status TEXT CHECK(status IN ('pending','dispatched','en_route','in_progress','completed','cancelled')) DEFAULT 'pending',
  distance_km REAL,
  eta_min INTEGER,
  payment_method TEXT,
  paid INTEGER DEFAULT 0,
  stripe_payment_intent_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  booking_id TEXT REFERENCES bookings(id),
  sender TEXT CHECK(sender IN ('customer','engineer')) NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS job_photos (
  id TEXT PRIMARY KEY,
  booking_id TEXT REFERENCES bookings(id),
  url TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  booking_id TEXT REFERENCES bookings(id) UNIQUE,
  stars INTEGER CHECK(stars BETWEEN 1 AND 5),
  comment TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
`);

// ---------------- Seed data (idempotent) ----------------
const bcrypt = require('bcryptjs');

function seed() {
  const tenantCount = db.prepare('SELECT COUNT(*) c FROM tenants').get().c;
  if (tenantCount > 0) return;

  const tenantId = 'tenant_demo';
  db.prepare(`INSERT INTO tenants (id, business_name, accent_color, subdomain) VALUES (?,?,?,?)`)
    .run(tenantId, 'TradePro 360', '#FF9F1C', 'demo');

  const demoHash = bcrypt.hashSync('demo1234', 10);

  // Demo owner account — see backend/README.md for these credentials.
  db.prepare(`INSERT INTO users (id, tenant_id, role, name, email, password_hash) VALUES (?,?,?,?,?,?)`)
    .run('owner_demo', tenantId, 'owner', 'Dave (Owner)', 'owner@tradepro360.demo', demoHash);

  const engineers = [
    ['e1','Dave Whitfield','plumbing',51.5074,-0.1278],
    ['e2','Priya Anand','plumbing',52.4862,-1.8904],
    ['e3','Tom Ridley','electrical',53.4808,-2.2426],
    ['e4','Sam O\u2019Connell','electrical',51.4545,-2.5879],
    ['e5','Leah Fletcher','cleaning',53.8008,-1.5491],
    ['e6','Mo Farouk','plumbing',55.9533,-3.1883],
    ['e7','Grace Nyland','cleaning',53.4084,-2.9916],
    ['e8','Ryan Kettle','electrical',54.9783,-1.6178],
  ];
  const insUser = db.prepare(`INSERT INTO users (id, tenant_id, role, name, email, password_hash) VALUES (?,?,?,?,?,?)`);
  const insEng = db.prepare(`INSERT INTO engineers (id, user_id, tenant_id, trade, lat, lng, status, service_radius_km) VALUES (?,?,?,?,?,?,?,?)`);
  engineers.forEach(([id, name, trade, lat, lng]) => {
    const userId = 'u_' + id;
    const email = `${id}@tradepro360.demo`; // e.g. e1@tradepro360.demo, password: demo1234
    insUser.run(userId, tenantId, 'engineer', name, email, demoHash);
    insEng.run(id, userId, tenantId, trade, lat, lng, 'available', 400); // demo data spans the whole UK
  });

  const jobTypes = [
    ['plumbing','tap','Leaking tap repair',15,45],
    ['plumbing','drain','Blocked drain clearance',0,60],
    ['plumbing','boiler','Boiler service',40,90],
    ['plumbing','toilet','Toilet repair',20,50],
    ['plumbing','burst','Emergency pipe burst',35,120],
    ['electrical','socket','Socket replacement',8,40],
    ['electrical','fuseboard','Fuse board upgrade',180,150],
    ['electrical','light','Light fitting install',25,45],
    ['electrical','outage','Emergency power outage',0,110],
    ['cleaning','standard','Standard clean (2hr)',0,50],
    ['cleaning','deep','Deep clean (4hr)',15,95],
    ['cleaning','tenancy','End of tenancy clean',20,140],
    ['cleaning','carpet','Carpet cleaning',10,65],
  ];
  const insPrice = db.prepare(`INSERT INTO part_prices (id, trade, job_type_id, job_type_name, part_cost, labour_cost) VALUES (?,?,?,?,?,?)`);
  jobTypes.forEach(([trade, jid, name, part, labour], i) => {
    insPrice.run('pp_' + i, trade, jid, name, part, labour);
  });

  console.log('Seeded tenant, engineers and price list.');
}
seed();

module.exports = db;
