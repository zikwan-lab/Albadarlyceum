-- Additional Schema: System Settings Table
-- Run this in your Supabase SQL editor to complete the schema

-- System Settings table for the Settings dashboard page
CREATE TABLE system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    
    -- School Configuration
    school_name TEXT,
    school_email TEXT,
    school_phone TEXT,
    school_address TEXT,
    academic_year TEXT DEFAULT '2024-2025',
    
    -- Academic Settings
    attendance_threshold INTEGER DEFAULT 75,
    
    -- Notification Settings
    notification_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    
    -- System Settings
    auto_backup BOOLEAN DEFAULT true,
    maintenance_mode BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure only one settings record per school
    UNIQUE(school_id)
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for system_settings
CREATE POLICY "Admins can manage system settings" ON system_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Add updated_at trigger
CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_system_settings_school_id ON system_settings(school_id);

-- Insert default settings (optional - run only if you want default values)
-- Replace 'your-school-id-here' with an actual school UUID
/*
INSERT INTO system_settings (
    school_id,
    school_name,
    school_email,
    school_phone,
    school_address,
    academic_year,
    attendance_threshold,
    notification_enabled,
    email_notifications,
    sms_notifications,
    auto_backup,
    maintenance_mode
) VALUES (
    'your-school-id-here',  -- Replace with actual school ID
    'Albadarlyceum',
    'admin@albadarlyceum.com',
    '+1 (555) 000-0000',
    '123 Education Street, Learning City, 12345',
    '2024-2025',
    75,
    true,
    true,
    false,
    true,
    false
);
*/
