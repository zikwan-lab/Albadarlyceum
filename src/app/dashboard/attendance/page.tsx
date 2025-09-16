'use client'

import React, { useState } from 'react'

export const dynamic = 'force-dynamic'
import { useRequireAuth, useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {

  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

// Mock data - in a real app, this would come from your API
const mockAttendanceData = [
  {
    id: '1',
    studentId: 'STU001',
    studentName: 'John Doe',
    class: '10-A',
    date: '2024-01-15',
    subject: 'Mathematics',
    status: 'present',
    markedBy: 'John Smith',
    time: '09:00 AM'
  },
  {
    id: '2',
    studentId: 'STU002',
    studentName: 'Jane Smith',
    class: '10-A',
    date: '2024-01-15',
    subject: 'Mathematics',
    status: 'absent',
    markedBy: 'John Smith',
    time: '09:00 AM'
  },
  {
    id: '3',
    studentId: 'STU003',
    studentName: 'Mike Johnson',
    class: '10-A',
    date: '2024-01-15',
    subject: 'Mathematics',
    status: 'late',
    markedBy: 'John Smith',
    time: '09:15 AM'
  },
  {
    id: '4',
    studentId: 'STU001',
    studentName: 'John Doe',
    class: '10-A',
    date: '2024-01-14',
    subject: 'English',
    status: 'present',
    markedBy: 'Sarah Johnson',
    time: '10:00 AM'
  }
]

const mockClasses = [
  { id: '1', name: '10-A', students: 30 },
  { id: '2', name: '10-B', students: 28 },
  { id: '3', name: '11-A', students: 25 },
  { id: '4', name: '11-B', students: 27 }
]

const mockSubjects = [
  { id: '1', name: 'Mathematics' },
  { id: '2', name: 'English' },
  { id: '3', name: 'Science' },
  { id: '4', name: 'History' }
]

export default function AttendancePage() {
  useRequireAuth('admin')
  const { profile } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [viewMode, setViewMode] = useState<'mark' | 'reports'>('mark')

  // Filter attendance data
  const filteredAttendance = mockAttendanceData.filter(record => {
    const matchesDate = record.date === selectedDate
    const matchesClass = selectedClass === 'all' || record.class === selectedClass
    const matchesSubject = selectedSubject === 'all' || record.subject === selectedSubject
    return matchesDate && matchesClass && matchesSubject
  })

  // Calculate statistics
  const totalRecords = filteredAttendance.length
  const presentCount = filteredAttendance.filter(r => r.status === 'present').length
  const absentCount = filteredAttendance.filter(r => r.status === 'absent').length
  const lateCount = filteredAttendance.filter(r => r.status === 'late').length
  const attendancePercentage = totalRecords > 0 ? ((presentCount + lateCount) / totalRecords * 100).toFixed(1) : '0'

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'absent':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'late':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    switch (status) {
      case 'present':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'absent':
        return `${baseClasses} bg-red-100 text-red-800`
      case 'late':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Mark attendance and view attendance reports
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setViewMode('mark')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                viewMode === 'mark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Mark Attendance
            </button>
            <button
              onClick={() => setViewMode('reports')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                viewMode === 'reports'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              View Reports
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                    <dd className="text-lg font-medium text-gray-900">{totalRecords}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Present</dt>
                    <dd className="text-lg font-medium text-gray-900">{presentCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Absent</dt>
                    <dd className="text-lg font-medium text-gray-900">{absentCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Attendance %</dt>
                    <dd className="text-lg font-medium text-gray-900">{attendancePercentage}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {/* Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="all">All Classes</option>
                  {mockClasses.map(cls => (
                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="all">All Subjects</option>
                  {mockSubjects.map(subject => (
                    <option key={subject.id} value={subject.name}>{subject.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {viewMode === 'mark' ? 'Mark Attendance' : 'Attendance Records'}
            </h3>
            
            {filteredAttendance.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardDocumentCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No attendance records found for the selected filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Marked By
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAttendance.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                  {record.studentName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{record.studentName}</div>
                              <div className="text-sm text-gray-500">{record.studentId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(record.status)}
                            <span className={`ml-2 ${getStatusBadge(record.status)}`}>
                              {record.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.markedBy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
