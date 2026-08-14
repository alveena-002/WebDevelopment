/*
# Fix: remove FK constraint on clinic_staff.user_id

## Problem
The `seed_demo_clinic` function inserts placeholder clinician rows with
`gen_random_uuid()` as `user_id` for the rota/performance views. The
`clinic_staff.user_id REFERENCES auth.users(id) ON DELETE CASCADE`
constraint rejects these because the random UUIDs don't exist in auth.users.

## Fix
Drop the foreign key constraint on `clinic_staff.user_id`. The column keeps
its `DEFAULT auth.uid()` and the RLS policies still scope access correctly.
This allows demo placeholder clinicians to coexist with real auth-linked staff.

## Security
No RLS or policy changes — access control is unchanged.
*/

ALTER TABLE clinic_staff DROP CONSTRAINT IF EXISTS clinic_staff_user_id_fkey;