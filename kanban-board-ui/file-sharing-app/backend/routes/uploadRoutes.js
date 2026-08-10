import express from "express";
import {
  uploadFile,
  getFiles,
  downloadFile,
} from "../controllers/uploadController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("file"), uploadFile);
router.get("/", authMiddleware, getFiles);
router.get("/download/:path", authMiddleware, downloadFile);

export default router;