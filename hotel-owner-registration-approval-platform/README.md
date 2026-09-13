# Hotel Owner Registration & Approval Platform

Comprehensive hotel owner onboarding, verification & approval workflow with multi-tenant dashboards, room & booking management, cleaning team dispatch, and a guest reservation portal.

## Features

- Hotel owner registration and onboarding flow
- Admin approval and verification dashboard
- Multi-tenant hotel management
- Room and booking management
- Cleaning team dispatch and scheduling
- Guest-facing reservation portal
- Photo gallery, hotel comparison, and interactive map views

## Prerequisites

- Node.js (recommended: latest LTS version)

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` (or `.env.local`) and fill in the required environment variables.
3. Run the app in development mode:
   ```
   npm run dev
   ```
4. Build for production:
   ```
   npm run build
   ```
5. Preview the production build:
   ```
   npm run preview
   ```

## Project Structure

- `src/components` — UI components, organized by role (admin, owner, public) and by type (modals, common)
- `src/context` — App-wide state and context providers
- `src/data` — Seed data
- `src/types.ts` — Shared TypeScript types
- `assets` — Static assets

## Tech Stack

React, TypeScript, Vite, Tailwind CSS.
