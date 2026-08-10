# Error Logging API with Winston

A simple Express.js application that demonstrates how to implement a **global error handler** and **log errors to a file** using Winston.

---

## Features

* Express.js server setup
* Global error handling middleware
* Error logging using Winston
* Logs saved to a dedicated file (`logs/error.log`)
* JSON error responses
* Test route to simulate server errors

---

## Technologies Used

* Node.js
* Express.js
* Winston
* Nodemon

---

## Project Structure

```text
error-logging-api/
│
├── logs/
│   └── error.log
│
├── middlewares/
│   └── errorHandler.js
│
├── utils/
│   └── logger.js
│
├── server.js
├── package.json
└── package-lock.json
```

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Navigate to the project

```bash
cd error-logging-api
```

### 3. Install dependencies

```bash
npm install
```

---

## Run the Project

Start the development server:

```bash
npm run dev
```

Or start the production server:

```bash
npm start
```

The server will run on:

```text
http://localhost:5000
```

---

## API Endpoints

### Home Route

**GET /**

Response:

```text
Error Logging API is Running 🚀
```

---

### Error Route

**GET /error**

This endpoint intentionally throws an error to demonstrate the global error handler.

Response:

```json
{
  "success": false,
  "message": "Something went wrong!"
}
```

---

## Error Logging

Whenever an error occurs, Winston automatically writes the error details to:

```text
logs/error.log
```

The log includes:

* Error message
* Stack trace
* HTTP method
* Request URL
* Timestamp

Example log:

```json
{
  "level": "error",
  "message": {
    "message": "Something went wrong!",
    "stack": "Error: Something went wrong!",
    "method": "GET",
    "url": "/error"
  },
  "timestamp": "2026-07-27T08:30:00.000Z"
}
```

---

## How It Works

1. A client sends a request to the `/error` endpoint.
2. The route forwards the error using `next(error)`.
3. The global error handler catches the error.
4. Winston logs the error details into `logs/error.log`.
5. The API returns a JSON error response to the client.

---

## Dependencies

* express
* winston
* nodemon (development)

---

## Author

Developed as part of an Express.js backend learning project demonstrating global error handling and file-based logging with Winston.

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/4667dd0d-30d4-4a6f-8cf4-0711360f09f0" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/6d5098e7-fe34-404e-bfcc-11e2c5a6c8fe" />
