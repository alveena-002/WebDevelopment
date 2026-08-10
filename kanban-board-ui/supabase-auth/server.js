const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("URL:", process.env.SUPABASE_URL);
console.log("KEY:", process.env.SUPABASE_ANON_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Home Route
app.get("/", (req, res) => {
  res.send("Supabase Auth API Running...");
});

// Signup Route

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "http://localhost:3000"
    }
  });

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    return res.status(400).json(error);
  }

  res.json(data);
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return res.status(400).json(error);
  }
  res.json(data);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});