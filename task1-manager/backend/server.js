const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, "tasks.json");

// ---------- Simple JSON "database" helpers ----------

function loadData() {
  if (!fs.existsSync(DB_FILE)) {
    const seed = {
      nextId: 4,
      tasks: [
        {
          id: 1,
          title: "Set up project repository",
          description: "Initialize git and push to GitHub",
          priority: "high",
          status: "completed",
          due_date: "2026-09-10",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Design database schema",
          description: "Plan tables and relationships",
          priority: "high",
          status: "in_progress",
          due_date: "2026-09-15",
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          title: "Write project report",
          description: "Final submission document",
          priority: "medium",
          status: "pending",
          due_date: "2026-09-20",
          created_at: new Date().toISOString(),
        },
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }

  const raw = fs.readFileSync(DB_FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("tasks.json is corrupted, resetting to empty state.", err);
    const empty = { nextId: 1, tasks: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(empty, null, 2));
    return empty;
  }
}

function saveData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ---------- Routes ----------

// GET all tasks (supports ?status= and ?priority= filters, and ?q= search)
app.get("/api/tasks", (req, res) => {
  const { status, priority, q } = req.query;
  const data = loadData();
  let tasks = [...data.tasks];

  if (status) {
    tasks = tasks.filter((t) => t.status === status);
  }
  if (priority) {
    tasks = tasks.filter((t) => t.priority === priority);
  }
  if (q) {
    const needle = q.toLowerCase();
    tasks = tasks.filter(
      (t) =>
        (t.title && t.title.toLowerCase().includes(needle)) ||
        (t.description && t.description.toLowerCase().includes(needle))
    );
  }

  tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json(tasks);
});

// GET single task
app.get("/api/tasks/:id", (req, res) => {
  const data = loadData();
  const id = Number(req.params.id);
  const task = data.tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

// CREATE task
app.post("/api/tasks", (req, res) => {
  const { title, description, priority, status, due_date } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const data = loadData();

  const newTask = {
    id: data.nextId,
    title,
    description: description || null,
    priority: priority || "medium",
    status: status || "pending",
    due_date: due_date || null,
    created_at: new Date().toISOString(),
  };

  data.tasks.push(newTask);
  data.nextId += 1;
  saveData(data);

  res.status(201).json(newTask);
});

// UPDATE task
app.put("/api/tasks/:id", (req, res) => {
  const data = loadData();
  const id = Number(req.params.id);
  const existing = data.tasks.find((t) => t.id === id);
  if (!existing) return res.status(404).json({ error: "Task not found" });

  const { title, description, priority, status, due_date } = req.body;

  existing.title = title ?? existing.title;
  existing.description = description ?? existing.description;
  existing.priority = priority ?? existing.priority;
  existing.status = status ?? existing.status;
  existing.due_date = due_date ?? existing.due_date;

  saveData(data);

  res.json(existing);
});

// DELETE task
app.delete("/api/tasks/:id", (req, res) => {
  const data = loadData();
  const id = Number(req.params.id);
  const existing = data.tasks.find((t) => t.id === id);
  if (!existing) return res.status(404).json({ error: "Task not found" });

  data.tasks = data.tasks.filter((t) => t.id !== id);
  saveData(data);

  res.json({ success: true });
});

// Summary stats
app.get("/api/stats", (req, res) => {
  const data = loadData();
  const total = data.tasks.length;
  const pending = data.tasks.filter((t) => t.status === "pending").length;
  const inProgress = data.tasks.filter((t) => t.status === "in_progress").length;
  const completed = data.tasks.filter((t) => t.status === "completed").length;
  res.json({ total, pending, inProgress, completed });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Task Manager API running on http://localhost:${PORT}`));
