-- Sample Data for School Management System
-- Run this after setting up the schema and creating your first admin user

-- Insert sample school
INSERT INTO schools (id, name, address, phone, email, website) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Greenwood High School', '123 Education Street, Learning City, LC 12345', '+1-555-0123', 'info@greenwoodhigh.edu', 'https://greenwoodhigh.edu');

-- Insert sample subjects
INSERT INTO subjects (school_id, name, code, description, credits) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Mathematics', 'MATH101', 'Basic Mathematics for Grade 9-12', 4),
('550e8400-e29b-41d4-a716-446655440000', 'English Literature', 'ENG101', 'English Language and Literature', 4),
('550e8400-e29b-41d4-a716-446655440000', 'Physics', 'PHY101', 'Introduction to Physics', 4),
('550e8400-e29b-41d4-a716-446655440000', 'Chemistry', 'CHEM101', 'Basic Chemistry Concepts', 4),
('550e8400-e29b-41d4-a716-446655440000', 'Biology', 'BIO101', 'Life Sciences and Biology', 4),
('550e8400-e29b-41d4-a716-446655440000', 'History', 'HIST101', 'World History and Civilizations', 3),
('550e8400-e29b-41d4-a716-446655440000', 'Geography', 'GEO101', 'Physical and Human Geography', 3),
('550e8400-e29b-41d4-a716-446655440000', 'Computer Science', 'CS101', 'Introduction to Programming', 4);

-- Insert sample classes
INSERT INTO classes (school_id, name, grade_level, section, academic_year, max_students) VALUES
('550e8400-e29b-41d4-a716-446655440000', '9-A', '9th Grade', 'A', '2024-2025', 30),
('550e8400-e29b-41d4-a716-446655440000', '9-B', '9th Grade', 'B', '2024-2025', 30),
('550e8400-e29b-41d4-a716-446655440000', '10-A', '10th Grade', 'A', '2024-2025', 30),
('550e8400-e29b-41d4-a716-446655440000', '10-B', '10th Grade', 'B', '2024-2025', 30),
('550e8400-e29b-41d4-a716-446655440000', '11-A', '11th Grade', 'A', '2024-2025', 25),
('550e8400-e29b-41d4-a716-446655440000', '11-B', '11th Grade', 'B', '2024-2025', 25),
('550e8400-e29b-41d4-a716-446655440000', '12-A', '12th Grade', 'A', '2024-2025', 25),
('550e8400-e29b-41d4-a716-446655440000', '12-B', '12th Grade', 'B', '2024-2025', 25);

-- Sample announcements
INSERT INTO announcements (school_id, author_id, title, content, target_audience, priority, is_published, published_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'your-admin-user-id', 'Welcome to New Academic Year', 'Welcome to the 2024-2025 academic year! We are excited to have all students back for another year of learning and growth.', 'all', 'high', true, NOW()),
('550e8400-e29b-41d4-a716-446655440000', 'your-admin-user-id', 'Parent-Teacher Meeting', 'Parent-teacher meetings are scheduled for next week. Please check your class schedule for specific times.', 'parents', 'medium', true, NOW()),
('550e8400-e29b-41d4-a716-446655440000', 'your-admin-user-id', 'Science Fair 2024', 'Annual Science Fair will be held on December 15th. All students are encouraged to participate.', 'students', 'medium', true, NOW());

-- Note: To complete the sample data, you'll need to:
-- 1. Create user accounts through the authentication system
-- 2. Get their UUIDs from the auth.users table
-- 3. Insert corresponding profiles with appropriate roles
-- 4. Insert teachers, students, and other related data using those UUIDs

-- Example of how to insert a teacher profile (after creating the user account):
-- INSERT INTO profiles (id, email, full_name, role) VALUES
-- ('teacher-user-uuid', 'john.smith@greenwoodhigh.edu', 'John Smith', 'teacher');

-- INSERT INTO teachers (profile_id, school_id, employee_id, department, qualification, hire_date) VALUES
-- ('teacher-user-uuid', '550e8400-e29b-41d4-a716-446655440000', 'TCH001', 'Mathematics', 'M.Sc. Mathematics', '2023-08-01');

-- Example of how to insert a student profile (after creating the user account):
-- INSERT INTO profiles (id, email, full_name, role) VALUES
-- ('student-user-uuid', 'jane.doe@student.greenwoodhigh.edu', 'Jane Doe', 'student');

-- INSERT INTO students (profile_id, school_id, student_id, admission_date, guardian_name, guardian_phone, guardian_email) VALUES
-- ('student-user-uuid', '550e8400-e29b-41d4-a716-446655440000', 'STU001', '2024-08-15', 'John Doe', '+1-555-0124', 'john.doe@parent.com');

-- To create demo users programmatically, you would typically:
-- 1. Use Supabase Auth API to create users
-- 2. Then insert the corresponding profile and role-specific data
-- 3. This is usually done through your application's admin interface or a seeding script

-- For testing purposes, you can manually create users through the Supabase dashboard
-- and then run the appropriate INSERT statements with their UUIDs.
