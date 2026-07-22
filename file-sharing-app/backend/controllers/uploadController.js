import { supabase } from "../config/supabase.js";

// Upload File
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (uploadError) {
      return res.status(400).json({
        success: false,
        message: uploadError.message,
      });
    }

    // Save metadata in database
    const { error: dbError } = await supabase.from("files").insert({
      user_id: req.user.id,
      file_name: req.file.originalname,
      file_path: fileName,
      file_size: req.file.size,
    });

    if (dbError) {
      return res.status(400).json({
        success: false,
        message: dbError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get User Files
export const getFiles = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      files: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Download File
export const downloadFile = async (req, res) => {
  try {
    const { path } = req.params;

    const { data, error } = await supabase.storage
      .from("files")
      .createSignedUrl(path, 60);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      downloadUrl: data.signedUrl,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};