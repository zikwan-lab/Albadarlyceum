import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// This endpoint sets up demo users and data
// Only use this in development/demo environments
export async function POST(request: NextRequest) {
  try {
    // Security check - only allow in development or with special key
    const isDevelopment = process.env.NODE_ENV === 'development'
    const demoKey = request.headers.get('x-demo-key')
    const validDemoKey = process.env.DEMO_SETUP_KEY || 'demo-setup-key-123'
    
    if (!isDevelopment && demoKey !== validDemoKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase is not configured. Please check your environment variables.' },
        { status: 500 }
      )
    }

    const schoolId = '550e8400-e29b-41d4-a716-446655440000'
    
    // Create demo school
    const { error: schoolError } = await supabaseAdmin
      .from('schools')
      .upsert({
        id: schoolId,
        name: 'Demo High School',
        address: '123 Education Avenue, Learning City, LC 12345',
        phone: '+1-555-DEMO',
        email: 'info@demohigh.edu',
        website: 'https://demohigh.edu'
      })
    
    if (schoolError) {
      throw new Error(`School creation failed: ${schoolError.message}`)
    }

    // Create demo subjects
    const subjects = [
      { name: 'Mathematics', code: 'MATH101', description: 'Algebra and Geometry', credits: 4 },
      { name: 'English', code: 'ENG101', description: 'Literature and Writing', credits: 4 },
      { name: 'Science', code: 'SCI101', description: 'Physics and Chemistry', credits: 4 },
      { name: 'History', code: 'HIST101', description: 'World History', credits: 3 },
      { name: 'Computer Science', code: 'CS101', description: 'Programming Basics', credits: 4 }
    ]
    
    for (const subject of subjects) {
      await supabaseAdmin
        .from('subjects')
        .upsert({ ...subject, school_id: schoolId })
    }

    // Create demo classes
    const classes = [
      { id: 'class-10a-id', name: '10-A', grade_level: '10th Grade', section: 'A' },
      { id: 'class-11b-id', name: '11-B', grade_level: '11th Grade', section: 'B' },
      { id: 'class-9c-id', name: '9-C', grade_level: '9th Grade', section: 'C' }
    ]
    
    for (const classData of classes) {
      await supabaseAdmin
        .from('classes')
        .upsert({
          ...classData,
          school_id: schoolId,
          academic_year: '2024-2025',
          max_students: 30
        })
    }

    // Demo users data
    const demoUsers = [
      {
        email: 'admin@school.com',
        password: 'admin123',
        role: 'admin' as const,
        fullName: 'Admin User',
        phone: '+1-555-0001'
      },
      {
        email: 'teacher@school.com',
        password: 'teacher123',
        role: 'teacher' as const,
        fullName: 'John Smith',
        phone: '+1-555-0002'
      },
      {
        email: 'student@school.com',
        password: 'student123',
        role: 'student' as const,
        fullName: 'Jane Doe',
        phone: '+1-555-0003'
      },
      {
        email: 'parent@school.com',
        password: 'parent123',
        role: 'parent' as const,
        fullName: 'Robert Doe',
        phone: '+1-555-0004'
      }
    ]

    const createdUsers: { [key: string]: string } = {}

    // Create users and profiles
    for (const user of demoUsers) {
      try {
        // Check if user already exists
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
        
        let userId: string

        const existingUserRecord = existingUser.users?.find(u => u.email === user.email)
        if (existingUserRecord) {
          userId = existingUserRecord.id
          console.log(`User ${user.email} already exists`)
        } else {
          // Create new user
          const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true
          })
          
          if (authError || !authData.user) {
            console.error(`Failed to create user ${user.email}:`, authError)
            continue
          }
          
          userId = authData.user.id
        }
        
        createdUsers[user.role] = userId
        
        // Create/update profile
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: userId,
            email: user.email,
            full_name: user.fullName,
            role: user.role,
            phone: user.phone
          })
        
        if (profileError) {
          console.error(`Failed to create profile for ${user.email}:`, profileError)
        }
        
      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error)
      }
    }

    // Create teacher record
    if (createdUsers.teacher) {
      await supabaseAdmin
        .from('teachers')
        .upsert({
          profile_id: createdUsers.teacher,
          school_id: schoolId,
          employee_id: 'TCH001',
          department: 'Mathematics',
          qualification: 'M.Sc. Mathematics',
          hire_date: '2023-08-01',
          address: '456 Teacher Lane, Learning City, LC 12345'
        })
    }

    // Create student record
    if (createdUsers.student) {
      await supabaseAdmin
        .from('students')
        .upsert({
          profile_id: createdUsers.student,
          school_id: schoolId,
          class_id: 'class-10a-id',
          student_id: 'STU001',
          admission_date: '2024-08-15',
          date_of_birth: '2008-05-15',
          gender: 'Female',
          address: '789 Student Street, Learning City, LC 12345',
          guardian_name: 'Robert Doe',
          guardian_phone: '+1-555-0004',
          guardian_email: 'parent@school.com'
        })
    }

    // Link parent to student
    if (createdUsers.parent && createdUsers.student) {
      const { data: studentData } = await supabaseAdmin
        .from('students')
        .select('id')
        .eq('profile_id', createdUsers.student)
        .single()
      
      if (studentData) {
        await supabaseAdmin
          .from('parent_students')
          .upsert({
            parent_id: createdUsers.parent,
            student_id: studentData.id,
            relationship: 'father',
            is_primary: true
          })
      }
    }

    // Create demo announcements
    if (createdUsers.admin) {
      const announcements = [
        {
          title: 'Welcome to Demo School!',
          content: 'Welcome to our School Management System demo. Explore all the features available for your role.',
          target_audience: 'all',
          priority: 'high'
        },
        {
          title: 'Parent Meeting Scheduled',
          content: 'Monthly parent-teacher meeting is scheduled for next Friday at 3 PM.',
          target_audience: 'parents',
          priority: 'medium'
        }
      ]
      
      for (const announcement of announcements) {
        await supabaseAdmin
          .from('announcements')
          .insert({
            ...announcement,
            school_id: schoolId,
            author_id: createdUsers.admin,
            is_published: true,
            published_at: new Date().toISOString()
          })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Demo data setup completed successfully',
      users: {
        admin: 'admin@school.com / admin123',
        teacher: 'teacher@school.com / teacher123',
        student: 'student@school.com / student123',
        parent: 'parent@school.com / parent123'
      }
    })

  } catch (error) {
    console.error('Demo setup error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to setup demo data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
