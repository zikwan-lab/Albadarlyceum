'use client'

import React, { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRequireAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { supabase } from '@/lib/supabase'
import {
  UserCircleIcon,
  PencilIcon,
  CameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  IdentificationIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

interface ProfileData {
  id: string
  email: string
  full_name: string | null
  role: string
  avatar_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

interface RoleSpecificData {
  student?: {
    student_id: string
    admission_date: string
    date_of_birth: string | null
    gender: string | null
    address: string | null
    guardian_name: string | null
    guardian_phone: string | null
    guardian_email: string | null
    class?: { name: string; grade_level: string }
  }
  teacher?: {
    employee_id: string
    department: string | null
    qualification: string | null
    experience_years: number | null
    hire_date: string
    address: string | null
  }
}

export default function ProfilePage() {
  const { profile: authProfile } = useRequireAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [roleData, setRoleData] = useState<RoleSpecificData>({})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (authProfile) {
      fetchProfileData()
    }
  }, [authProfile])

  const fetchProfileData = async () => {
    try {
      if (!authProfile?.id) return

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authProfile.id)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        return
      }

      setProfile(profileData)
      setFormData(profileData)

      // Fetch role-specific data
      if (authProfile.role === 'student') {
        const { data: studentData } = await supabase
          .from('students')
          .select(`
            *,
            classes(name, grade_level)
          `)
          .eq('profile_id', authProfile.id)
          .single()

        if (studentData) {
          setRoleData({ student: studentData })
        }
      } else if (authProfile.role === 'teacher') {
        const { data: teacherData } = await supabase
          .from('teachers')
          .select('*')
          .eq('profile_id', authProfile.id)
          .single()

        if (teacherData) {
          setRoleData({ teacher: teacherData })
        }
      }

    } catch (error) {
      console.error('Error fetching profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      if (!profile?.id) return

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

      if (error) {
        console.error('Error updating profile:', error)
        return
      }

      // Refresh profile data
      await fetchProfileData()
      setEditing(false)
      
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const calculateAge = (birthDate: string) => {
    try {
      const today = new Date()
      const birth = new Date(birthDate)
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      
      return age
    } catch {
      return null
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Profile not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your personal information and account settings
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            {editing ? (
              <div className="space-x-3">
                <button
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div className="px-6 pb-6">
            <div className="flex items-start -mt-16 mb-6">
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center">
                    <UserCircleIcon className="h-16 w-16 text-gray-600" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700">
                  <CameraIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="ml-6 flex-1 pt-8">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.full_name || 'No name set'}
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                    {profile.role}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{profile.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Member since {formatDate(profile.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.full_name || ''}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <UserCircleIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{profile.full_name || 'Not set'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{profile.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{profile.phone || 'Not set'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="flex items-center">
                  <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900 capitalize">{profile.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Role-Specific Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {profile.role === 'student' ? 'Student Information' :
               profile.role === 'teacher' ? 'Teaching Information' :
               profile.role === 'parent' ? 'Parent Information' :
               'Additional Information'}
            </h3>

            {/* Student specific data */}
            {profile.role === 'student' && roleData.student && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID
                  </label>
                  <div className="flex items-center">
                    <IdentificationIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{roleData.student.student_id}</span>
                  </div>
                </div>

                {roleData.student.class && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class
                    </label>
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {roleData.student.class.name} ({roleData.student.class.grade_level})
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admission Date
                  </label>
                  <div className="flex items-center">
                    <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{formatDate(roleData.student.admission_date)}</span>
                  </div>
                </div>

                {roleData.student.date_of_birth && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {formatDate(roleData.student.date_of_birth)}
                        {calculateAge(roleData.student.date_of_birth) && (
                          <span className="text-gray-500 ml-2">
                            ({calculateAge(roleData.student.date_of_birth)} years old)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {roleData.student.guardian_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Information
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <UserCircleIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{roleData.student.guardian_name}</span>
                      </div>
                      {roleData.student.guardian_phone && (
                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{roleData.student.guardian_phone}</span>
                        </div>
                      )}
                      {roleData.student.guardian_email && (
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{roleData.student.guardian_email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Teacher specific data */}
            {profile.role === 'teacher' && roleData.teacher && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <div className="flex items-center">
                    <IdentificationIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{roleData.teacher.employee_id}</span>
                  </div>
                </div>

                {roleData.teacher.department && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{roleData.teacher.department}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hire Date
                  </label>
                  <div className="flex items-center">
                    <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{formatDate(roleData.teacher.hire_date)}</span>
                  </div>
                </div>

                {roleData.teacher.qualification && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification
                    </label>
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{roleData.teacher.qualification}</span>
                    </div>
                  </div>
                )}

                {roleData.teacher.experience_years && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {roleData.teacher.experience_years} {roleData.teacher.experience_years === 1 ? 'year' : 'years'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* For admin and parent roles without specific data */}
            {(profile.role === 'admin' || profile.role === 'parent') && (
              <div className="text-center py-8">
                <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {profile.role === 'admin' ? 'Administrator Account' : 'Parent Account'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {profile.role === 'admin' 
                    ? 'Full access to school management system'
                    : 'Monitor your child\'s academic progress'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Address Information (if available) */}
        {(roleData.student?.address || roleData.teacher?.address) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
            <div className="flex items-start">
              <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 mt-1" />
              <span className="text-gray-900">
                {roleData.student?.address || roleData.teacher?.address}
              </span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
