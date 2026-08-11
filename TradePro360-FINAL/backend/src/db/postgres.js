// PostgreSQL backend — selected automatically by ./index.js whenever
// DATABASE_URL is set. Requires the `postgis` extension to be available
// on the target Postgres instance (the docker-compose Postgres image at
// the project root, `postgis/postgis`, already includes it).
//
// The rest of the codebase was written against better-sqlite3/node:sqlite's
// synchronous `db.prepare(sql).get/all/run(...params)` shape. Rather than
// duplicate every inline query for a second, Postgres-idiomatic query
// layer, this module wraps `pg` behind the *same* prepare().get/all/run
// interface — but async, returning promises. Every call-site in the
// routes already does `await db.prepare(...).get(...)` etc. for exactly
// this reason: it's a no-op extra tick against SQLite (an `await` on a
// plain value just resolves immediately) and a real async round-trip
// against Postgres.
//
// Two small SQL translations happen automatically so the *same* query
// strings work against both engines:
//   1. `?` positional placeholders -> `$1, $2, ...`
//   2. SQLite-only syntax used in a couple of call-sites — datetime('now')
//      and `INSERT OR REPLACE INTO reviews` — is rewritten to its Postgres
//      equivalent (NOW() / INSERT ... ON CONFLICT). If you add a new
//      query using SQLite-specific syntax, extend `translate()` below.
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function toPositional(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

function translate(sql) {
  let out = toPositional(sql);
  out = out.replace(/datetime\('now'\)/gi, 'NOW()');
  if (/INSERT OR REPLACE INTO reviews/i.test(out)) {
    out = out
      .replace(/INSERT OR REPLACE INTO reviews/i, 'INSERT INTO reviews')
      .replace(/;?\s*$/, '') +
      ' ON CONFLICT (booking_id) DO UPDATE SET stars = EXCLUDED.stars, comment = EXCLUDED.comment';
  }
  return out;
}

function prepare(sql) {
  const text = translate(sql);
  return {
    async get(...params) {
      const { rows } = await pool.query(text, params);
      return rows[0];
    },
    async all(...params) {
      const { rows } = await pool.query(text, params);
      return rows;
    },
    async run(...params) {
      const result = await pool.query(text, params);
      return { changes: result.rowCount };
    },
  };
}

async function exec(sql) {
  await pool.query(sql);
}

// ---------------- Migrations ----------------
async function runMigrations() {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ DEFAULT NOW())`);
  const dir = path.join(__dirname, '../../migrations');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  for (const file of files) {
    const { rows } = await pool.query('SELECT 1 FROM schema_migrations WHERE name = $1', [file]);
    if (rows.length) continue;
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    console.log(`[postgres] applying migration ${file}`);
    await pool.query(sql);
    await pool.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
  }
}

// ---------------- Seed data (idempotent, mirrors src/db/sqlite.js) ----------------
async function seed() {
  const { rows } = await pool.query('SELECT COUNT(*)::int c FROM tenants');
  if (rows[0].c > 0) return;

  const tenantId = 'tenant_demo';
  await pool.query(`INSERT INTO tenants (id, business_name, accent_color, subdomain) VALUES ($1,$2,$3,$4)`,
    [tenantId, 'TradePro 360', '#FF9F1C', 'demo']);

  const demoHash = await bcrypt.hash('demo1234', 10);

  await pool.query(`INSERT INTO users (id, tenant_id, role, name, email, password_hash) VALUES ($1,$2,$3,$4,$5,$6)`,
    ['owner_demo', tenantId, 'owner', 'Dave (Owner)', 'owner@tradepro360.demo', demoHash]);

  const engineers = [
    ['e1', 'Dave Whitfield', 'plumbing', 51.5074, -0.1278],
    ['e2', 'Priya Anand', 'plumbing', 52.4862, -1.8904],
    ['e3', 'Tom Ridley', 'electrical', 53.4808, -2.2426],
    ['e4', 'Sam O\u2019Connell', 'electrical', 51.4545, -2.5879],
    ['e5', 'Leah Fletcher', 'cleaning', 53.8008, -1.5491],
    ['e6', 'Mo Farouk', 'plumbing', 55.9533, -3.1883],
    ['e7', 'Grace Nyland', 'cleaning', 53.4084, -2.9916],
    ['e8', 'Ryan Kettle', 'electrical', 54.9783, -1.6178],
  ];
  for (const [id, name, trade, lat, lng] of engineers) {
    const userId = 'u_' + id;
    const email = `${id}@tradepro360.demo`;
    await pool.query(`INSERT INTO users (id, tenant_id, role, name, email, password_hash) VALUES ($1,$2,$3,$4,$5,$6)`,
      [userId, tenantId, 'engineer', name, email, demoHash]);
    await pool.query(`INSERT INTO engineers (id, user_id, tenant_id, trade, lat, lng, status, service_radius_km) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, userId, tenantId, trade, lat, lng, 'available', 400]);
  }

  const jobTypes = [
    ['plumbing', 'tap', 'Leaking tap repair', 15, 45],
    ['plumbing', 'drain', 'Blocked drain clearance', 0, 60],
    ['plumbing', 'boiler', 'Boiler service', 40, 90],
    ['plumbing', 'toilet', 'Toilet repair', 20, 50],
    ['plumbing', 'burst', 'Emergency pipe burst', 35, 120],
    ['electrical', 'socket', 'Socket replacement', 8, 40],
    ['electrical', 'fuseboard', 'Fuse board upgrade', 180, 150],
    ['electrical', 'light', 'Light fitting install', 25, 45],
    ['electrical', 'outage', 'Emergency power outage', 0, 110],
    ['cleaning', 'standard', 'Standard clean (2hr)', 0, 50],
    ['cleaning', 'deep', 'Deep clean (4hr)', 15, 95],
    ['cleaning', 'tenancy', 'End of tenancy clean', 20, 140],
    ['cleaning', 'carpet', 'Carpet cleaning', 10, 65],
  ];
  let i = 0;
  for (const [trade, jid, name, part, labour] of jobTypes) {
    await pool.query(`INSERT INTO part_prices (id, trade, job_type_id, job_type_name, part_cost, labour_cost) VALUES ($1,$2,$3,$4,$5,$6)`,
      ['pp_' + (i++), trade, jid, name, part, labour]);
  }

  console.log('[postgres] seeded tenant, engineers and price list.');
}

// Top-level await isn't available in CommonJS, so callers (src/db/index.js)
// await `ready` before the server starts accepting requests.
const ready = (async () => {
  await runMigrations();
  await seed();
})();

module.exports = { prepare, exec, ready };
