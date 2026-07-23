# Stripe Payments API 💳

A backend payment integration project built with **Node.js, Express.js, and Stripe Checkout**.  
This project creates a Stripe Checkout Session and returns a secure payment URL for completing online payments.

## 🚀 Features

- Create Stripe Checkout Sessions
- Generate secure payment URLs
- Handle payment requests using Express API
- Environment variable configuration for Stripe keys
- Test payment flow using Stripe Test Mode

## 🛠️ Technologies Used

- Node.js
- Express.js
- Stripe API
- dotenv
- CORS
- Nodemon

## 📁 Project Structure

```
stripe-payments
│
├── routes
│   └── paymentRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone <your-repository-url>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the root directory:

```env
PORT=5000

STRIPE_SECRET_KEY=your_stripe_secret_key
```

Replace `your_stripe_secret_key` with your Stripe test secret key.

## ▶️ Run Project

Development mode:

```bash
npm run dev
```

Server will start:

```
Server running on port 5000
```

## 🔗 API Endpoint

### Create Payment Session

**POST**

```
/api/create-payment
```

Example:

```
http://localhost:5000/api/create-payment
```

## 📤 Response Example

Success response:

```json
{
  "success": true,
  "url": "https://checkout.stripe.com/..."
}
```

The returned URL redirects users to the Stripe Checkout payment page.

## 💳 Stripe Test Card

Use Stripe test card details:

```
Card Number:
4242 4242 4242 4242

Expiry:
Any future date

CVC:
Any 3 digits
```

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port |
| STRIPE_SECRET_KEY | Stripe API secret key |

## 📌 Learning Outcome

Through this project, Stripe Checkout integration was implemented with an Express.js backend, including creating payment sessions and generating secure checkout URLs.

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/b2dcb705-b81b-4bb2-9ae0-5129e40dc9b8" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/ec83ee71-e075-4a32-b7bd-5b8eb851995e" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/84ff8679-bd07-4c65-920b-8a831d3715dd" />
