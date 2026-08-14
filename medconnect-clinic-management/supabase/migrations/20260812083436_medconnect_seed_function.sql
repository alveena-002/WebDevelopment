/*
# MedConnect — demo seeding function

Creates a SECURITY DEFINER function `seed_demo_clinic(p_user_id uuid, p_full_name text, p_email text)`
that provisions a full demo clinic (Thames Medical Centre) for a newly signed-up staff user:
- Creates a clinic row
- Creates the staff row linking the new auth user as admin
- Seeds 3 extra clinician staff rows (placeholder user_ids) for the rota/performance views
- Seeds ~8 patients
- Seeds appointments (today + upcoming), intake forms, prescriptions, rota, performance logs

Called from the frontend right after signUp succeeds. Runs with elevated privileges so it can
insert clinic_staff rows for placeholder clinicians and populate demo data the RLS policies
would otherwise block.

Security: SECURITY DEFINER, granted to authenticated. Only inserts demo rows; no destructive ops.
*/

CREATE OR REPLACE FUNCTION seed_demo_clinic(p_user_id uuid, p_full_name text, p_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clinic_id uuid;
  v_staff_id uuid;
  v_doc1 uuid;
  v_doc2 uuid;
  v_doc3 uuid;
  v_pat uuid[];
  v_now timestamptz := now();
  v_today date := now()::date;
BEGIN
  -- Clinic
  INSERT INTO clinics (name, type, address, phone, email)
  VALUES ('Thames Medical Centre', 'gp', '14 Riverside Walk, London SE1 2AB', '020 7946 0123', 'reception@thamesmedical.co.uk')
  RETURNING id INTO v_clinic_id;

  -- The signed-up user as admin/doctor
  INSERT INTO clinic_staff (user_id, clinic_id, full_name, role)
  VALUES (p_user_id, v_clinic_id, COALESCE(p_full_name, 'Dr. Alex Morgan'), 'admin')
  RETURNING id INTO v_staff_id;

  -- Placeholder clinicians (gen_random_uuid user_ids not in auth.users — fine for rota/display)
  v_doc1 := gen_random_uuid();
  v_doc2 := gen_random_uuid();
  v_doc3 := gen_random_uuid();

  INSERT INTO clinic_staff (user_id, clinic_id, full_name, role) VALUES
    (v_doc1, v_clinic_id, 'Dr. Priya Sharma', 'doctor'),
    (v_doc2, v_clinic_id, 'Dr. James O''Connor', 'doctor'),
    (v_doc3, v_clinic_id, 'Dr. Emily Chen', 'doctor');

  -- Patients
  INSERT INTO patients (clinic_id, first_name, last_name, date_of_birth, gender, phone, email, address, nhs_number, allergies, medical_conditions, notes) VALUES
    (v_clinic_id, 'Sarah', 'Williams', '1986-03-12', 'female', '07700 900123', 'sarah.williams@email.co.uk', '23 Mill Lane, London', '912 345 6781', 'Penicillin', 'Asthma', 'Prefers afternoon appointments'),
    (v_clinic_id, 'Michael', 'Brown', '1972-11-04', 'male', '07700 900234', 'm.brown@email.co.uk', '8 Kings Road, London', '912 345 6782', 'None', 'Hypertension, Type 2 Diabetes', 'Needs regular blood pressure checks'),
    (v_clinic_id, 'Emma', 'Taylor', '1995-07-22', 'female', '07700 900345', 'emma.taylor@email.co.uk', '56 Park Avenue, London', '912 345 6783', 'Latex', 'None', 'New patient — transferred from Brighton practice'),
    (v_clinic_id, 'David', 'Wilson', '1958-01-30', 'male', '07700 900456', 'david.wilson@email.co.uk', '102 Oak Street, London', '912 345 6784', 'Aspirin', 'Arthritis, High Cholesterol', 'Mobility limited — ground floor preferred'),
    (v_clinic_id, 'Olivia', 'Davies', '2001-09-15', 'female', '07700 900567', 'olivia.davies@email.co.uk', '4 Willow Close, London', '912 345 6785', 'None', 'Anxiety', 'Requests female clinician'),
    (v_clinic_id, 'Robert', 'Evans', '1949-05-18', 'male', '07700 900678', 'robert.evans@email.co.uk', '67 Elm Road, London', '912 345 6786', 'Codeine', 'COPD, Heart Condition', 'Home visit consideration'),
    (v_clinic_id, 'Sophie', 'Thomas', '1990-12-03', 'female', '07700 900789', 'sophie.thomas@email.co.uk', '19 Rose Gardens, London', '912 345 6787', 'Sulfa drugs', 'Migraine', 'Telemedicine preferred'),
    (v_clinic_id, 'Daniel', 'Roberts', '1983-08-27', 'male', '07700 900890', 'daniel.roberts@email.co.uk', '31 High Street, London', '912 345 6788', 'None', 'Back pain (chronic)', 'Physiotherapy referral pathway');

  -- Grab patient ids
  SELECT array_agg(id) INTO v_pat FROM patients WHERE clinic_id = v_clinic_id;

  -- Appointments: today + next few days, mix of statuses and types
  INSERT INTO appointments (clinic_id, patient_id, staff_id, start_time, duration_minutes, type, reason, status, no_show_risk, reminder_sent) VALUES
    (v_clinic_id, v_pat[1], v_staff_id, v_now + interval '1 hour', 30, 'in_person', 'Asthma review', 'scheduled', 0.18, true),
    (v_clinic_id, v_pat[2], v_staff_id, v_now + interval '2 hours', 20, 'video', 'Diabetes follow-up', 'scheduled', 0.34, true),
    (v_clinic_id, v_pat[3], v_staff_id, v_now + interval '3 hours', 30, 'in_person', 'New patient registration check', 'scheduled', 0.12, false),
    (v_clinic_id, v_pat[4], v_staff_id, v_now + interval '5 hours', 30, 'phone', 'Blood pressure review', 'scheduled', 0.45, false),
    (v_clinic_id, v_pat[5], v_staff_id, v_now + interval '1 day' + interval '2 hours', 45, 'video', 'Mental health check-in', 'scheduled', 0.22, false),
    (v_clinic_id, v_pat[6], v_staff_id, v_now + interval '2 days', 30, 'in_person', 'COPD review', 'scheduled', 0.61, false),
    (v_clinic_id, v_pat[7], v_staff_id, v_now - interval '2 hours', 30, 'video', 'Migraine consultation', 'completed', 0.28, true),
    (v_clinic_id, v_pat[8], v_staff_id, v_now - interval '1 day', 30, 'in_person', 'Back pain assessment', 'completed', 0.15, true),
    (v_clinic_id, v_pat[4], v_staff_id, v_now - interval '3 days', 30, 'in_person', 'Missed appointment', 'no_show', 0.78, true),
    (v_clinic_id, v_pat[2], v_staff_id, v_now + interval '3 days', 20, 'video', 'Repeat prescription review', 'scheduled', 0.30, false);

  -- Intake forms
  INSERT INTO intake_forms (clinic_id, patient_id, data, status, submitted_at) VALUES
    (v_clinic_id, v_pat[1], '{"reason":"Routine asthma review","symptoms":"Occasional shortness of breath","medications":["Salbutamol inhaler","Clenil"],"smoker":false,"alcohol":"2-3 units/week","exercise":"Weekly swimming"}'::jsonb, 'submitted', v_now - interval '1 day'),
    (v_clinic_id, v_pat[2], '{"reason":"Diabetes management","symptoms":"Increased thirst","medications":["Metformin"],"smoker":false,"alcohol":"None","exercise":"Daily walks"}'::jsonb, 'submitted', v_now - interval '6 hours'),
    (v_clinic_id, v_pat[3], '{"reason":"New patient registration","symptoms":"None","medications":[],"smoker":false,"alcohol":"Social","exercise":"Gym 3x/week"}'::jsonb, 'pending', NULL),
    (v_clinic_id, v_pat[5], '{"reason":"Anxiety support","symptoms":"Difficulty sleeping, racing thoughts","medications":["Sertraline"],"smoker":false,"alcohol":"Rarely","exercise":"Yoga"}'::jsonb, 'reviewed', v_now - interval '2 days');

  -- Prescriptions
  INSERT INTO prescriptions (clinic_id, patient_id, staff_id, medication, dosage, frequency, quantity, status, refill_requested_at, notes) VALUES
    (v_clinic_id, v_pat[1], v_staff_id, 'Salbutamol Inhaler', '100mcg', 'As needed', '1 inhaler', 'active', NULL, 'Repeat for 6 months'),
    (v_clinic_id, v_pat[2], v_staff_id, 'Metformin', '500mg', 'Twice daily', '60 tablets', 'refill_requested', v_now - interval '8 hours', 'Patient requested repeat'),
    (v_clinic_id, v_pat[4], v_staff_id, 'Atorvastatin', '20mg', 'Once at night', '30 tablets', 'refill_requested', v_now - interval '1 day', 'Patient requested repeat'),
    (v_clinic_id, v_pat[6], v_staff_id, 'Salbutamol Inhaler', '100mcg', 'As needed', '1 inhaler', 'active', NULL, 'COPD management'),
    (v_clinic_id, v_pat[5], v_staff_id, 'Sertraline', '50mg', 'Once daily', '28 tablets', 'refill_approved', v_now - interval '2 days', 'Approved — 1 month supply'),
    (v_clinic_id, v_pat[7], v_staff_id, 'Sumatriptan', '50mg', 'At migraine onset', '6 tablets', 'active', NULL, 'Max 2 doses/24h'),
    (v_clinic_id, v_pat[4], v_staff_id, 'Ramipril', '5mg', 'Once daily', '30 tablets', 'refill_denied', v_now - interval '4 days', 'Needs BP review first');

  -- Rota (today + next 6 days) for the 4 clinicians
  INSERT INTO staff_rota (clinic_id, staff_id, rota_date, shift_start, shift_end, working)
  SELECT v_clinic_id, s.id, g.d::date,
    CASE WHEN g.d::date = v_today THEN '09:00' ELSE '08:30' END,
    '17:30',
    NOT (g.d::date = v_today + interval '5 days' AND s.id = v_staff_id)
  FROM clinic_staff s
  CROSS JOIN generate_series(v_today, v_today + interval '6 days', interval '1 day') AS g(d)
  WHERE s.id IN (v_staff_id, (SELECT id FROM clinic_staff WHERE clinic_id = v_clinic_id AND user_id = v_doc1 LIMIT 1),
                          (SELECT id FROM clinic_staff WHERE clinic_id = v_clinic_id AND user_id = v_doc2 LIMIT 1),
                          (SELECT id FROM clinic_staff WHERE clinic_id = v_clinic_id AND user_id = v_doc3 LIMIT 1));

  -- Performance logs (last 5 working days for each clinician)
  INSERT INTO performance_logs (clinic_id, staff_id, log_date, patients_seen, satisfaction_avg, notes)
  SELECT v_clinic_id, s.id, g.d::date,
    (random() * 12 + 8)::int,
    round((random() * 1.2 + 3.6)::numeric, 1),
    NULL
  FROM clinic_staff s
  CROSS JOIN generate_series(v_today - interval '7 days', v_today - interval '1 day', interval '1 day') AS g(d)
  WHERE s.clinic_id = v_clinic_id
    AND EXTRACT(dow FROM g.d) NOT IN (0, 6)
    AND random() > 0.2;

  RETURN v_clinic_id;
END;
$$;

GRANT EXECUTE ON FUNCTION seed_demo_clinic(uuid, text, text) TO authenticated;