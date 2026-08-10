Bilkul 👍 Ye **Tough Final – Complete SaaS (Attachments, Realtime, RLS)** project ke liye complete English `README.md` hai. Isko apne project ke **root folder `kanban-board-ui`** mein `README.md` mein paste kar do.

````md
# Kanban Board SaaS

A full-stack Kanban Board SaaS application built with React, Express.js, Supabase, and Tailwind CSS.

The application allows users to manage tasks using a drag-and-drop Kanban board, upload task attachments, and receive realtime task updates without refreshing the browser.

## Features

- Kanban board with Todo, In Progress, and Done columns
- Drag-and-drop task management
- Create and manage tasks through the backend API
- Supabase PostgreSQL database
- Realtime task updates using Supabase Realtime
- Task attachments using Supabase Storage
- Attachment metadata stored in the `attachments` table
- Row Level Security (RLS) enabled
- Express.js backend API
- React frontend
- Axios API integration
- Responsive Kanban interface
- Automatic UI updates when database changes occur

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- @hello-pangea/dnd
- Supabase JavaScript Client

### Backend

- Node.js
- Express.js
- Supabase JavaScript Client
- dotenv
- CORS
- Nodemon

### Database & Storage

- Supabase PostgreSQL
- Supabase Realtime
- Supabase Storage
- Row Level Security (RLS)

## Project Structure

```text
kanban-board-ui/
│
├── backend/
│   ├── config/
│   │   └── supabase.js
│   ├── controllers/
│   │   └── tasksController.js
│   ├── routes/
│   │   └── tasks.js
│   ├── .env
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── supabase.js
│   │   ├── components/
│   │   │   ├── Board.jsx
│   │   │   ├── Column.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── TaskCard.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   └── services/
│   │       └── api.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
````

## Database Schema

The application uses the following main tables:

### Users

Stores user information.

```text
id
name
email
created_at
```

### Boards

Stores Kanban boards.

```text
id
name
user_id
created_at
```

### Lists

Stores board columns/lists.

```text
id
name
board_id
position
created_at
```

### Tasks

Stores Kanban tasks.

```text
id
title
description
status
due_date
list_id
created_at
```

### Attachments

Stores information about files attached to tasks.

```text
id
task_id
file_name
file_path
file_size
mime_type
created_at
```

## Realtime Functionality

Supabase Realtime is enabled for the `tasks` table.

When a task is updated in the database, the frontend receives a realtime event and automatically fetches the latest tasks.

This means task changes appear in the browser without manually refreshing the page.

Supported realtime events include:

* INSERT
* UPDATE
* DELETE

## Attachments

Task attachments are stored in the Supabase Storage bucket:

```text
task-attachments
```

The upload flow is:

```text
Select File
     ↓
Supabase Storage
     ↓
task-attachments bucket
     ↓
attachments table
     ↓
Attachment displayed on TaskCard
```

Each attachment stores metadata such as:

* File name
* File path
* File size
* MIME type
* Related task ID
* Creation timestamp

Signed URLs are generated when attachments are displayed.

## Row Level Security

Row Level Security is enabled on the main application tables:

* users
* boards
* lists
* tasks
* attachments

The project also contains policies for task and attachment operations.

Example task operations include:

* Read tasks
* Insert tasks
* Update tasks
* Delete tasks

Attachment operations include:

* Read attachments
* Insert attachments
* Delete attachments

Storage policies are also configured for the `task-attachments` bucket.

## Environment Variables

### Backend

Create:

```text
backend/.env
```

Example:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
```

### Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Never commit real environment variables or secret keys to GitHub.

## Installation

Clone the repository and install dependencies.

### Backend

```bash
cd backend
npm install
```

Start the backend in development mode:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## API Endpoints

### Get Tasks

```http
GET /tasks
```

Returns all tasks.

### Create Task

```http
POST /tasks
```

Example request body:

```json
{
  "title": "Learn React",
  "description": "Practice hooks",
  "status": "Todo",
  "due_date": "2026-08-10",
  "list_id": null
}
```

### Update Task

```http
PUT /tasks/:id
```

Example:

```json
{
  "status": "Done"
}
```

### Delete Task

```http
DELETE /tasks/:id
```

## Drag and Drop

Tasks can be moved between:

```text
Todo
In Progress
Done
```

When a task is moved, the new status is saved to Supabase through the backend API.

Realtime updates then synchronize the change with the frontend.

## Testing

The project can be tested by:

1. Starting the backend.
2. Starting the frontend.
3. Opening the Kanban board.
4. Moving a task between columns.
5. Checking that the task status changes in Supabase.
6. Updating a task directly from Supabase Table Editor.
7. Confirming that the browser updates without refreshing.
8. Selecting a file from a task card.
9. Uploading the attachment.
10. Confirming that the file appears in the `task-attachments` bucket.
11. Confirming that attachment metadata appears in the `attachments` table.

## Security

Environment files are excluded from Git using `.gitignore`.

Do not expose:

* Supabase service role keys
* Private API keys
* Production secrets

Only the required public Supabase client configuration should be used in the frontend.

## Final Project Checklist

* [x] React Kanban UI
* [x] Express.js backend
* [x] Supabase database
* [x] Tasks API
* [x] Drag and drop
* [x] Realtime updates
* [x] RLS enabled
* [x] RLS policies
* [x] Supabase Storage
* [x] Task attachments
* [x] Attachment metadata
* [x] Signed attachment URLs
* [x] Environment variables
* [x] GitHub-ready project

## Conclusion

This project demonstrates a complete SaaS-style Kanban application using React, Express.js, and Supabase.

It combines database management, REST APIs, realtime synchronization, Row Level Security, file storage, and a modern drag-and-drop frontend into one full-stack application.

``
