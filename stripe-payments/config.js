import dotenv from "dotenv";

dotenv.config();

console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);