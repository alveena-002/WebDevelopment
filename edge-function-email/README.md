# 📧 Edge Function Email Notification

This project demonstrates how to use **Supabase Edge Functions** with **Resend** to automatically send a welcome email whenever a new user is added to the database.

## 🚀 Features

* Create a Supabase Edge Function
* Send emails using the Resend API
* Automatically trigger the Edge Function on a new database insert
* Use PostgreSQL Trigger and `pg_net` extension
* Secure API keys using Supabase Secrets

---

## 🛠️ Tech Stack

* Supabase
* Supabase Edge Functions
* PostgreSQL
* pg_net Extension
* Resend API
* TypeScript (Deno)

---

## 📂 Project Structure

```text
edge-function-email/
│
├── supabase/
│   ├── functions/
│   │   └── send-email/
│   │       ├── index.ts
│   │       └── deno.json
│   └── config.toml
│
└── README.md
```

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/edge-function-email.git
```

### 2. Open the project

```bash
cd edge-function-email
```

### 3. Login to Supabase

```bash
supabase login
```

### 4. Link your project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 5. Set the Resend API Key

```bash
supabase secrets set RESEND_API_KEY=YOUR_RESEND_API_KEY
```

### 6. Deploy the Edge Function

```bash
supabase functions deploy send-email
```

---

## 📧 How It Works

1. A new user is inserted into the **users** table.
2. PostgreSQL Trigger is executed.
3. The trigger calls the **send-email** Edge Function.
4. The Edge Function uses the **Resend API**.
5. A welcome email is automatically sent to the user's email address.

---

## 📬 Example Email

**Subject**

```text
Welcome!
```

**Body**

```text
Hello Alveena 👋

Your record has been added successfully.

Welcome to our application!
```

---

## 📸 Output

* User inserted into the database.
* Edge Function triggered automatically.
* Welcome email received successfully in Gmail.

---

## 📚 What I Learned

* Creating and deploying Supabase Edge Functions
* Using Supabase Secrets for secure API keys
* Integrating the Resend Email API
* Creating PostgreSQL Triggers
* Using the `pg_net` extension for HTTP requests
* Automating email notifications after database inserts

---

## 👩‍💻 Author

**Alveena Kamal**
