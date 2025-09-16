import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.includes('supabase.co') &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('example')
  )
}

// For client-side operations
export const supabase = supabaseUrl && supabaseAnonKey
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null

// For server-side operations (admin)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'teacher' | 'student' | 'parent'
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role: 'admin' | 'teacher' | 'student' | 'parent'
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'teacher' | 'student' | 'parent'
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          website: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          school_id: string
          name: string
          grade_level: string
          section: string | null
          academic_year: string
          teacher_id: string | null
          max_students: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          grade_level: string
          section?: string | null
          academic_year: string
          teacher_id?: string | null
          max_students?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          grade_level?: string
          section?: string | null
          academic_year?: string
          teacher_id?: string | null
          max_students?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          school_id: string
          name: string
          code: string
          description: string | null
          credits: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          code: string
          description?: string | null
          credits?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          code?: string
          description?: string | null
          credits?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          profile_id: string
          school_id: string
          class_id: string | null
          student_id: string
          admission_date: string
          date_of_birth: string | null
          gender: string | null
          address: string | null
          guardian_name: string | null
          guardian_phone: string | null
          guardian_email: string | null
          emergency_contact: string | null
          medical_info: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          school_id: string
          class_id?: string | null
          student_id: string
          admission_date: string
          date_of_birth?: string | null
          gender?: string | null
          address?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          guardian_email?: string | null
          emergency_contact?: string | null
          medical_info?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          school_id?: string
          class_id?: string | null
          student_id?: string
          admission_date?: string
          date_of_birth?: string | null
          gender?: string | null
          address?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          guardian_email?: string | null
          emergency_contact?: string | null
          medical_info?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teachers: {
        Row: {
          id: string
          profile_id: string
          school_id: string
          employee_id: string
          department: string | null
          qualification: string | null
          experience_years: number | null
          salary: number | null
          hire_date: string
          address: string | null
          emergency_contact: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          school_id: string
          employee_id: string
          department?: string | null
          qualification?: string | null
          experience_years?: number | null
          salary?: number | null
          hire_date: string
          address?: string | null
          emergency_contact?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          school_id?: string
          employee_id?: string
          department?: string | null
          qualification?: string | null
          experience_years?: number | null
          salary?: number | null
          hire_date?: string
          address?: string | null
          emergency_contact?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          class_id: string
          subject_id: string | null
          teacher_id: string
          date: string
          status: 'present' | 'absent' | 'late' | 'excused'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          class_id: string
          subject_id?: string | null
          teacher_id: string
          date: string
          status: 'present' | 'absent' | 'late' | 'excused'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          class_id?: string
          subject_id?: string | null
          teacher_id?: string
          date?: string
          status?: 'present' | 'absent' | 'late' | 'excused'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lectures: {
        Row: {
          id: string
          school_id: string
          class_id: string
          subject_id: string
          teacher_id: string
          title: string
          description: string | null
          scheduled_date: string
          start_time: string
          end_time: string
          room: string | null
          status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          class_id: string
          subject_id: string
          teacher_id: string
          title: string
          description?: string | null
          scheduled_date: string
          start_time: string
          end_time: string
          room?: string | null
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          class_id?: string
          subject_id?: string
          teacher_id?: string
          title?: string
          description?: string | null
          scheduled_date?: string
          start_time?: string
          end_time?: string
          room?: string | null
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          school_id: string
          author_id: string
          title: string
          content: string
          target_audience: 'all' | 'students' | 'teachers' | 'parents' | 'specific_class'
          class_id: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          is_published: boolean
          published_at: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          author_id: string
          title: string
          content: string
          target_audience?: 'all' | 'students' | 'teachers' | 'parents' | 'specific_class'
          class_id?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          is_published?: boolean
          published_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          author_id?: string
          title?: string
          content?: string
          target_audience?: 'all' | 'students' | 'teachers' | 'parents' | 'specific_class'
          class_id?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          is_published?: boolean
          published_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
