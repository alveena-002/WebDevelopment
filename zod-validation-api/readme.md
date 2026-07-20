Ye tumhare **Zod Validation API** project ka complete `README.md` hai. Isko copy karke apni project root me **README.md** file me paste kar do.

```md
# Zod Validation API 🚀

A Node.js and Express.js API project that uses **Zod** for validating incoming user data. This project implements a custom validation middleware to check request data before processing and returns proper validation errors for invalid inputs.

## Features

- Express.js REST API setup
- Zod schema-based validation
- Custom `validateUser` middleware
- Request body validation before API processing
- Handles invalid input with error responses
- Clean project structure

## Technologies Used

- Node.js
- Express.js
- Zod
- CORS
- dotenv
- Nodemon

## Project Structure

```

zod-validation-api/
│
├── middleware/
│   └── validateUser.js
│
├── routes/
│   └── userRoutes.js
│
├── schemas/
│   └── userSchema.js
│
├── .env
├── server.js
├── package.json
└── README.md

````

## Installation

Clone the repository:

```bash
git clone <repository-url>
````

Go to the project folder:

```bash
cd zod-validation-api
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
```

## Running the Project

Run in development mode:

```bash
npm run dev
```

Run normally:

```bash
npm start
```

Server will start on:

```
http://localhost:5000
```

## API Endpoint

### Validate User Data

**POST**

```
http://localhost:5000/api/users
```

## Request Body Example (Valid Data)

```json
{
  "name": "Alveena Kamal",
  "email": "alvina@gmail.com",
  "age": 19,
  "password": "123456"
}
```

## Success Response

```json
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
```

## Invalid Data Example

```json
{
  "name": "A",
  "email": "invalid-email",
  "age": 15,
  "password": "123"
}
```

## Error Response

```json
{
  "success": false,
  "errors": [
    {
      "path": [
        "name"
      ],
      "message": "Name must be at least 3 characters"
    }
  ]
}
```

## How It Works

1. User sends data through the API request.
2. `validateUser` middleware receives the request.
3. Zod schema checks the incoming data.
4. If data is valid, the request continues.
5. If data is invalid, an error response is returned.

## Learning Outcomes

* Learned how to use Zod for API validation.
* Created reusable Express middleware.
* Validated request data before processing.
* Learned error handling for invalid inputs.
* Improved API data security and reliability.

## Author

Alveena Kamal



<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/93886a00-935d-4a47-88e8-7107bc351f42" />

blob:https://web.whatsapp.com/d48489a0-16b2-44b3-b60f-4278cecf27f6

blob:https://web.whatsapp.com/3c729fc2-6481-4d25-b3df-86b18362d982

blob:https://web.whatsapp.com/561605ad-79ab-429a-ba77-a0b5a8faae70
