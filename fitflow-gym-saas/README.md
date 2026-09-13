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
<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/43d6f097-6ac8-4b85-9315-09ac5197ea97" />
<img width="1366" height="728" alt="image (1)" src="https://github.com/user-attachments/assets/ba4e9deb-3890-43e7-a8ca-9708cee68052" />
<img width="1366" height="728" alt="image (2)" src="https://github.com/user-attachments/assets/49cde178-9ba3-4119-bce9-413ea5063fcd" />
<img width="1366" height="728" alt="image (3)" src="https://github.com/user-attachments/assets/99c490aa-6da7-47b6-b03a-4409fdfd656a" />
<img width="1366" height="728" alt="image (4)" src="https://github.com/user-attachments/assets/c00f813b-485e-4266-b140-e85f5166b427" />
<img width="1366" height="728" alt="image (5)" src="https://github.com/user-attachments/assets/ff84b2be-f211-4062-ac1f-e83646270677" />
<img width="1366" height="728" alt="image (6)" src="https://github.com/user-attachments/assets/4dff159f-49f6-4e45-b60b-5618b0b902b4" />

