'use client'

import React, { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRequireAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { supabase } from '@/lib/supabase'
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  totalSubjects: number
  attendanceRate: number
  completedLectures: number
  scheduledLectures: number
  activeAnnouncements: number
}

interface AttendanceTrend {
  date: string
  rate: number
}

interface SubjectPerformance {
  subject: string
  attendance: number
  students: number
}

export default function AnalyticsPage() {
  const { profile } = useRequireAuth(['admin', 'teacher'])
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalSubjects: 0,
    attendanceRate: 0,
    completedLectures: 0,
    scheduledLectures: 0,
    activeAnnouncements: 0,
  })
  const [attendanceTrend, setAttendanceTrend] = useState<AttendanceTrend[]>([])
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('7days')

  useEffect(() => {
    fetchAnalytics()
  }, [selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Fetch basic counts
      const [
        studentsResult,
        teachersResult,
        classesResult,
        subjectsResult,
        lecturesResult,
        announcementsResult
      ] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact' }),
        supabase.from('teachers').select('id', { count: 'exact' }),
        supabase.from('classes').select('id', { count: 'exact' }),
        supabase.from('subjects').select('id', { count: 'exact' }),
        supabase.from('lectures').select('id, status', { count: 'exact' }),
        supabase.from('announcements').select('id', { count: 'exact' })
      ])

      // Calculate analytics
      const totalStudents = studentsResult.count || 0
      const totalTeachers = teachersResult.count || 0
      const totalClasses = classesResult.count || 0
      const totalSubjects = subjectsResult.count || 0
      const activeAnnouncements = announcementsResult.count || 0

      const lectures = lecturesResult.data || []
      const completedLectures = lectures.filter(l => l.status === 'completed').length
      const scheduledLectures = lectures.filter(l => l.status === 'scheduled').length

      // Mock attendance rate calculation (in real app, calculate from attendance table)
      const attendanceRate = 94.2

      // Mock attendance trend data
      const mockAttendanceTrend = generateMockAttendanceTrend(selectedPeriod)
      
      // Mock subject performance data
      const mockSubjectPerformance = [
        { subject: 'Mathematics', attendance: 96.5, students: 120 },
        { subject: 'English', attendance: 94.2, students: 115 },
        { subject: 'Science', attendance: 91.8, students: 108 },
        { subject: 'History', attendance: 89.3, students: 95 },
        { subject: 'Physics', attendance: 87.6, students: 85 },
      ]

      setAnalytics({
        totalStudents,
        totalTeachers,
        totalClasses,
        totalSubjects,
        attendanceRate,
        completedLectures,
        scheduledLectures,
        activeAnnouncements,
      })
      
      setAttendanceTrend(mockAttendanceTrend)
      setSubjectPerformance(mockSubjectPerformance)

    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockAttendanceTrend = (period: string): AttendanceTrend[] => {
    const days = period === '7days' ? 7 : period === '30days' ? 30 : 90
    const trend: AttendanceTrend[] = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Generate realistic attendance rate with some variation
      const baseRate = 94
      const variation = (Math.random() - 0.5) * 10
      const rate = Math.max(80, Math.min(100, baseRate + variation))
      
      trend.push({
        date: date.toISOString().split('T')[0],
        rate: Math.round(rate * 10) / 10
      })
    }
    
    return trend
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 90) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAttendanceBg = (rate: number) => {
    if (rate >= 95) return 'bg-green-100'
    if (rate >= 90) return 'bg-yellow-100'
    return 'bg-red-100'
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              {profile?.role === 'admin' 
                ? 'School-wide performance metrics and insights'
                : 'Teaching performance and class analytics'
              }
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.totalStudents.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+5.2% from last month</span>
                </div>
              </div>
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.totalTeachers}</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+2 new this month</span>
                </div>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.attendanceRate}%</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">-1.2% from last week</span>
                </div>
              </div>
              <ClipboardDocumentCheckIcon className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Completed Lectures</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.completedLectures}</p>
                <div className="flex items-center mt-2">
                  <CalendarDaysIcon className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-gray-600">{analytics.scheduledLectures} scheduled</span>
                </div>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Attendance Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Attendance Trend</h3>
            <ChartBarIcon className="h-6 w-6 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {/* Simple chart representation */}
            <div className="flex items-end space-x-2 h-32">
              {attendanceTrend.map((data, index) => (
                <div key={data.date} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${data.rate}%` }}
                    title={`${formatDate(data.date)}: ${data.rate}%`}
                  />
                  <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-left">
                    {formatDate(data.date)}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Chart legend */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>80%</span>
              <span>90%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Subject Performance</h3>
            <div className="space-y-4">
              {subjectPerformance.map((subject) => (
                <div key={subject.subject} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                      <span className={`text-sm font-medium ${getAttendanceColor(subject.attendance)}`}>
                        {subject.attendance}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${subject.attendance}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{subject.students} students</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Alerts & Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Low Attendance Alert</p>
                  <p className="text-sm text-yellow-700">Physics class attendance dropped below 90%</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Improvement Noted</p>
                  <p className="text-sm text-blue-700">Mathematics attendance increased by 3% this week</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <AcademicCapIcon className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">High Performance</p>
                  <p className="text-sm text-green-700">English class maintains excellent 96.5% attendance</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <CalendarDaysIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Schedule Update</p>
                  <p className="text-sm text-gray-700">{analytics.scheduledLectures} lectures scheduled for next week</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.totalClasses}</div>
            <div className="text-sm font-medium text-gray-600">Total Classes</div>
            <div className="text-xs text-gray-500 mt-1">Across all grades</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{analytics.totalSubjects}</div>
            <div className="text-sm font-medium text-gray-600">Subjects Offered</div>
            <div className="text-xs text-gray-500 mt-1">In curriculum</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{analytics.activeAnnouncements}</div>
            <div className="text-sm font-medium text-gray-600">Active Announcements</div>
            <div className="text-xs text-gray-500 mt-1">Published this month</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
