# JWT Authentication Middleware with Environment Variables

A simple Express.js project that demonstrates JWT (JSON Web Token) authentication along with secure management of sensitive credentials using Environment Variables. The project protects API routes using JWT middleware and securely stores configuration values such as `JWT_SECRET`, `SUPABASE_URL`, and `SUPABASE_KEY` in a `.env` file.

---

## 🚀 Features

- Express.js server setup
- JWT authentication using `jsonwebtoken`
- Custom authentication middleware
- Protected API routes
- Login route to generate JWT tokens
- Environment variables using `dotenv`
- Secure storage of sensitive credentials
- Supabase integration
- Fetch data from Supabase database
- JSON API responses
- CORS enabled
- Proper error handling

---

## 📂 Project Structure

```
jwt-auth-middleware/
│
├── middleware/
│   └── authMiddleware.js
│
├── routes/
│   └── authRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── server.js
└── supabase.js
```

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- JSON Web Token (JWT)
- Supabase
- Dotenv
- CORS
- Nodemon

---

## 📦 Installation

Clone the repository:

```bash
git clone <repository-url>
```

Go to the project folder:

```bash
cd jwt-auth-middleware
```

Install dependencies:

```bash
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

JWT_SECRET=your_jwt_secret

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-api-key
```

---

## ▶️ Run the Project

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server will run at:

```
http://localhost:5000
```

---

## 📌 API Endpoints

### Home Route

**GET**

```
/
```

Response:

```text
Environment Variables API Running 🚀
```

---

### Generate JWT Token

**POST**

```
/api/login
```

Request Body:

```json
{
  "email": "test@gmail.com"
}
```

Response:

```json
{
  "success": true,
  "token": "your-jwt-token"
}
```

---

### Protected Route

**GET**

```
/api/profile
```

Header:

```
Authorization: Bearer your-jwt-token
```

Response:

```json
{
  "success": true,
  "message": "Protected route accessed successfully",
  "user": {
    "email": "test@gmail.com"
  }
}
```

---

### Get Users from Supabase

**GET**

```
/users
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ali"
    }
  ]
}
```

---

## ❌ Error Responses

### Missing Authorization Header

```json
{
  "success": false,
  "message": "Authorization header missing"
}
```

### Missing Token

```json
{
  "success": false,
  "message": "Token missing"
}
```

### Invalid or Expired Token

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

## 📖 How It Works

1. Sensitive credentials are stored in the `.env` file.
2. `dotenv` loads the environment variables.
3. JWT tokens are generated after successful login.
4. Protected routes verify the JWT using custom middleware.
5. `process.env.SUPABASE_URL` and `process.env.SUPABASE_KEY` are used to connect to Supabase securely.
6. The `/users` endpoint retrieves user data from the Supabase database.
7. Invalid or missing tokens return appropriate error responses.

---

## 🔒 Security

- Sensitive credentials are stored in the `.env` file.
- Secrets are accessed using `process.env`.
- `.env` is excluded from GitHub using `.gitignore`.
- Protected routes require a valid JWT token.

---

## 👩‍💻 Author

Developed as a practice project to understand JWT Authentication, Environment Variables, and secure configuration management in Express.js with Supabase.



<img width="1366" height="728" alt="WhatsApp Image 2026-07-22 at 3 18 50 AM" src="https://github.com/user-attachments/assets/2e3b1786-8939-4b94-9924-53eae30d4dd9" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-22 at 3 18 06 AM" src="https://github.com/user-attachments/assets/1ed1f2b2-238d-4740-b721-93b8d8eb4b56" />

<img width="1366" height="728" alt="WhatsApp Image 2026-07-21 at 11 40 47 PM" src="https://github.com/user-attachments/assets/899f1855-9e20-47bc-9033-57de990dfac2" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-21 at 11 36 44 PM" src="https://github.com/user-attachments/assets/b77ec69d-cac4-4256-a0d1-89736aee4a24" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-21 at 11 43 55 PM" src="https://github.com/user-attachments/assets/f73a1a2d-06ac-4947-85be-d9b03b710388" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-21 at 11 44 17 PM" src="https://github.com/user-attachments/assets/45ee89ba-88c1-45f8-b8a1-97cae916dbb7" />
