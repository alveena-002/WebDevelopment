import { supabase } from "../config/supabase.js";

// Signup
export const signup = async (req, res) => {
  console.log("✅ Signup route hit");

  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    console.log("Supabase Response:", { data, error });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data,
    });
  } catch (err) {
    console.error("Catch Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};