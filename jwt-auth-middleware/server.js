import express from "express";
import dotenv from "dotenv";
import supabase from "./supabase.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Environment Variables API Running 🚀");
});

app.get("/users", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }

  res.json({
    success: true,
    data,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});