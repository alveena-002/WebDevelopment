# Supabase Authentication API

A simple Express.js API integrated with Supabase Authentication.

## Features

- User Signup
- User Login
- Supabase Authentication Integration
- Environment Variables Configuration
- REST API Testing with Postman

## Technologies Used

- Node.js
- Express.js
- Supabase
- dotenv
- CORS
- Postman

## Installation

1. Clone the repository.

```bash
git clone <repository-url>
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file.

```env
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_publishable_key
```

4. Start the server.

```bash
node server.js
```

Server runs at:

```
http://localhost:3000
```

## API Endpoints

### Home

```
GET /
```

Returns:

```
Supabase Auth API Running...
```

### Signup

```
POST /signup
```

Request Body

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Login

```
POST /login
```

Request Body

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

## Notes

- Email verification is enabled by default in Supabase.
- Users must verify their email before logging in successfully.
- APIs were tested using Postman.




<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/e8a48c87-8a0f-47ca-bd64-d986cb2848a3" />
