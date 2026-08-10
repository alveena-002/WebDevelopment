import supabase from "../config/supabase.js";

// GET ALL TASKS
export const getTasks = async (req, res) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*");

  if (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  res.json(data);
};

// ADD TASK
export const createTask = async (req, res) => {
  const { title, description, status, due_date, list_id } = req.body;

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        title,
        description,
        status,
        due_date,
        list_id,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  res.status(201).json(data);
};

// UPDATE TASK STATUS
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  res.json(data);
};