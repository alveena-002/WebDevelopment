# MedConnect – Clinic Management System

A full-stack clinic management web app for GP, dental, and physiotherapy clinics, built with **React 18 + TypeScript + Vite + Tailwind CSS** on the frontend and **Supabase** (Postgres + Auth) on the backend.

## Features

- **Staff Authentication** – secure sign-in for clinic staff (admin, doctor, receptionist roles)
- **Dashboard** – overview of clinic activity and key stats
- **Patient Management** – add, view, and manage patient records (contact info, NHS number, allergies, medical conditions, notes)
- **Appointments** – schedule and track in-person, video, and phone appointments, with status (scheduled/completed/cancelled/no-show) and no-show risk tracking
- **Video Consultations** – manage and join remote video appointments
- **Intake Forms** – digital patient intake forms with pending/submitted/reviewed status
- **Prescriptions** – track prescriptions and refill requests (active, refill requested/approved/denied, completed)
- **Staff Rota** – manage clinic staff scheduling

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React (icons)
- **Backend:** Supabase (PostgreSQL, Auth, Row Level Security)
- **Tooling:** ESLint, PostCSS

## Project Structure

```
src/
  components/     # UI screens (Dashboard, Patients, Appointments, etc.)
  lib/            # Auth, Supabase client, types, utilities, toast notifications
supabase/
  migrations/     # Database schema, seed data, and fixes
```

## Getting Started

```bash
npm install
npm run dev       # start local dev server
npm run build      # production build
npm run typecheck   # TypeScript check
npm run lint         # lint code
```

You'll need a Supabase project set up with the migrations in `supabase/migrations` applied, and the relevant Supabase URL/anon key configured for `src/lib/supabase.ts`.

## About

This project was built as part of a lab/internship task, focused on building a production-style multi-role clinic management platform with real-time data handling via Supabase.
