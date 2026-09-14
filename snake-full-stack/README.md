# 🐍 Snake Game — Full Stack

A complete full-stack Snake game with a persistent high-score leaderboard.

## Tech Stack
- **Frontend:** HTML5 Canvas, CSS3, Vanilla JavaScript
- **Backend:** Node.js + Express
- **Database:** SQLite (via Node's built-in `node:sqlite` module — no native
  build tools required, works out of the box on Windows/Mac/Linux)

> **Requires Node.js v22.5.0 or newer** (check with `node -v`). This is
> needed because `node:sqlite` is a built-in module only available from
> that version onward.

## Features
- Classic Snake gameplay (Arrow keys / WASD controls)
- Score increases as you eat food, game speeds up gradually
- On game over, enter your name to save your score
- Persistent Top-10 leaderboard stored in a real SQLite database
- REST API: `GET /api/highscores`, `POST /api/scores`

## Project Structure
```
snake-full-stack/
├── server.js          # Express server + REST API routes
├── database.js        # SQLite database connection & schema
├── package.json
└── public/
    ├── index.html      # Game UI
    ├── style.css       # Styling
    └── game.js         # Game logic + API calls (fetch)
```

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser at:
   ```
   http://localhost:3000
   ```

The SQLite database file (`scores.db`) will be created automatically the
first time the server runs — no manual database setup needed.

## API Endpoints

| Method | Endpoint            | Description                          |
|--------|----------------------|---------------------------------------|
| GET    | `/api/highscores`    | Returns top 10 scores (JSON array)    |
| POST   | `/api/scores`        | Saves a new score `{player_name, score}` |

## Notes
- Tested end-to-end: server starts correctly, scores save to SQLite, and
  the leaderboard updates live.
- `scores.db` is not included in this submission — it's generated fresh
  on first run.
- You'll see a one-line `ExperimentalWarning: SQLite is an experimental
  feature` in the terminal when the server starts — this is normal and
  can be ignored, the feature works correctly.

## Troubleshooting
- **"Cannot find module 'node:sqlite'" or similar error:** Your Node.js
  version is older than 22.5. Update Node from https://nodejs.org
  (LTS version) and try again.
<img width="1366" height="686" alt="image (2)" src="https://github.com/user-attachments/assets/49b2ab9b-7d48-41a6-a204-e6e4b81e3774" />
<img width="1366" height="686" alt="image (3)" src="https://github.com/user-attachments/assets/0ec56926-dc51-4f35-aaf3-25fc332032ca" />
