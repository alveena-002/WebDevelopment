# File Sharing App

A secure **File Sharing REST API** built with **Node.js**, **Express.js**, and **Supabase**. The application allows users to sign up, log in, upload files, view their uploaded files, and generate secure download links using Supabase Storage.

---

## 🚀 Features

* User Signup
* User Login
* JWT Authentication
* Protected Routes
* File Upload using Multer
* Store Files in Supabase Storage
* Save File Metadata in Supabase Database
* Get User Uploaded Files
* Generate Secure Download URLs
* Environment Variable Configuration

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* Supabase
* Supabase Authentication
* Supabase Storage
* Multer
* dotenv
* CORS

---

## 📂 Project Structure

```text
backend/
│── config/
│   └── supabase.js
│
│── controllers/
│   ├── authController.js
│   └── uploadController.js
│
│── middleware/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
│
│── routes/
│   ├── authRoutes.js
│   ├── protectedRoutes.js
│   └── uploadRoutes.js
│
│── .env
│── package.json
│── server.js
```

---

# 📦 Installation

Clone the repository:

```bash
git clone <repository-url>
```

Go to the project folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

# ⚙️ Environment Variables

Create a `.env` file and add:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=5000
```

---

# ▶️ Run the Server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server runs on:

```text
http://localhost:5000
```

---

# 📌 API Endpoints

## Authentication

### Signup

**POST**

```http
/api/auth/signup
```

Request Body

```json
{
  "email": "user@example.com",
  "password": "12345678"
}
```

---

### Login

**POST**

```http
/api/auth/login
```

Request Body

```json
{
  "email": "user@example.com",
  "password": "12345678"
}
```

---

## Protected Route

**GET**

```http
/api/protected
```

Headers

```text
Authorization: Bearer <access_token>
```

---

## Upload File

**POST**

```http
/api/upload
```

Headers

```text
Authorization: Bearer <access_token>
```

Body

```
form-data

file → File
```

---

## Get Uploaded Files

**GET**

```http
/api/upload
```

Headers

```text
Authorization: Bearer <access_token>
```

---

## Download File

**GET**

```http
/api/upload/download/:path
```

Headers

```text
Authorization: Bearer <access_token>
```

Example

```http
/api/upload/download/1784721715660-student.jpg
```

---

# 📁 Database Table

**files**

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| user_id    | UUID      |
| file_name  | Text      |
| file_path  | Text      |
| file_size  | Integer   |
| created_at | Timestamp |

---

# 🗂️ Storage Bucket

Bucket Name

```text
files
```

---

# 📷 Workflow

1. User signs up.
2. User logs in and receives an access token.
3. Protected routes verify the JWT token.
4. Authenticated users upload files.
5. Files are stored in Supabase Storage.
6. File metadata is saved in the `files` table.
7. Users can retrieve their uploaded files.
8. Users can generate secure signed download links.

---

# ✅ Sample Success Response

### Upload

```json
{
  "success": true,
  "message": "File uploaded successfully"
}
```

### Get Files

```json
{
  "success": true,
  "files": []
}
```

### Download

```json
{
  "success": true,
  "downloadUrl": "https://your-signed-url"
}
```

---

# 📄 License

This project is developed for learning purposes and is free to use.
