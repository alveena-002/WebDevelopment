// Database selector — picks the backend based on DATABASE_URL.
//
//   unset / empty  -> SQLite (./sqlite.js), zero setup, file-based, synchronous.
//   set            -> PostgreSQL + PostGIS (./postgres.js), async.
//
// Every route talks to `db.prepare(sql).get/all/run(...params)`, exactly
// like better-sqlite3. Route handlers use `await` on these calls so the
// same code works against both backends (an `await` on SQLite's plain
// synchronous return value is a no-op; against Postgres it's a real
// async round-trip). See ../db/postgres.js for the translation layer
// that lets the *same* SQL strings run on both engines.
//
// `db.ready` is a promise that resolves once migrations + seed data are
// confirmed in place. server.js awaits it before accepting traffic.
if (process.env.DATABASE_URL) {
  module.exports = require('./postgres');
} else {
  const sqlite = require('./sqlite'); // the node:sqlite DatabaseSync instance
  module.exports = {
    prepare: (sql) => sqlite.prepare(sql),
    exec: (sql) => sqlite.exec(sql),
    ready: Promise.resolve(),
  };
}
