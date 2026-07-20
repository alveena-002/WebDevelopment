import express from "express";
import validateUser from "../middleware/validateUser.js";

const router = express.Router();

router.post("/users", validateUser, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User data is valid",
    data: req.body,
  });
});

export default router;