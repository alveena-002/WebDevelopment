const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, "expenses.json");

const VALID_CATEGORIES = ["food", "transport", "utilities", "entertainment", "education", "health", "other"];

// ---------- Simple JSON "database" helpers ----------

function loadData() {
  if (!fs.existsSync(DB_FILE)) {
    const now = new Date().toISOString();
    const seed = {
      nextId: 6,
      expenses: [
        { id: 1, title: "Grocery shopping", amount: 45.5, category: "food", expense_date: "2026-09-10", notes: "Weekly groceries", created_at: now },
        { id: 2, title: "Bus fare", amount: 12, category: "transport", expense_date: "2026-09-11", notes: null, created_at: now },
        { id: 3, title: "Internet bill", amount: 30, category: "utilities", expense_date: "2026-09-12", notes: "Monthly subscription", created_at: now },
        { id: 4, title: "Movie tickets", amount: 20, category: "entertainment", expense_date: "2026-09-12", notes: null, created_at: now },
        { id: 5, title: "Textbooks", amount: 65, category: "education", expense_date: "2026-09-08", notes: "Semester materials", created_at: now },
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }

  const raw = fs.readFileSync(DB_FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("expenses.json is corrupted, resetting to empty state.", err);
    const empty = { nextId: 1, expenses: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(empty, null, 2));
    return empty;
  }
}

function saveData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function validateExpense(body) {
  const errors = [];
  if (!body.title || body.title.trim() === "") errors.push("Title is required.");
  if (body.amount === undefined || body.amount === null || isNaN(Number(body.amount))) {
    errors.push("Amount must be a number.");
  } else if (Number(body.amount) <= 0) {
    errors.push("Amount must be greater than 0.");
  }
  if (!body.expense_date) errors.push("Date is required.");
  if (body.category && !VALID_CATEGORIES.includes(body.category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(", ")}.`);
  }
  return errors;
}

// ---------- Routes ----------

// GET all expenses (supports ?category=, ?from=, ?to= date range, ?q= search)
app.get("/api/expenses", (req, res) => {
  const { category, from, to, q } = req.query;
  const data = loadData();
  let expenses = [...data.expenses];

  if (category) {
    expenses = expenses.filter((e) => e.category === category);
  }
  if (from) {
    expenses = expenses.filter((e) => e.expense_date >= from);
  }
  if (to) {
    expenses = expenses.filter((e) => e.expense_date <= to);
  }
  if (q) {
    const needle = q.toLowerCase();
    expenses = expenses.filter(
      (e) =>
        (e.title && e.title.toLowerCase().includes(needle)) ||
        (e.notes && e.notes.toLowerCase().includes(needle))
    );
  }

  expenses.sort((a, b) => {
    if (a.expense_date !== b.expense_date) return b.expense_date.localeCompare(a.expense_date);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  res.json(expenses);
});

// CREATE expense
app.post("/api/expenses", (req, res) => {
  const errors = validateExpense(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const { title, amount, category, expense_date, notes } = req.body;
  const data = loadData();

  const newExpense = {
    id: data.nextId,
    title,
    amount: Number(amount),
    category: category || "other",
    expense_date,
    notes: notes || null,
    created_at: new Date().toISOString(),
  };

  data.expenses.push(newExpense);
  data.nextId += 1;
  saveData(data);

  res.status(201).json(newExpense);
});

// UPDATE expense
app.put("/api/expenses/:id", (req, res) => {
  const data = loadData();
  const id = Number(req.params.id);
  const existing = data.expenses.find((e) => e.id === id);
  if (!existing) return res.status(404).json({ error: "Expense not found" });

  const merged = { ...existing, ...req.body };
  const errors = validateExpense(merged);
  if (errors.length > 0) return res.status(400).json({ errors });

  existing.title = merged.title;
  existing.amount = Number(merged.amount);
  existing.category = merged.category;
  existing.expense_date = merged.expense_date;
  existing.notes = merged.notes;

  saveData(data);

  res.json(existing);
});

// DELETE expense
app.delete("/api/expenses/:id", (req, res) => {
  const data = loadData();
  const id = Number(req.params.id);
  const existing = data.expenses.find((e) => e.id === id);
  if (!existing) return res.status(404).json({ error: "Expense not found" });

  data.expenses = data.expenses.filter((e) => e.id !== id);
  saveData(data);

  res.json({ success: true });
});

// Summary: total spent + breakdown by category
app.get("/api/summary", (req, res) => {
  const { from, to } = req.query;
  const data = loadData();
  let expenses = [...data.expenses];

  if (from) {
    expenses = expenses.filter((e) => e.expense_date >= from);
  }
  if (to) {
    expenses = expenses.filter((e) => e.expense_date <= to);
  }

  const groups = {};
  for (const e of expenses) {
    if (!groups[e.category]) groups[e.category] = { category: e.category, total: 0, count: 0 };
    groups[e.category].total += e.amount;
    groups[e.category].count += 1;
  }

  const byCategory = Object.values(groups).sort((a, b) => b.total - a.total);
  const grandTotal = byCategory.reduce((sum, c) => sum + c.total, 0);

  res.json({ grandTotal, byCategory });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Expense Tracker API running on http://localhost:${PORT}`));
