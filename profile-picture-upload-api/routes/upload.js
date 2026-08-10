import express from "express";
import multer from "multer";
import { supabase } from "../supabase.js";

const router = express.Router();

// Store file in memory
const upload = multer({
  storage: multer.memoryStorage(),
});

// Upload Route
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;

    const { data, error } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    const { data: publicUrl } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(fileName);

    res.status(200).json({
      message: "Image uploaded successfully",
      file: data,
      imageUrl: publicUrl.publicUrl,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;