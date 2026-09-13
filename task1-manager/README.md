# Task Manager — Full Stack Project

A full-stack task management app: Node.js/Express + SQLite backend, vanilla JS frontend.
No external database account needed — SQLite runs as a local file, so it works immediately
after `npm install`.

## Tech Stack

- **Backend**: Node.js, Express, better-sqlite3 (SQLite)
- **Frontend**: HTML/CSS/JavaScript (no build step required)

## Features

- Create, read, update, delete tasks
- Priority levels (low / medium / high)
- Status tracking (pending / in progress / completed)
- Due dates
- Search by title/description
- Filter by status and priority
- Live stats dashboard (total, pending, in progress, completed)

## How to Run

### 1. Start the backend

```bash
cd backend
npm install
npm start
```

This starts the API at `http://localhost:5000` and creates `tasks.db` (SQLite file) with 3 demo
tasks pre-loaded on first run.

### 2. Open the frontend

Just open `frontend/index.html` directly in your browser (double-click it, or right-click →
Open with Browser). No build step, no dev server needed.

> Keep the backend running in its terminal while using the frontend — the page calls
> `http://localhost:5000/api/...` for all data.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | List tasks (supports `?status=`, `?priority=`, `?q=` search) |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/stats` | Summary counts |

## Tested

All endpoints were tested end-to-end before delivery: create, read, filter, search, status
update, delete, and input validation (empty title is rejected) all confirmed working against a
live running server.

## Project Structure

```
task1-manager/
├── backend/
│   ├── server.js       # Express API + SQLite schema
│   └── package.json
└── frontend/
    └── index.html       # Full UI, no build tools needed
```
