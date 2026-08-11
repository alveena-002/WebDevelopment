-- TradePro 360 — PostgreSQL schema (migration 001)
-- Mirrors the table shapes in src/db/sqlite.js and the design in
-- TradePro360-Architecture.docx. Applied automatically on startup by
-- src/db/postgres.js (tracked in the schema_migrations table, so it's
-- safe to run every boot — already-applied migrations are skipped).

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  accent_color TEXT DEFAULT '#FF9F1C',
  subdomain TEXT UNIQUE,
  gmb_location_id TEXT,
  stripe_account_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id),
  role TEXT CHECK(role IN ('customer','engineer','owner','admin')) NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS engineers (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  tenant_id TEXT REFERENCES tenants(id),
  trade TEXT CHECK(trade IN ('plumbing','electrical','cleaning')) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  status TEXT CHECK(status IN ('available','busy','offline')) DEFAULT 'available',
  rating_avg DOUBLE PRECISION DEFAULT 4.8,
  service_radius_km DOUBLE PRECISION DEFAULT 40
);
-- Expression index (not a stored column, so it never shows up in
-- `SELECT * FROM engineers` and the row shape stays identical to SQLite).
-- Matching still runs in JS via haversine today (see dispatch.js) so
-- dispatch.js is identical across both backends, but this index makes a
-- future ST_DWithin / ST_Distance rewrite a drop-in optimisation once
-- engineer counts grow beyond what scoring-in-JS can handle.
CREATE INDEX IF NOT EXISTS engineers_geog_idx ON engineers
  USING GIST ((ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography));

CREATE TABLE IF NOT EXISTS part_prices (
  id TEXT PRIMARY KEY,
  trade TEXT NOT NULL,
  job_type_id TEXT NOT NULL,
  job_type_name TEXT NOT NULL,
  part_cost DOUBLE PRECISION NOT NULL,
  labour_cost DOUBLE PRECISION NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id),
  customer_name TEXT,
  customer_phone TEXT,
  customer_lat DOUBLE PRECISION,
  customer_lng DOUBLE PRECISION,
  address_label TEXT,
  service TEXT NOT NULL,
  job_type_id TEXT NOT NULL,
  job_type_name TEXT NOT NULL,
  engineer_id TEXT REFERENCES engineers(id),
  part_cost DOUBLE PRECISION, labour_cost DOUBLE PRECISION, vat DOUBLE PRECISION, total DOUBLE PRECISION,
  status TEXT CHECK(status IN ('pending','dispatched','en_route','in_progress','completed','cancelled')) DEFAULT 'pending',
  distance_km DOUBLE PRECISION,
  eta_min INTEGER,
  payment_method TEXT,
  paid INTEGER DEFAULT 0,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  booking_id TEXT REFERENCES bookings(id),
  sender TEXT CHECK(sender IN ('customer','engineer')) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_photos (
  id TEXT PRIMARY KEY,
  booking_id TEXT REFERENCES bookings(id),
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  booking_id TEXT REFERENCES bookings(id) UNIQUE,
  stars INTEGER CHECK(stars BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
