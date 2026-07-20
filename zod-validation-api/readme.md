# Zod Validation API 🚀

A backend API built with **Node.js, Express.js, and Zod** to validate incoming user data using a custom middleware. This project demonstrates how to create reusable validation logic and handle invalid requests efficiently.

## Features

- Express.js server setup
- Zod schema-based validation
- Custom `validateUser` middleware
- Validates user input before processing requests
- Handles validation errors with proper responses
- REST API endpoint for user data validation

## Technologies Used

- Node.js
- Express.js
- Zod
- CORS
- dotenv
- Nodemon

## Project Structure
zod-validation-api/
│
├── middleware/
│ └── validateUser.js
│
├── routes/
│ └── userRoutes.js
│
├── schemas/
│ └── userSchema.js
│
├── .env
├── server.js
├── package.json
└── README.md


## Installation

Clone the repository:

```bash
git clone <repository-url>

Navigate to the project folder:

cd zod-validation-api

Install dependencies:

npm install
Environment Variables

Create a .env file:

PORT=5000
Run the Project

Development mode:

npm run dev

Start server:

npm start

Server will run on:

http://localhost:5000
API Endpoint
Validate User Data

POST

http://localhost:5000/api/users
Valid Request Example
{
  "name": "Alveena Kamal",
  "email": "alvina@gmail.com",
  "age": 19,
  "password": "123456"
}
Success Response
{
  "success": true,
  "message": "User data is valid",
  "data": {
    "name": "Alveena Kamal",
    "email": "alvina@gmail.com",
    "age": 19,
    "password": "123456"
  }
}
Invalid Request Example
{
  "name": "A",
  "email": "invalid",
  "age": 15,
  "password": "123"
}
Error Response
{
  "success": false,
  "errors": [
    {
      "path": ["name"],
      "message": "Name must be at least 3 characters"
    }
  ]
}
Learning Outcomes
Learned how to use Zod for data validation.
Created reusable Express middleware.
Validated API request bodies before processing.
Improved API security by rejecting invalid input.
Learned error handling in Express applications.