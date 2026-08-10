
# Testing with Vitest (React + Express)

## 📌 Project Overview

This project demonstrates how to write unit tests for both a React frontend component and an Express backend API using **Vitest**.

The frontend uses **React Testing Library** to test a React component, while the backend uses **Supertest** to test an Express API route.

---

## 🚀 Technologies Used

### Frontend

* React
* Vite
* Vitest
* React Testing Library
* Jest DOM

### Backend

* Node.js
* Express.js
* Vitest
* Supertest

---

## 📁 Project Structure

```text
testing-vitest/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Greeting.jsx
│   │   ├── tests/
│   │   │   └── Greeting.test.jsx
│   │   ├── setupTests.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
└── backend/
    ├── routes/
    │   └── hello.js
    ├── tests/
    │   └── hello.test.js
    ├── app.js
    ├── server.js
    └── package.json
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone <repository-url>
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
```

Run frontend tests:

```bash
npm test
```

---

## Backend Setup

```bash
cd backend
npm install
```

Start the server:

```bash
npm start
```

Run backend tests:

```bash
npm test
```

---

## 🧪 Frontend Test

The React unit test verifies that the **Greeting** component renders the expected text.

**Component Tested**

```text
Greeting.jsx
```

**Expected Output**

```text
Hello, Vitest!
```

---

## 🧪 Backend Test

The backend unit test checks the Express API endpoint.

**Route Tested**

```http
GET /hello
```

**Expected Response**

```json
{
  "message": "Hello from API"
}
```

---

## ✅ Features

* Unit testing with Vitest
* React component testing
* Express API route testing
* React Testing Library integration
* Supertest for API testing
* Fast and lightweight testing setup
* Separate frontend and backend test suites

---

## 📷 Expected Test Results

### Frontend

```text
✓ Greeting.test.jsx
✓ renders greeting text

Test Files 1 passed
Tests 1 passed
```

### Backend

```text
✓ hello.test.js
✓ should return hello message

Test Files 1 passed
Tests 1 passed
```

---

## 👩‍💻 Author

Developed as a practice project for learning unit testing in React and Express using Vitest.

<img width="1366" height="729" alt="WhatsApp Image 2026-07-27 at 12 37 39 AM" src="https://github.com/user-attachments/assets/15e601c9-df56-4ca0-a5f5-b00fc6c0c18b" />
<img width="1366" height="729" alt="WhatsApp Image 2026-07-27 at 12 48 56 AM" src="https://github.com/user-attachments/assets/2c823614-8fe9-4661-bb50-be3c1cb4048c" />
