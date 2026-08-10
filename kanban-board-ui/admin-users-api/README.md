# Admin Users API using Express & Supabase Service Role Key

## Overview
This project demonstrates how to use the Supabase Service Role Key in an Express.js backend to fetch all authenticated users from Supabase Auth.

## Features
- Express.js server
- Supabase Admin API integration
- Secure Service Role Key using environment variables
- Fetch all registered users
- REST API endpoint for admin access

## Technologies Used
- Node.js
- Express.js
- Supabase
- dotenv
- CORS

## Installation

1. Clone the repository.

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=5000
```

4. Start the server:

```bash
npm run dev
```

## API Endpoint

### Get All Users

```http
GET /admin/users
```

### Example Response

```json
[
  {
    "id": "user_id",
    "email": "user@example.com",
    "created_at": "2026-07-13T10:25:42Z"
  }
]
```

## What I Learned

- How to create an Express.js server.
- How to connect Express with Supabase.
- How to securely use the Service Role Key.
- How to use the Supabase Admin API.
- How to fetch all authenticated users from Supabase Auth.

- <img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/81c7cf59-437b-420e-a0be-dd406eb9e01a" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/b9ea335b-651b-4624-9b99-89cdecc673a2" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/ef1e4a88-251f-44bf-b017-03ada1a84eb2" />
