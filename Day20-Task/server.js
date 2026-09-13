// Day 20 - Example server showing secrets loaded from .env
require("dotenv").config();
const express = require("express");
const supabase = require("./supabaseClient");

const app = express();
app.use(express.json());

app.get("/api/test-connection", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*").limit(1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: "Supabase connected successfully!", sample: data });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
