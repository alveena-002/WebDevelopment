import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./config/supabase.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});


app.get("/admin/users", async (req, res) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return res.status(400).json(error);
    }

    res.json(data.users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});