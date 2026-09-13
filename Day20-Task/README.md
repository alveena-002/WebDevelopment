# Day 20 — Environment Variables (.env Setup)

## What it does
Secrets like `SUPABASE_URL` and `SUPABASE_KEY` are moved out of the source
code and into a `.env` file, loaded at runtime with the `dotenv` package.

## Folder Structure
```
day20-env-variables/
├── supabaseClient.js   # builds the Supabase client from env vars
├── server.js           # example route that uses supabaseClient
├── package.json
├── .gitignore           # excludes .env from Git
└── .env.example
```

## Setup

```bash
cd day20-env-variables
npm install
cp .env.example .env
```

Open `.env` and fill in your real values:
```
SUPABASE_URL=https://xxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJI...
PORT=5000
JWT_SECRET=any_random_secret
```

```bash
npm start
```

Test:
```bash
curl http://localhost:5000/api/test-connection
```

> Note: this route queries a `users` table by default — replace it with
> whatever table actually exists in your Supabase project, or the request
> will return an error (this is expected and confirms the connection code
> itself is working — see the execution log below).

## Best Practices
1. **Never commit `.env` to Git** — already excluded in `.gitignore`.
2. Every environment (local, staging, production) should have its own `.env`.
3. Push `.env.example` to GitHub (without real values) so your team knows which variables are required.
4. On deployment platforms (Vercel/Railway), set secrets through their **Environment Variables** dashboard — the `.env` file itself is not uploaded there.
5. If `SUPABASE_URL`/`SUPABASE_KEY` are missing, `supabaseClient.js` throws an error immediately — this catches misconfiguration early.
