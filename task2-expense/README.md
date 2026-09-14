# Expense Tracker — Full Stack Project

A full-stack personal expense tracker: Node.js/Express + SQLite backend, vanilla JS frontend
with a live category breakdown. No external database account needed.

## Tech Stack

- **Backend**: Node.js, Express, better-sqlite3 (SQLite)
- **Frontend**: HTML/CSS/JavaScript (no build step required)

## Features

- Add, view, delete expenses
- Categories: food, transport, utilities, entertainment, education, health, other
- Search by title/notes
- Filter by category
- Total spent + per-category breakdown with visual bars
- Server-side validation (amount must be positive, category must be valid, date required)

## How to Run

### 1. Start the backend

```bash
cd backend
npm install
npm start
```

API runs at `http://localhost:5001` and creates `expenses.db` with 5 demo expenses on first run.

### 2. Open the frontend

Open `frontend/index.html` directly in your browser. No build step needed.

> Keep the backend terminal running while using the frontend.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | List expenses (supports `?category=`, `?from=`, `?to=`, `?q=`) |
| POST | `/api/expenses` | Create an expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |
| GET | `/api/summary` | Total + per-category breakdown |

## Tested

All endpoints tested end-to-end before delivery against a live server: expense creation,
category/search filtering, summary totals recalculating correctly after adding data, and
validation rejecting both a negative amount and an invalid category.

## Project Structure

```
task2-expense/
├── backend/
│   ├── server.js       # Express API + SQLite schema + validation
│   └── package.json
└── frontend/
    └── index.html       # Full UI with category breakdown chart
```
<img width="1366" height="694" alt="image" src="https://github.com/user-attachments/assets/9f699a0a-cb62-46a7-bf4f-ebb85ff8a7cf" />
<img width="1366" height="677" alt="image (1)" src="https://github.com/user-attachments/assets/ac97073b-3d3a-4e12-b182-9caa02beb355" />
