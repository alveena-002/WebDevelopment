# Capstone - Database Design (Supabase)

## 📌 Overview

This project demonstrates the design of a relational database schema in **Supabase (PostgreSQL)** for a task management application similar to Trello. The database is structured around four main entities: **Users, Boards, Lists, and Tasks**, with proper relationships established using foreign keys.

---

## 🚀 Features

* Designed a relational database schema in Supabase.
* Created **Users**, **Boards**, **Lists**, and **Tasks** tables.
* Implemented one-to-many relationships using foreign keys.
* Used UUIDs as primary keys.
* Added timestamps for record creation.
* Configured cascading deletes to maintain data integrity.

---

## 🛠️ Database Schema

### **Users**

| Column     | Type               |
| ---------- | ------------------ |
| id         | UUID (Primary Key) |
| name       | TEXT               |
| email      | TEXT (Unique)      |
| created_at | TIMESTAMP          |

### **Boards**

| Column     | Type                          |
| ---------- | ----------------------------- |
| id         | UUID (Primary Key)            |
| name       | TEXT                          |
| user_id    | UUID (Foreign Key → Users.id) |
| created_at | TIMESTAMP                     |

### **Lists**

| Column     | Type                           |
| ---------- | ------------------------------ |
| id         | UUID (Primary Key)             |
| name       | TEXT                           |
| board_id   | UUID (Foreign Key → Boards.id) |
| position   | INTEGER                        |
| created_at | TIMESTAMP                      |

### **Tasks**

| Column      | Type                          |
| ----------- | ----------------------------- |
| id          | UUID (Primary Key)            |
| title       | TEXT                          |
| description | TEXT                          |
| status      | TEXT                          |
| due_date    | DATE                          |
| list_id     | UUID (Foreign Key → Lists.id) |
| created_at  | TIMESTAMP                     |

---

## 🔗 Relationships

```text
Users
  │
  └── Boards
        │
        └── Lists
              │
              └── Tasks
```

* One **User** can have multiple **Boards**.
* One **Board** can have multiple **Lists**.
* One **List** can have multiple **Tasks**.

---

## 🧰 Technologies Used

* Supabase
* PostgreSQL
* SQL

---

## 📂 Project Structure

```text
capstone-db-design/
│
├── README.md
└── sql/
    └── schema.sql
```

---

## ▶️ How to Run

1. Open your Supabase project.
2. Navigate to **SQL Editor**.
3. Copy the contents of `sql/schema.sql`.
4. Paste the SQL into a new query.
5. Run the query to create the database schema.
6. Verify the tables and relationships using the **Schema Visualizer**.

---

## 📸 Output

After executing the SQL script, the following tables are created:

* Users
* Boards
* Lists
* Tasks

The schema visualizer displays the relationships:

```text
Users → Boards → Lists → Tasks
```

---

## 👩‍💻 Author

**Alveena Kamal**
