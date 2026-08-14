
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






<img width="1366" height="728" alt="image (17)" src="https://github.com/user-attachments/assets/ea4ee6ac-c276-4f1d-bbb9-9f6a1f78a800" />
<img width="1366" height="728" alt="image (18)" src="https://github.com/user-attachments/assets/3c54bca8-6fb9-4f3f-be5f-bdaa64caebc5" />
<img width="1366" height="728" alt="image (19)" src="https://github.com/user-attachments/assets/2865d3a3-8e48-46c5-8cf6-bb391a2b8352" />
<img width="1366" height="728" alt="image (20)" src="https://github.com/user-attachments/assets/87c1c6d7-665a-4a65-89d1-b7c6f5be94e4" />
<img width="1366" height="728" alt="image (21)" src="https://github.com/user-attachments/assets/31abe13b-f598-42a6-9dcb-0dc3074e690d" />
<img width="1366" height="728" alt="image (22)" src="https://github.com/user-attachments/assets/7d09ba8f-5789-464e-8b00-7bcfda19b2ac" />
<img width="1366" height="728" alt="image (23)" src="https://github.com/user-attachments/assets/e70948cd-7153-466f-bf85-63cba71d2ca1" />
<img width="1366" height="728" alt="image (24)" src="https://github.com/user-attachments/assets/071ddac6-6804-43e7-903a-ce499a10fe72" />
<img width="1366" height="728" alt="image (25)" src="https://github.com/user-attachments/assets/6ba2fedd-7648-42ec-adbd-d5ea4d75c02c" />
<img width="1366" height="728" alt="image (26)" src="https://github.com/user-attachments/assets/1a69e87d-6921-4d57-b765-d4a9cc973e7f" />
<img width="1366" height="728" alt="image (27)" src="https://github.com/user-attachments/assets/e7e98593-50fd-4424-979c-f625f448dd4a" />
<img width="1366" height="728" alt="image (28)" src="https://github.com/user-attachments/assets/6a7dfd2e-f30c-4c18-8d52-2eac2f69684b" />
<img width="1366" height="728" alt="image (29)" src="https://github.com/user-attachments/assets/92a6766e-b211-47aa-83f7-cc3bbcf99205" />
<img width="1366" height="728" alt="image (30)" src="https://github.com/user-attachments/assets/8925cf68-e1b4-40d1-a42c-f8a372017e0f" />
<img width="1366" height="728" alt="image (31)" src="https://github.com/user-attachments/assets/7c011b7a-7ce8-45c3-a6da-7ebf9c00cb5e" />
<img width="1366" height="728" alt="image (32)" src="https://github.com/user-attachments/assets/dafe1f9a-f29e-433a-94da-2afaf52d1cee" />
