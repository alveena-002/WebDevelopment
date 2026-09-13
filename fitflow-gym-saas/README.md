# FitFlow Gym SaaS

A React (Vite) + Express based gym/SaaS web app.

## Tech Stack
- Frontend: React 19, Vite 7, Tailwind CSS 4, Radix UI, wouter (routing)
- Backend: Express (Node.js)
- Package manager: pnpm

## Prerequisites
- Node.js 20+ (Node 24 recommended, per devDependencies)
- pnpm (`npm install -g pnpm`)

## Setup

1. Extract the zip — you'll get a `fitflow-gym-saas` folder. Open a terminal inside it.
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Running in development
Starts the Vite dev server with hot reload:
```bash
pnpm dev
```
This opens the app at `http://localhost:5173` (Vite's default) — check your terminal output for the exact URL.

## Building for production
```bash
pnpm build
```
This builds the client into `dist/public` and bundles the server into `dist/index.js`.

## Running in production
```bash
pnpm start
```
Serves the built app at `http://localhost:3000` (or the port set via the `PORT` environment variable).

## Other useful commands
```bash
pnpm preview   # Preview the production build locally via Vite
pnpm check     # TypeScript type-check (no emit)
pnpm format    # Format code with Prettier
```

## Project Structure
```
client/    → React frontend (src, public, index.html)
server/    → Express backend entry (index.ts)
shared/    → Code shared between client and server
```
