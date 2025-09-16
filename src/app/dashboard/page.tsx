'use client'

import React from 'react'

export const dynamic = 'force-dynamic'
import { useRequireAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  AdminDashboard,
  TeacherDashboard,
  StudentDashboard,
  ParentDashboard,
} from '@/components/dashboard/RoleSpecificDashboards'



export default function DashboardPage() {
  const { profile } = useRequireAuth()

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Role-specific dashboard content
  const renderRoleSpecificContent = () => {
    switch (profile.role) {
      case 'admin':
        return <AdminDashboard />
      case 'teacher':
        return <TeacherDashboard />
      case 'student':
        return <StudentDashboard />
      case 'parent':
        return <ParentDashboard />
      default:
        return <AdminDashboard /> // Default fallback
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-blue-100 capitalize">
            {profile.role} Dashboard - Here&apos;s what&apos;s happening at your school today.
          </p>
        </div>

        {/* Role-specific content */}
        {renderRoleSpecificContent()}
      </div>
    </DashboardLayout>
  )
}
