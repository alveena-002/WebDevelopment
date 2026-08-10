-- Create Students Table
CREATE TABLE students (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    age INT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert Data
INSERT INTO students (name, email, age)
VALUES
('Ali', 'ali@example.com', 21),
('Sara', 'sara@example.com', 22),
('Alveena', 'alveena@example.com', 19);

-- View All Students
SELECT * FROM students;

-- View Specific Student
SELECT * FROM students
WHERE name = 'Alveena';

-- Update Student Age
UPDATE students
SET age = 20
WHERE name = 'Alveena';

-- Delete a Student
DELETE FROM students
WHERE name = 'Ali';

-- Count Total Students
SELECT COUNT(*) AS total_students
FROM students;