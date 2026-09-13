// database.js
// Sets up the SQLite database and the "scores" table used for the
// high-score leaderboard. Uses Node.js's BUILT-IN "node:sqlite" module
// (available in Node 22+), so no native compilation / build tools are
// required — this avoids the Visual Studio / node-gyp issues that
// better-sqlite3 can cause on Windows.

const { DatabaseSync } = require('node:sqlite');
const path = require('path');

// The database file will be created automatically in the project folder.
const db = new DatabaseSync(path.join(__dirname, 'scores.db'));

// Create the scores table if it doesn't already exist.
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
