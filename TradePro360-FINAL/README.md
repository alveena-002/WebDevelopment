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

## Connecting the front-end app

`TradePro360.html` auto-connects to this API. Open the HTML file with
this backend running (`npm start`), and the dark banner at the top of the
page will turn green: "Connected to live backend." From that point on,
booking, dispatch, chat, photos, ratings, invoices and payments all go
through this real API and database instead of the in-browser mock data. If
the backend isn't reachable, the page falls back to local demo mode
automatically — nothing breaks either way.

If you're running the API somewhere other than `localhost:4000` (e.g. after
deploying it), paste that URL into the "API base" field in the banner and
click Reconnect.



<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 49 15 AM" src="https://github.com/user-attachments/assets/fbcad091-439b-48d1-853e-2cc90bcbdab5" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 53 40 AM" src="https://github.com/user-attachments/assets/20622ed4-f8be-49a6-8dac-15ddc39c9b5f" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 51 01 AM" src="https://github.com/user-attachments/assets/d4310d04-02da-4c85-80d7-916ed9d14a33" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 50 40 AM" src="https://github.com/user-attachments/assets/ba024bf1-14b2-4e2e-895a-3a454fb2a17c" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 50 26 AM" src="https://github.com/user-attachments/assets/110d100c-9bb2-4966-b786-bc6bb0095e29" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 59 53 AM" src="https://github.com/user-attachments/assets/2129a90b-6e1d-4591-a079-8191ecae4c9d" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 3 00 08 AM" src="https://github.com/user-attachments/assets/62eeb148-3d1a-4b3e-99fd-02aab87ca86d" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 3 00 44 AM" src="https://github.com/user-attachments/assets/c2e06b44-40bd-4f72-b4f4-ec543b22b048" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 3 02 42 AM" src="https://github.com/user-attachments/assets/5795762f-b138-41a2-9f5f-c1290cd2a8a1" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 3 04 38 AM" src="https://github.com/user-attachments/assets/a9e82959-c2c8-4b6e-b259-891805f048aa" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 3 06 37 AM" src="https://github.com/user-attachments/assets/85c75d08-7f40-4ca4-8445-d5ee29b4a97c" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 3 10 55 AM" src="https://github.com/user-attachments/assets/bbb4e0ae-6c50-45a2-b735-ac452ff80510" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 4 02 08 AM" src="https://github.com/user-attachments/assets/ddfa8ece-c5c3-4900-9edd-bb8760f0b573" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 4 02 26 AM" src="https://github.com/user-attachments/assets/047d4433-3032-426d-8d68-b238cde797c5" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 56 48 AM" src="https://github.com/user-attachments/assets/6fc3c533-3e4e-48f9-8985-08dee39508e7" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 58 47 AM" src="https://github.com/user-attachments/assets/57acc546-d4b7-4115-a6d2-66b72f66b54f" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 59 01 AM" src="https://github.com/user-attachments/assets/4acc4750-0d4c-4c1f-8028-a37837026647" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 59 32 AM" src="https://github.com/user-attachments/assets/4374895e-0bcc-4ee6-bec3-34d43f79595f" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 3 00 44 AM" src="https://github.com/user-attachments/assets/71af0184-647c-494a-b764-9e86e3ad0751" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 3 01 01 AM" src="https://github.com/user-attachments/assets/27957827-db22-4bc8-86ef-9f6551cd1399" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 3 01 25 AM" src="https://github.com/user-attachments/assets/67463740-ac43-4559-9b23-05af68c12618" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 3 02 16 AM" src="https://github.com/user-attachments/assets/8fbeb479-302f-4fc6-bdec-23c3122b1cef" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 3 06 37 AM" src="https://github.com/user-attachments/assets/61533167-48da-4c6d-b200-b42250f9afaf" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 3 06 37 AM (1)" src="https://github.com/user-attachments/assets/a5a8b7f1-f54f-4d9c-848c-48c16a098988" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 3 06 55 AM" src="https://github.com/user-attachments/assets/ddee66c2-e732-4d2e-b785-11049e6f95a9" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 3 10 38 AM" src="https://github.com/user-attachments/assets/4df5240a-184c-46d6-906d-6331b75353e7" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 4 02 26 AM" src="https://github.com/user-attachments/assets/44c452d4-996a-45b7-a7f0-3f937f8acf80" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 4 02 56 AM" src="https://github.com/user-attachments/assets/cd8ae8da-cbb4-4d74-81ca-78de832eeb24" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 4 03 11 AM" src="https://github.com/user-attachments/assets/a947cb7b-3edf-4190-a3e4-b7ec0ff1a0d4" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 4 03 21 AM" src="https://github.com/user-attachments/assets/65fba1c7-c00c-4750-bc52-efbda80c02fc" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 56 24 AM" src="https://github.com/user-attachments/assets/f85a5513-a8c1-4d61-887f-f97f358cfaec" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 55 53 AM" src="https://github.com/user-attachments/assets/b61679c5-d6e1-48a1-bdc3-f092642ed37d" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 55 23 AM" src="https://github.com/user-attachments/assets/7a1f3383-570a-4515-95d7-e2623d3b7d26" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 55 08 AM" src="https://github.com/user-attachments/assets/a1c07db7-77e1-4479-9771-f5c4e2ab68ee" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 54 53 AM" src="https://github.com/user-attachments/assets/a3422691-b4c5-4482-ae36-4672a8df5af2" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 54 39 AM" src="https://github.com/user-attachments/assets/6cf99d88-6f81-4bb3-b66e-98f09e32bcdd" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 54 21 AM" src="https://github.com/user-attachments/assets/1279b556-f879-464d-a18f-cf452bed1d23" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 54 21 AM" src="https://github.com/user-attachments/assets/baf0ad17-701f-4632-8b01-7762af4ee4e0" />
<img width="1366" height="728" alt="WhatsApp Image 2026-08-11 at 2 53 57 AM" src="https://github.com/user-attachments/assets/040d65d3-07a9-4ba9-a988-2705bd45cc6c" />
