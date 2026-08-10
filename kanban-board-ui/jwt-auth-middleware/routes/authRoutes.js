import express from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Login Route
router.post("/login", (req, res) => {
  const { email } = req.body;

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    success: true,
    token,
  });
});

// Protected Route
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

export default router;