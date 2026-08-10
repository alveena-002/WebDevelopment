import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", uploadRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Profile Picture Upload API is Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});