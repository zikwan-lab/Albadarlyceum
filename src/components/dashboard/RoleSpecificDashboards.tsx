'use client'

import React from 'react'
import Link from 'next/link'
import {
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  SpeakerWaveIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

// Admin Dashboard Component
export function AdminDashboard() {
  const adminStats = [
    { name: 'Total Students', value: '1,247', icon: UserGroupIcon, color: 'bg-blue-500', change: '+12%' },
    { name: 'Total Teachers', value: '89', icon: AcademicCapIcon, color: 'bg-green-500', change: '+3%' },
    { name: 'Total Classes', value: '42', icon: BookOpenIcon, color: 'bg-purple-500', change: '+5%' },
    { name: 'Today&apos;s Attendance', value: '94.2%', icon: ClipboardDocumentCheckIcon, color: 'bg-yellow-500', change: '+2.1%' },
  ]

  const recentActivities = [
    { id: 1, message: 'New teacher John Smith added to Mathematics department', time: '5 minutes ago' },
    { id: 2, message: 'Class 10-A attendance marked - 28/30 present', time: '15 minutes ago' },
    { id: 3, message: 'Parent-Teacher meeting announcement published', time: '1 hour ago' },
    { id: 4, message: 'New student Sarah Johnson enrolled in Class 9-C', time: '2 hours ago' },
  ]

  return (
    <div className="space-y-6">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="ml-2 text-sm font-medium text-green-600">{stat.change}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/students" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <UserGroupIcon className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Manage Students</span>
          </Link>
          <Link href="/dashboard/teachers" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AcademicCapIcon className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Manage Teachers</span>
          </Link>
          <Link href="/dashboard/attendance" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ClipboardDocumentCheckIcon className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">View Attendance</span>
          </Link>
          <Link href="/dashboard/announcements" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <SpeakerWaveIcon className="h-8 w-8 text-red-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Announcements</span>
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent System Activities</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Teacher Dashboard Component
export function TeacherDashboard() {
  const teacherStats = [
    { name: 'My Classes', value: '5', icon: BookOpenIcon, color: 'bg-blue-500' },
    { name: 'Total Students', value: '142', icon: UserGroupIcon, color: 'bg-green-500' },
    { name: 'Today&apos;s Lectures', value: '6', icon: CalendarDaysIcon, color: 'bg-purple-500' },
    { name: 'Pending Attendance', value: '2', icon: ClipboardDocumentCheckIcon, color: 'bg-yellow-500' },
  ]

  const todaySchedule = [
    { id: 1, subject: 'Mathematics', class: '10-A', time: '09:00 AM', room: 'Room 101', status: 'completed' },
    { id: 2, subject: 'Mathematics', class: '10-B', time: '10:30 AM', room: 'Room 101', status: 'current' },
    { id: 3, subject: 'Algebra', class: '11-A', time: '02:00 PM', room: 'Room 101', status: 'upcoming' },
  ]

  return (
    <div className="space-y-6">
      {/* Teacher Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teacherStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Today&apos;s Schedule</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {todaySchedule.map((lecture) => (
              <div key={lecture.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`h-3 w-3 rounded-full ${
                    lecture.status === 'completed' ? 'bg-green-500' :
                    lecture.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lecture.subject} - {lecture.class}</p>
                    <p className="text-xs text-gray-500">{lecture.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{lecture.time}</p>
                  <p className="text-xs text-gray-500 capitalize">{lecture.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teacher Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/dashboard/attendance" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ClipboardDocumentCheckIcon className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Mark Attendance</span>
          </Link>
          <Link href="/dashboard/lectures" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CalendarDaysIcon className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">My Lectures</span>
          </Link>
          <Link href="/dashboard/announcements" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <SpeakerWaveIcon className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Post Announcement</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Student Dashboard Component
export function StudentDashboard() {
  const studentStats = [
    { name: 'My Attendance', value: '92.5%', icon: ClipboardDocumentCheckIcon, color: 'bg-green-500' },
    { name: 'Today&apos;s Classes', value: '6', icon: CalendarDaysIcon, color: 'bg-blue-500' },
    { name: 'Assignments Due', value: '3', icon: BookOpenIcon, color: 'bg-yellow-500' },
    { name: 'Announcements', value: '2', icon: SpeakerWaveIcon, color: 'bg-purple-500' },
  ]

  const todayClasses = [
    { id: 1, subject: 'Mathematics', teacher: 'John Smith', time: '09:00 AM', room: 'Room 101' },
    { id: 2, subject: 'Physics', teacher: 'Dr. Wilson', time: '10:30 AM', room: 'Lab 1' },
    { id: 3, subject: 'English', teacher: 'Mary Johnson', time: '02:00 PM', room: 'Room 205' },
  ]

  return (
    <div className="space-y-6">
      {/* Student Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Classes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Today&apos;s Classes</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {todayClasses.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{cls.subject}</p>
                  <p className="text-xs text-gray-500">{cls.teacher} • {cls.room}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{cls.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/dashboard/attendance" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ClipboardDocumentCheckIcon className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">My Attendance</span>
          </Link>
          <Link href="/dashboard/lectures" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CalendarDaysIcon className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Timetable</span>
          </Link>
          <Link href="/dashboard/announcements" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <SpeakerWaveIcon className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Announcements</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Parent Dashboard Component
export function ParentDashboard() {
  const parentStats = [
    { name: 'Child&apos;s Attendance', value: '89.2%', icon: ClipboardDocumentCheckIcon, color: 'bg-blue-500' },
    { name: 'Upcoming Events', value: '4', icon: CalendarDaysIcon, color: 'bg-green-500' },
    { name: 'New Announcements', value: '2', icon: SpeakerWaveIcon, color: 'bg-purple-500' },
    { name: 'Messages', value: '1', icon: ExclamationTriangleIcon, color: 'bg-yellow-500' },
  ]

  const childProgress = [
    { subject: 'Mathematics', attendance: '95%', status: 'excellent' },
    { subject: 'English', attendance: '88%', status: 'good' },
    { subject: 'Science', attendance: '82%', status: 'needs_attention' },
  ]

  return (
    <div className="space-y-6">
      {/* Parent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {parentStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Child Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Child&apos;s Progress</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {childProgress.map((subject) => (
              <div key={subject.subject} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{subject.subject}</p>
                  <p className="text-xs text-gray-500">Attendance: {subject.attendance}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    subject.status === 'excellent' ? 'bg-green-100 text-green-800' :
                    subject.status === 'good' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subject.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parent Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/dashboard/attendance" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ClipboardDocumentCheckIcon className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Attendance Report</span>
          </Link>
          <Link href="/dashboard/announcements" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <SpeakerWaveIcon className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">School Updates</span>
          </Link>
          <Link href="/dashboard/lectures" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CalendarDaysIcon className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Timetable</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
