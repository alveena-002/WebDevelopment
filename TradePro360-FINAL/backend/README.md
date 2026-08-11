# TradePro 360 — Backend API

A real, runnable implementation of the booking, AI dispatch, live tracking,
payments and admin API described in `TradePro360-Architecture.docx`. It
powers the same flow as the front-end prototype (`TradePro360.html`), but
backed by an actual database instead of in-memory state.

Built with **Express + Socket.IO**, with a choice of two database backends
(see [Database: SQLite vs PostgreSQL](#database-sqlite-vs-postgresql)
below) — SQLite by default (zero setup), PostgreSQL + PostGIS for
production.

**Requires Node.js 22.5.0 or newer** (`node --version` to check) — even
in Postgres mode, since the SQLite fallback path still uses `node:sqlite`.

## Quick start (SQLite, zero setup)

```bash
npm install
cp .env.example .env
npm start
```

The API starts on `http://localhost:4000` and seeds itself with a demo
tenant, 8 engineers spread across UK cities, and the full parts/labour price
list on first run (`tradepro360.db` is created automatically).

Check it's alive:
```bash
curl http://localhost:4000/api/health
```

## Quick start (Docker Compose — API + Postgres in one command)

From the project root (not `backend/`):

```bash
docker compose up --build
curl http://localhost:4000/api/health   # -> {"ok":true,...,"database":"postgres"}
```

This builds `backend/Dockerfile` and runs it alongside a
`postgis/postgis` container, wired together via `DATABASE_URL` — see
`docker-compose.yml` at the project root. Migrations and seed data run
automatically on first boot, same as the SQLite path.

## What actually works right now

- **Real database** — bookings, engineers, chat, photos, reviews and prices
  persist in `tradepro360.db` and survive a restart.
- **Real AI dispatch** — `findNearestEngineer` in `src/dispatch.js` filters
  available engineers by trade and service radius, then scores by distance
  (haversine) and rating. Swap the ETA calculation for Google Distance
  Matrix when you have an API key — the function signature is unchanged.
- **Real-time updates** — Socket.IO rooms keyed by booking ID broadcast
  status changes, GPS pings, and chat messages to anyone subscribed.
- **Real PDF invoices** — generated server-side with PDFKit and streamed
  back as an actual downloadable PDF.
- **Stripe-ready payments** — if `STRIPE_SECRET_KEY` is set, `/pay-now`
  creates a real PaymentIntent and `/api/stripe/webhook` confirms it. With
  no key set, it runs in demo mode (marks the booking paid immediately) so
  the API is usable out of the box.
- **Real JWT auth** — `bcrypt` password hashes, `jsonwebtoken` tokens, role
  checks on protected routes. See [Authentication](#authentication) below.
- **PostgreSQL + PostGIS as a production alternative to SQLite**, selected
  via `DATABASE_URL`, with its own migration files and Docker Compose setup
  for local development. See [Database](#database-sqlite-vs-postgresql).
- **Real road-network ETA** via Google Distance Matrix when
  `GOOGLE_MAPS_API_KEY` is set — falls back to the haversine estimate
  otherwise.
- **S3-compatible photo storage** — uploads to S3 (or any S3-compatible
  endpoint) when AWS credentials are configured, local disk otherwise. See
  [Photo storage](#photo-storage).
- **Docker packaging** — a production Dockerfile and a `docker-compose.yml`
  that runs the full stack locally with one command. See
  `../DEPLOYMENT.md` for taking this to a real public URL.
- **Basic production hardening** — `helmet` security headers,
  `express-rate-limit` on auth and booking creation, and a configurable
  CORS allowlist. See [Production hardening](#production-hardening).

## What still needs real credentials / infra to go live

- A **Stripe account** (test or live secret key + webhook secret) for real charges.
- A **Google Maps Platform API key** (Distance Matrix API enabled) for real
  road-network ETAs instead of the haversine estimate.
- A **Google Business Profile** integration — this API doesn't call Google
  on its own; it's the landing target for the "Book" button link described
  in the architecture doc.
- An **S3 bucket** (or compatible provider) for durable photo storage —
  without one, photos are written to local disk, which is fine for a demo
  but is wiped on every redeploy on most hosting platforms.
- **Actually deploying it** — see `../DEPLOYMENT.md` for a concrete,
  step-by-step path to a public URL on Render (or Fly.io).

## API reference

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Liveness check |
| GET | `/api/services` | Full service + job type + price list |
| POST | `/api/quotes` | `{ trade, jobTypeId }` → instant priced quote |
| POST | `/api/bookings` | Create a booking — runs AI dispatch automatically |
| GET | `/api/bookings` | List all bookings (admin dashboard) |
| GET | `/api/bookings/:id` | Get one booking with engineer details |
| PATCH | `/api/bookings/:id/status` | Advance job status |
| POST | `/api/bookings/:id/location` | Engineer app pushes a GPS ping |
| GET/POST | `/api/bookings/:id/messages` | Chat thread |
| POST | `/api/bookings/:id/photos` | Attach a job photo (`data:` URI or hosted URL — see [Photo storage](#photo-storage)) |
| POST | `/api/bookings/:id/review` | Leave a rating (only once `completed`) |
| GET | `/api/bookings/:id/invoice.pdf` | Download the generated invoice |
| POST | `/api/bookings/:id/pay-now` | Create/simulate a Stripe PaymentIntent |
| POST | `/api/bookings/:id/pay-later` | Flag booking as invoice-on-completion |
| POST | `/api/stripe/webhook` | Stripe payment confirmation |
| GET | `/api/engineers` | Engineer roster |
| GET | `/api/admin/summary` | KPIs: bookings, revenue, rating, availability |

## Real-time events (Socket.IO)

Connect, then `socket.emit('join', bookingId)` to subscribe. You'll receive:
- `booking:update` — full booking object whenever status changes
- `engineer:location` — `{ bookingId, lat, lng, at }` on every GPS ping
- `chat:message` — new chat messages
- `photo:new` — new job photo

## Example: full flow with curl

```bash
# 1. Get a quote
curl -X POST localhost:4000/api/quotes -H 'Content-Type: application/json' \
  -d '{"trade":"plumbing","jobTypeId":"boiler"}'

# 2. Book it (triggers AI dispatch)
curl -X POST localhost:4000/api/bookings -H 'Content-Type: application/json' -d '{
  "customerName":"Jane Carter","customerPhone":"07123456789",
  "addressLabel":"10 Downing St, London","lat":51.5034,"lng":-0.1276,
  "trade":"plumbing","jobTypeId":"boiler"
}'

# 3. Advance the job (use the id returned above)
curl -X PATCH localhost:4000/api/bookings/<id>/status -H 'Content-Type: application/json' \
  -d '{"status":"en_route"}'

# 4. Download the invoice
curl localhost:4000/api/bookings/<id>/invoice.pdf -o invoice.pdf
```

## Authentication

Real login is now implemented (JWT + bcrypt password hashing):

- `POST /api/auth/register` — `{ name, email, password, role }` (`role` is `customer`, `engineer` or `owner`)
- `POST /api/auth/login` — `{ email, password }` → `{ token, user }`
- `GET /api/auth/me` — sanity check, requires `Authorization: Bearer <token>`

**Demo accounts (seeded automatically):**
| Role | Email | Password |
|---|---|---|
| Owner | `owner@tradepro360.demo` | `demo1234` |
| Engineer | `e1@tradepro360.demo` ... `e8@tradepro360.demo` | `demo1234` |

Protected endpoints:
- `GET /api/bookings`, `GET /api/engineers`, `GET /api/admin/summary` — require `owner` or `admin` role.
- `GET /api/bookings/mine` — requires `engineer` role; returns only that engineer's jobs.
- `PATCH /api/bookings/:id/status` and `POST /api/bookings/:id/location` — **soft-protected**: if a token is sent, it must belong to the assigned engineer; if no token is sent, the call is still allowed (so the front-end's "simulate" demo button keeps working without a login). Remove the anonymous fallback before going to production.

Set `JWT_SECRET` in `.env` before deploying — the code falls back to a fixed dev secret otherwise, which is fine locally but not safe in production.

## Database: SQLite vs PostgreSQL

Picked automatically by whether `DATABASE_URL` is set:

| | `DATABASE_URL` unset (default) | `DATABASE_URL` set |
|---|---|---|
| Engine | SQLite via `node:sqlite` | PostgreSQL + PostGIS |
| Setup | None — `tradepro360.db` created on first run | Needs a real Postgres instance with the `postgis` extension available (Render's managed Postgres and the `postgis/postgis` Docker image both have it) |
| Schema | Created inline in `src/db/sqlite.js` | Applied from `migrations/*.sql` on boot, tracked in a `schema_migrations` table so it's safe to restart repeatedly |
| Code path | `src/db/sqlite.js` | `src/db/postgres.js` |

Both are selected through `src/db/index.js`, and every route talks to the
same `db.prepare(sql).get/all/run(...)` interface either way (routes
`await` these calls — a no-op extra tick against SQLite, a real async
round-trip against Postgres). If you add a new query, write it once using
`?` placeholders as usual; `src/db/postgres.js` translates `?` →
`$1, $2, ...` automatically. The two SQLite-only constructs already in use
elsewhere (`datetime('now')` and `INSERT OR REPLACE`) are also translated
automatically — see the comment at the top of `src/db/postgres.js` if you
add a new query using either.

**Switching to Postgres locally without Docker:**
```bash
# with a local Postgres already running and the postgis extension available:
createdb tradepro360
psql tradepro360 -c 'CREATE EXTENSION IF NOT EXISTS postgis;'
DATABASE_URL=postgresql://localhost/tradepro360 npm start
```

**PostGIS note:** the `engineers` table has a GiST index on an
`ST_MakePoint(lng, lat)::geography` expression, provisioned for a future
`ST_DWithin`/`ST_Distance` query once engineer counts grow beyond what
scoring candidates in JS (the current, still-in-use approach in
`src/dispatch.js`) can handle efficiently. It's an index, not a stored
column, so it doesn't change the shape of rows returned by `SELECT *` —
`dispatch.js` itself is identical across both backends today.

## Photo storage

`POST /api/bookings/:id/photos` accepts a `url` field that's either an
already-hosted `http(s)://` URL (passed through untouched) or a `data:`
URI (what `TradePro360.html` sends today — read client-side via
`FileReader`). Handled by `src/storage.js`:

- **`AWS_S3_BUCKET` set** → uploads to S3 via `@aws-sdk/client-s3`. Also
  works against any S3-compatible provider (MinIO, Cloudflare R2,
  Backblaze B2) by additionally setting `AWS_S3_ENDPOINT` (and
  `AWS_S3_FORCE_PATH_STYLE=true` for providers that need it).
- **Unset (default)** → decodes the `data:` URI and writes it to
  `backend/uploads/`, served statically at `/uploads/<file>`. Zero
  configuration required, but note this directory is **not** durable on
  most hosting platforms (wiped on redeploy) — fine for a demo, not for
  production.

## Real road-network ETA

`src/dispatch.js`'s `findNearestEngineer` still picks *which* engineer to
dispatch the same way it always has — nearest available match by
haversine distance, rating as a tie-breaker. The only thing that changes
with `GOOGLE_MAPS_API_KEY` set is the **ETA shown for the winning
engineer**: it calls the Google Distance Matrix API for a real
driving-time estimate (with live traffic, `departure_time=now`) instead of
the `avgSpeedKmh`-based approximation. Any failure (missing key, network
error, no route found) falls back to the haversine estimate automatically
— dispatch never fails because of this integration.

## Production hardening

- **`helmet`** — sets standard security headers on every response.
- **`express-rate-limit`** — 30 requests / 15 min on `/api/auth/*`, 60
  requests / 15 min on `POST /api/bookings` (booking creation, which
  triggers AI dispatch). Adjust the limits in `src/server.js` if they're
  too tight/loose for your traffic.
- **CORS allowlist** — set `CORS_ORIGIN` to a comma-separated list of
  allowed origins in production. Defaults to `*` (any origin) when unset,
  which is what keeps local dev and opening the HTML files directly
  working with zero configuration.

Full list of every environment variable, required vs optional:
`.env.production.example`.

## Docker

```bash
# build just the API image
cd backend
docker build -t tradepro360-backend .
docker run -p 4000:4000 --env-file .env tradepro360-backend

# or the full stack (API + Postgres) from the project root
docker compose up --build
```

See `../DEPLOYMENT.md` for taking this to a real public URL (Render,
with notes on Fly.io as an alternative).

## Engineer mobile app

`TradePro360-Engineer.html` (in the parent project folder) is a real, mobile-first
app for engineers: sign in with one of the demo accounts above, see the job
the AI dispatcher assigned, advance its status, share live GPS location
(via `navigator.geolocation.watchPosition`, posted to `/location` every few
seconds), and chat with the customer. It talks to this same API — open it
alongside `TradePro360.html` and a booking made in one shows up live in the
other over the shared WebSocket.



`TradePro360.html` now auto-connects to this API. Open the HTML file with
this backend running (`npm start`), and the dark banner at the top of the
page will turn green: "Connected to live backend." From that point on,
booking, dispatch, chat, photos, ratings, invoices and payments all go
through this real API and database instead of the in-browser mock data. If
the backend isn't reachable, the page falls back to local demo mode
automatically — nothing breaks either way.

If you're running the API somewhere other than `localhost:4000` (e.g. after
deploying it), paste that URL into the "API base" field in the banner and
click Reconnect.
