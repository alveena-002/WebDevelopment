# Deploying TradePro 360

This covers taking `backend/` from "runs on my laptop" to a real public
URL on **Render** (render.com) — picked because it can host both the API
and a managed Postgres+PostGIS database from one dashboard with no
separate infra to provision. The same Dockerfile works anywhere that
runs containers (Fly.io, Railway, ECS, a plain VPS with `docker run`) if
you'd rather use one of those instead.

The frontends (`TradePro360.html`, `TradePro360-Engineer.html`) are
static files with no build step — host them anywhere that serves static
files (Render Static Site, Netlify, Vercel, S3+CloudFront, or just open
them locally) and point them at your API's public URL in the "API base
URL" banner at the top of each page.

---

## 1. Push the repo to GitHub

Render deploys from a Git repo. Commit this project (including the new
`Dockerfile`, `docker-compose.yml`, and `backend/migrations/`) and push
it somewhere Render can see — a GitHub repo is the easiest path.

## 2. Create the database — Render > New > PostgreSQL

- Any plan works for a demo; PostGIS is available on all of Render's
  Postgres plans (Render's Postgres images ship with the `postgis`
  extension pre-installed — you don't need to install it yourself).
- Once created, copy the **Internal Database URL** shown on the database's
  page. It looks like:
  `postgresql://user:password@dpg-xxxxx-a/tradepro360`
- The app runs its own migrations on boot (`backend/migrations/*.sql`,
  applied by `src/db/postgres.js`), so there's nothing to run manually
  here beyond having the database exist — the API will call
  `CREATE EXTENSION IF NOT EXISTS postgis;` and create every table itself
  on first boot.

## 3. Create the API — Render > New > Web Service

- **Repository**: the repo you pushed in step 1.
- **Root Directory**: `backend`
- **Runtime**: Docker (Render will pick up `backend/Dockerfile`
  automatically once Root Directory is set to `backend`).
- **Instance type**: the smallest paid tier is enough for a demo; the
  free tier works too but spins down on idle, which will make the first
  request after a while slow (WebSocket reconnects handle this fine, but
  it's worth knowing about).

### Environment variables (Render dashboard → your service → Environment)

| Variable | Required? | Value |
|---|---|---|
| `DATABASE_URL` | **Required** | The Internal Database URL from step 2 |
| `JWT_SECRET` | **Required** | A long random string — e.g. `openssl rand -hex 32` |
| `CORS_ORIGIN` | Recommended | Comma-separated origins of wherever you host the two HTML apps, e.g. `https://tradepro-customer.onrender.com,https://tradepro-engineer.onrender.com` |
| `PUBLIC_URL` | Recommended | This service's own public URL, e.g. `https://tradepro360-api.onrender.com` — used to build absolute photo URLs when not using S3 |
| `STRIPE_SECRET_KEY` | Optional | From dashboard.stripe.com — omit to keep demo-mode payments |
| `STRIPE_WEBHOOK_SECRET` | Optional | From the Stripe webhook you point at `https://<your-api>/api/stripe/webhook` |
| `GOOGLE_MAPS_API_KEY` | Optional | From Google Maps Platform, with the Distance Matrix API enabled — omit to keep the haversine ETA estimate |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` / `AWS_S3_BUCKET` | Optional | Omit to keep the local-disk `/uploads` fallback (see the storage note below) |

`PORT` doesn't need to be set — Render injects it automatically and the
app already reads `process.env.PORT`.

Full reference for every variable: `backend/.env.production.example`.

### A note on photo storage without S3

If you deploy without `AWS_S3_BUCKET` set, job photos are written to
`/app/uploads` inside the container. Render's filesystem is **ephemeral**
— it's wiped on every deploy/restart. That's fine for a demo, but for
anything real, either:
- Set the `AWS_*` variables to use S3 (or an S3-compatible provider like
  Cloudflare R2 — set `AWS_S3_ENDPOINT` too), or
- Attach a Render Persistent Disk mounted at `/app/uploads`.

### Health check

Render will use `GET /api/health` automatically if you set the Health
Check Path to `/api/health` in the service settings — it already exists
and returns `{ ok: true, service: "tradepro360-api", database: "postgres" }`.

## 4. Deploy

Click "Create Web Service". Render builds `backend/Dockerfile` and
starts the container. Watch the deploy log for:

```
[postgres] applying migration 001_init.sql
[postgres] seeded tenant, engineers and price list.
TradePro 360 API listening on http://localhost:4000
Database: PostgreSQL
```

Then confirm from your own machine:

```bash
curl https://<your-service>.onrender.com/api/health
```

## 5. Point the frontends at it

Open `TradePro360.html` and `TradePro360-Engineer.html`, and in the "API
base URL" banner at the top, enter your Render service's public URL. If
you're hosting the HTML files themselves on a different origin, make
sure that origin is included in `CORS_ORIGIN` (step 3) or the browser
will block the requests.

---

## Local Docker Compose (dev/staging, not this Render path)

`docker-compose.yml` at the project root runs the same Dockerfile
against a local Postgres+PostGIS container — useful for testing the
Postgres path (or the Docker image itself) before pushing to Render:

```bash
docker compose up --build
curl http://localhost:4000/api/health
```

This is separate from the Render deployment above — Render builds and
runs `backend/Dockerfile` directly against its own managed Postgres, it
does not use `docker-compose.yml`.

---

## Alternative: Fly.io

If you'd rather use Fly.io instead of Render: `fly launch` from inside
`backend/` will detect the Dockerfile and generate a `fly.toml`. Add a
Postgres+PostGIS instance with `fly postgres create` (choose the
`postgis` image when prompted, or attach any Postgres and run
`CREATE EXTENSION postgis;` yourself before first boot), then
`fly secrets set DATABASE_URL=... JWT_SECRET=... [other vars]` before
`fly deploy`. The same environment variable table above applies.
