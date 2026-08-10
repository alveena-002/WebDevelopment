
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



<img width="1366" height="728" alt="WhatsApp Image 2026-07-22 at 4 16 25 AM" src="https://github.com/user-attachments/assets/9daade66-9535-4f94-b8d6-f4412bd0d7ba" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-22 at 4 15 11 AM" src="https://github.com/user-attachments/assets/6e36aec6-3712-4ca7-8296-623d78bd15ed" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-22 at 4 26 23 AM" src="https://github.com/user-attachments/assets/6ac1e8a2-3392-4565-86ac-c4fe5428d866" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-22 at 4 38 03 AM" src="https://github.com/user-attachments/assets/986ed843-f24b-4261-b901-93f3f469f489" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-22 at 4 42 57 AM" src="https://github.com/user-attachments/assets/47566560-d651-438a-bfb3-2e6e8e3ef096" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-22 at 4 55 48 AM" src="https://github.com/user-attachments/assets/ce946d6e-0ebc-4bc3-81f7-438120fedd83" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-22 at 5 02 08 AM" src="https://github.com/user-attachments/assets/40c3f5a9-249c-4b4c-a3e2-795a33936e83" />
<img width="1366" height="728" alt="WhatsApp Image 2026-07-22 at 5 04 00 AM" src="https://github.com/user-attachments/assets/e164ca54-eb55-4690-9bcf-73f407553396" />
