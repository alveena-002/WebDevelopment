
# Kanban Board UI with Drag-and-Drop

## Project Overview

This project is a full-stack Kanban Board application built with **React**, **Express.js**, and **Supabase**. It allows users to manage tasks using a drag-and-drop interface. Tasks are stored in Supabase and updated in real time through an Express REST API.

---

## Features

* Kanban Board with three columns:

  * Todo
  * In Progress
  * Done
* Drag and drop tasks between columns
* Fetch tasks from Supabase
* Add new tasks through API
* Update task status automatically after drag-and-drop
* Express.js REST API
* Supabase PostgreSQL database integration

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* @hello-pangea/dnd

### Backend

* Express.js
* Node.js
* Supabase JavaScript Client
* dotenv
* CORS

### Database

* Supabase PostgreSQL

---

# Project Structure

```
kanban-board-ui
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend
│   ├── config
│   ├── controllers
│   ├── routes
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

```bash
cd kanban-board-ui
```

---

# Backend Setup

Go to backend folder

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=5000
```

Start backend

```bash
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

# Frontend Setup

Open another terminal

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run frontend

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# API Endpoints

## Get All Tasks

```
GET /tasks
```

---

## Create Task

```
POST /tasks
```

Example Body

```json
{
  "title": "Learn React",
  "description": "Practice Hooks",
  "status": "Todo",
  "due_date": "2026-08-10",
  "list_id": null
}
```

---

## Update Task Status

```
PUT /tasks/:id
```

Example Body

```json
{
  "status": "Done"
}
```

---

# Drag and Drop

Users can drag a task from one column to another.

Example:

```
Todo
   ↓
In Progress
   ↓
Done
```

Whenever a task is dropped into a new column:

* UI updates instantly
* Express API is called
* Supabase database is updated
* Changes remain after page refresh

---

# Database

Supabase stores all tasks with the following fields:

* id
* title
* description
* status
* due_date
* list_id
* created_at

---

# Future Improvements

* User Authentication
* Multiple Boards
* Multiple Lists
* Task Editing
* Delete Tasks
* Due Date Reminders
* Search & Filter
* Responsive Mobile Layout

---

# Author

Developed as part of the **Full Stack Web Development Capstone Project** using **React, Express.js, and Supabase**.



<img width="1366" height="728" alt="WhatsApp Image 2026-07-31 at 4 17 16 AM" src="https://github.com/user-attachments/assets/36d97445-e075-431f-a403-4ec7fa396876" />
<img width="1366" height="728" alt="image (7)" src="https://github.com/user-attachments/assets/d7ba8750-4c83-48e8-a373-ac531f17c232" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-31 at 4 14 20 AM" src="https://github.com/user-attachments/assets/5c5a822b-a814-4ab7-9131-95b07a92af05" />
<img width="1366" height="728" alt="image (6)" src="https://github.com/user-attachments/assets/38e1c6fc-eeb7-4e7a-a538-8ea6f0274c7e" />
<img width="1366" height="728" alt="image (5)" src="https://github.com/user-attachments/assets/63315ab3-fda4-44c7-920a-964eda0a8b5e" />
<img width="1366" height="728" alt="image (4)" src="https://github.com/user-attachments/assets/4a9a8344-8c10-4621-acf9-a484294ad085" />
<img width="1366" height="728" alt="image (3)" src="https://github.com/user-attachments/assets/5de547c5-9d1a-4e43-80c7-a69bb36b491d" />
<img width="1366" height="728" alt="image (2)" src="https://github.com/user-attachments/assets/5ee4fa09-34d5-4daa-aad8-2e451bc96dce" />
<img width="1366" height="728" alt="image (1)" src="https://github.com/user-attachments/assets/4389702f-4db3-42ad-a67a-53521dd195c5" />
<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/5626d3ad-9f50-4391-8fd3-ce2318e38cb4" />
