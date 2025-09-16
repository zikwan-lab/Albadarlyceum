-- School Management System Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student', 'parent');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE lecture_status AS ENUM ('scheduled', 'ongoing', 'completed', 'cancelled');
CREATE TYPE announcement_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE announcement_audience AS ENUM ('all', 'students', 'teachers', 'parents', 'specific_class');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schools table
CREATE TABLE schools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects table
CREATE TABLE subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    credits INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(school_id, code)
);

-- Classes table
CREATE TABLE classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    section TEXT,
    academic_year TEXT NOT NULL,
    teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    max_students INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teachers table
CREATE TABLE teachers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL,
    department TEXT,
    qualification TEXT,
    experience_years INTEGER,
    salary DECIMAL(10,2),
    hire_date DATE NOT NULL,
    address TEXT,
    emergency_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(school_id, employee_id)
);

-- Students table
CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    student_id TEXT NOT NULL,
    admission_date DATE NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    address TEXT,
    guardian_name TEXT,
    guardian_phone TEXT,
    guardian_email TEXT,
    emergency_contact TEXT,
    medical_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(school_id, student_id)
);

-- Lectures table
CREATE TABLE lectures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room TEXT,
    status lecture_status DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance table
CREATE TABLE attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, class_id, subject_id, date)
);

-- Announcements table
CREATE TABLE announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_audience announcement_audience DEFAULT 'all',
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    priority announcement_priority DEFAULT 'medium',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teacher-Subject assignments
CREATE TABLE teacher_subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(teacher_id, subject_id, class_id, academic_year)
);

-- Parent-Student relationships
CREATE TABLE parent_students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL, -- 'father', 'mother', 'guardian', etc.
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(parent_id, student_id)
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_teachers_school_id ON teachers(school_id);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_attendance_class_date ON attendance(class_id, date);
CREATE INDEX idx_lectures_class_date ON lectures(class_id, scheduled_date);
CREATE INDEX idx_announcements_school_published ON announcements(school_id, is_published);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lectures_updated_at BEFORE UPDATE ON lectures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert profiles" ON profiles FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Schools policies (Admin only)
CREATE POLICY "Admins can manage schools" ON schools FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Students policies
CREATE POLICY "Students can view their own data" ON students FOR SELECT USING (
    profile_id = auth.uid()
);
CREATE POLICY "Teachers can view students in their school" ON students FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM teachers t
        JOIN profiles p ON t.profile_id = p.id
        WHERE p.id = auth.uid() AND t.school_id = students.school_id
    )
);
CREATE POLICY "Parents can view their children" ON students FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM parent_students ps
        WHERE ps.parent_id = auth.uid() AND ps.student_id = students.id
    )
);
CREATE POLICY "Admins can manage students" ON students FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Teachers policies
CREATE POLICY "Teachers can view their own data" ON teachers FOR SELECT USING (
    profile_id = auth.uid()
);
CREATE POLICY "Teachers can view colleagues in same school" ON teachers FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM teachers t
        WHERE t.profile_id = auth.uid() AND t.school_id = teachers.school_id
    )
);
CREATE POLICY "Admins can manage teachers" ON teachers FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Attendance policies
CREATE POLICY "Students can view their own attendance" ON attendance FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM students s
        WHERE s.id = attendance.student_id AND s.profile_id = auth.uid()
    )
);
CREATE POLICY "Teachers can manage attendance for their classes" ON attendance FOR ALL USING (
    EXISTS (
        SELECT 1 FROM teachers t
        WHERE t.id = attendance.teacher_id AND t.profile_id = auth.uid()
    )
);
CREATE POLICY "Parents can view their children's attendance" ON attendance FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM students s
        JOIN parent_students ps ON s.id = ps.student_id
        WHERE s.id = attendance.student_id AND ps.parent_id = auth.uid()
    )
);
CREATE POLICY "Admins can manage all attendance" ON attendance FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Lectures policies
CREATE POLICY "Students can view lectures for their class" ON lectures FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM students s
        WHERE s.class_id = lectures.class_id AND s.profile_id = auth.uid()
    )
);
CREATE POLICY "Teachers can manage their own lectures" ON lectures FOR ALL USING (
    EXISTS (
        SELECT 1 FROM teachers t
        WHERE t.id = lectures.teacher_id AND t.profile_id = auth.uid()
    )
);
CREATE POLICY "Teachers can view lectures in their school" ON lectures FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM teachers t
        WHERE t.profile_id = auth.uid() AND t.school_id = lectures.school_id
    )
);
CREATE POLICY "Admins can manage all lectures" ON lectures FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Announcements policies
CREATE POLICY "Everyone can view published announcements" ON announcements FOR SELECT USING (
    is_published = true AND (expires_at IS NULL OR expires_at > NOW())
);
CREATE POLICY "Teachers and admins can manage announcements" ON announcements FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
);

-- Insert default admin user (run after creating your first user)
-- UPDATE: This should be done manually after user signup
