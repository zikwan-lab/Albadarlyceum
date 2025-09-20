'use client'

import React, { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRequireAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { supabase } from '@/lib/supabase'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface Lecture {
  id: string
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
  // Joined data
  classes?: { name: string; grade_level: string }
  subjects?: { name: string; code: string }
  teachers?: { profiles: { full_name: string } }
}

export default function LecturesPage() {
  const { profile } = useRequireAuth()
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDate, setSelectedDate] = useState('today')

  useEffect(() => {
    fetchLectures()
  }, [])

  const fetchLectures = async () => {
    try {
      const { data, error } = await supabase
        .from('lectures')
        .select(`
          *,
          classes(name, grade_level),
          subjects(name, code),
          teachers!inner(profiles!inner(full_name))
        `)
        .order('scheduled_date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) {
        console.error('Error fetching lectures:', error)
        return
      }

      setLectures(data || [])
    } catch (error) {
      console.error('Error fetching lectures:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDateFilter = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const week = new Date(today)
    week.setDate(week.getDate() + 7)

    switch (selectedDate) {
      case 'today':
        return lectures.filter(l => new Date(l.scheduled_date).toDateString() === today.toDateString())
      case 'tomorrow':
        return lectures.filter(l => new Date(l.scheduled_date).toDateString() === tomorrow.toDateString())
      case 'this_week':
        return lectures.filter(l => new Date(l.scheduled_date) >= today && new Date(l.scheduled_date) <= week)
      default:
        return lectures
    }
  }

  const filteredLectures = getDateFilter().filter(lecture => {
    const matchesSearch = lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lecture.subjects?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lecture.classes?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lecture.room?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || lecture.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <ClockIcon className="h-4 w-4" />
      case 'ongoing':
        return <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse" />
      case 'completed':
        return <div className="h-4 w-4 bg-gray-500 rounded-full" />
      case 'cancelled':
        return <div className="h-4 w-4 bg-red-500 rounded-full" />
      default:
        return <ClockIcon className="h-4 w-4" />
    }
  }

  const formatTime = (time: string) => {
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return time
    }
  }

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return date
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.role === 'student' ? 'My Lectures' : 
               profile?.role === 'teacher' ? 'My Teaching Schedule' : 
               profile?.role === 'parent' ? "Child's Lectures" : 'Lectures Schedule'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {profile?.role === 'student' ? 'View your class schedule and upcoming lectures' :
               profile?.role === 'teacher' ? 'Manage your teaching schedule and lectures' :
               profile?.role === 'parent' ? "Track your child's academic schedule" :
               'Manage school lecture schedules and timetables'}
            </p>
          </div>
          {(profile?.role === 'admin' || profile?.role === 'teacher') && (
            <div className="mt-4 sm:mt-0">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <PlusIcon className="h-4 w-4 mr-2" />
                Schedule Lecture
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Today's Lectures</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {lectures.filter(l => new Date(l.scheduled_date).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {lectures.filter(l => {
                    const lectureDate = new Date(l.scheduled_date)
                    const today = new Date()
                    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                    return lectureDate >= today && lectureDate <= weekFromNow
                  }).length}
                </p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {lectures.filter(l => l.status === 'completed').length}
                </p>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Ongoing</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {lectures.filter(l => l.status === 'ongoing').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
                <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search lectures..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this_week">This Week</option>
              </select>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Lectures List */}
        {filteredLectures.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No lectures found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {lectures.length === 0 ? 'No lectures have been scheduled yet.' : 'Try adjusting your search filters.'}
            </p>
            {(profile?.role === 'admin' || profile?.role === 'teacher') && lectures.length === 0 && (
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Schedule First Lecture
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLectures.map((lecture) => (
              <div key={lecture.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{lecture.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lecture.status)}`}>
                        <span className="mr-1">{getStatusIcon(lecture.status)}</span>
                        {lecture.status.charAt(0).toUpperCase() + lecture.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{formatDate(lecture.scheduled_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{formatTime(lecture.start_time)} - {formatTime(lecture.end_time)}</span>
                      </div>
                      {lecture.room && (
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{lecture.room}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{lecture.classes?.name || 'Unknown Class'}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center space-x-6 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Subject:</span>
                        <span className="ml-1 text-gray-600">
                          {lecture.subjects?.name || 'Unknown Subject'} ({lecture.subjects?.code || 'N/A'})
                        </span>
                      </div>
                      {lecture.teachers?.profiles && (
                        <div>
                          <span className="font-medium text-gray-900">Teacher:</span>
                          <span className="ml-1 text-gray-600">{lecture.teachers.profiles.full_name}</span>
                        </div>
                      )}
                    </div>

                    {lecture.description && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">{lecture.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions Menu */}
                  <Menu as="div" className="relative ml-4">
                    <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } block w-full text-left px-4 py-2 text-sm`}
                              >
                                View Details
                              </button>
                            )}
                          </Menu.Item>
                          {(profile?.role === 'admin' || profile?.role === 'teacher') && (
                            <>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block w-full text-left px-4 py-2 text-sm`}
                                  >
                                    Edit Lecture
                                  </button>
                                )}
                              </Menu.Item>
                              {lecture.status === 'scheduled' && (
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } block w-full text-left px-4 py-2 text-sm`}
                                    >
                                      Start Lecture
                                    </button>
                                  )}
                                </Menu.Item>
                              )}
                              {lecture.status === 'ongoing' && (
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } block w-full text-left px-4 py-2 text-sm`}
                                    >
                                      End Lecture
                                    </button>
                                  )}
                                </Menu.Item>
                              )}
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active ? 'bg-gray-100 text-red-900' : 'text-red-700'
                                    } block w-full text-left px-4 py-2 text-sm`}
                                  >
                                    Cancel Lecture
                                  </button>
                                )}
                              </Menu.Item>
                            </>
                          )}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
