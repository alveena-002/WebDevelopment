
# JWT Auth Middleware

A simple Express.js project that demonstrates how to protect API routes using JSON Web Token (JWT) authentication. The project includes an authentication middleware that verifies JWTs from the `Authorization` header before allowing access to protected routes.

---

## 🚀 Features

- Express.js server setup
- JWT authentication using `jsonwebtoken`
- Custom authentication middleware
- Protected API route
- Login route to generate JWT
- Environment variables with `dotenv`
- CORS enabled
- Proper error handling for invalid or missing tokens

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
└── server.js
```

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- JSON Web Token (JWT)
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
JWT_SECRET=mysecretkey123
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

1. User sends a request to the login endpoint.
2. The server generates a JWT token.
3. The client stores the token.
4. The client sends the token in the `Authorization` header.
5. The authentication middleware verifies the token.
6. If the token is valid, access to the protected route is granted.
7. If the token is missing or invalid, a `401 Unauthorized` response is returned.

---

## 👩‍💻 Author

Developed as a practice project to understand JWT authentication and middleware implementation in Express.js.




<img width="1366" height="728" alt="WhatsApp Image 2026-07-21 at 11 40 47 PM" src="https://github.com/user-attachments/assets/899f1855-9e20-47bc-9033-57de990dfac2" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-21 at 11 36 44 PM" src="https://github.com/user-attachments/assets/b77ec69d-cac4-4256-a0d1-89736aee4a24" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-21 at 11 43 55 PM" src="https://github.com/user-attachments/assets/f73a1a2d-06ac-4947-85be-d9b03b710388" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-21 at 11 44 17 PM" src="https://github.com/user-attachments/assets/45ee89ba-88c1-45f8-b8a1-97cae916dbb7" />
