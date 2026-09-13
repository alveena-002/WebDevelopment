// server.js
// Express backend that serves the Snake game (frontend) and exposes
// a small REST API backed by SQLite for saving and retrieving
// high scores.

const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON request bodies.
app.use(express.json());

// Serve the frontend (HTML/CSS/JS) from the "public" folder.
app.use(express.static(path.join(__dirname, 'public')));

// ---------- API ROUTES ----------

// GET /api/highscores -> top 10 scores, highest first
app.get('/api/highscores', (req, res) => {
  try {
    const scores = db
      .prepare('SELECT player_name, score, created_at FROM scores ORDER BY score DESC, created_at ASC LIMIT 10')
      .all();
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch high scores' });
  }
});

// POST /api/scores -> save a new score { player_name, score }
app.post('/api/scores', (req, res) => {
  try {
    const { player_name, score } = req.body;

    if (!player_name || typeof player_name !== 'string' || player_name.trim() === '') {
      return res.status(400).json({ error: 'player_name is required' });
    }
    if (typeof score !== 'number' || !Number.isFinite(score) || score < 0) {
      return res.status(400).json({ error: 'score must be a valid non-negative number' });
    }

    const cleanName = player_name.trim().substring(0, 20);
    const stmt = db.prepare('INSERT INTO scores (player_name, score) VALUES (?, ?)');
    const info = stmt.run(cleanName, Math.floor(score));

    res.status(201).json({ id: info.lastInsertRowid, player_name: cleanName, score: Math.floor(score) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// Fallback: serve index.html for the root route (in case of direct navigation)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🐍 Snake game server running at http://localhost:${PORT}`);
});
