'use client'

import React, { useState } from 'react'

export const dynamic = 'force-dynamic'
import { useRequireAuth, useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  PlusIcon,
  SpeakerWaveIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  CalendarDaysIcon,

  EyeIcon,
} from '@heroicons/react/24/outline'

// Mock data - in a real app, this would come from your API
const mockAnnouncements = [
  {
    id: '1',
    title: 'Welcome to New Academic Year 2024-25',
    content: 'We are excited to welcome all students and parents to the new academic year. Classes will begin on January 15th, 2024.',
    author: 'Admin User',
    targetAudience: 'all',
    priority: 'high',
    isPublished: true,
    publishedAt: '2024-01-10T09:00:00Z',
    createdAt: '2024-01-10T08:30:00Z',
    views: 245
  },
  {
    id: '2',
    title: 'Parent-Teacher Meeting Scheduled',
    content: 'Monthly parent-teacher meeting is scheduled for January 20th, 2024 at 3:00 PM in the school auditorium.',
    author: 'John Smith',
    targetAudience: 'parents',
    priority: 'medium',
    isPublished: true,
    publishedAt: '2024-01-12T10:00:00Z',
    createdAt: '2024-01-12T09:45:00Z',
    views: 89
  },
  {
    id: '3',
    title: 'Mathematics Olympiad Registration Open',
    content: 'Registration for the annual Mathematics Olympiad is now open. Students interested in participating should contact their math teachers.',
    author: 'Sarah Johnson',
    targetAudience: 'students',
    priority: 'medium',
    isPublished: true,
    publishedAt: '2024-01-13T11:00:00Z',
    createdAt: '2024-01-13T10:30:00Z',
    views: 156
  },
  {
    id: '4',
    title: 'School Closure Due to Weather',
    content: 'Due to severe weather conditions, the school will remain closed tomorrow (January 16th). Online classes will be conducted as per schedule.',
    author: 'Admin User',
    targetAudience: 'all',
    priority: 'urgent',
    isPublished: true,
    publishedAt: '2024-01-15T16:00:00Z',
    createdAt: '2024-01-15T15:45:00Z',
    views: 312
  },
  {
    id: '5',
    title: 'Science Fair 2024 - Call for Participation',
    content: 'The annual Science Fair will be held on February 15th, 2024. Students are encouraged to participate and showcase their innovative projects.',
    author: 'Michael Brown',
    targetAudience: 'students',
    priority: 'low',
    isPublished: false,
    publishedAt: null,
    createdAt: '2024-01-14T14:00:00Z',
    views: 0
  }
]

export default function AnnouncementsPage() {
  useRequireAuth('admin')
  const { profile } = useAuth()
  const [selectedAudience, setSelectedAudience] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')


  // Filter announcements
  const filteredAnnouncements = mockAnnouncements.filter(announcement => {
    const matchesAudience = selectedAudience === 'all' || announcement.targetAudience === selectedAudience
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority
    return matchesAudience && matchesPriority
  })

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'high':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
      case 'medium':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />
      case 'low':
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    switch (priority) {
      case 'urgent':
        return `${baseClasses} bg-red-100 text-red-800`
      case 'high':
        return `${baseClasses} bg-orange-100 text-orange-800`
      case 'medium':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'low':
        return `${baseClasses} bg-gray-100 text-gray-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getAudienceBadge = (audience: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    switch (audience) {
      case 'all':
        return `${baseClasses} bg-purple-100 text-purple-800`
      case 'students':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'parents':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'teachers':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate statistics
  const totalAnnouncements = mockAnnouncements.length
  const publishedAnnouncements = mockAnnouncements.filter(a => a.isPublished).length
  const draftAnnouncements = mockAnnouncements.filter(a => !a.isPublished).length
  const totalViews = mockAnnouncements.reduce((sum, a) => sum + a.views, 0)

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
            <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage school announcements
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Announcement
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <SpeakerWaveIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Announcements</dt>
                    <dd className="text-lg font-medium text-gray-900">{totalAnnouncements}</dd>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Published</dt>
                    <dd className="text-lg font-medium text-gray-900">{publishedAnnouncements}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarDaysIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Drafts</dt>
                    <dd className="text-lg font-medium text-gray-900">{draftAnnouncements}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <EyeIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                    <dd className="text-lg font-medium text-gray-900">{totalViews}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Audience Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <select
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                >
                  <option value="all">All Audiences</option>
                  <option value="students">Students</option>
                  <option value="parents">Parents</option>
                  <option value="teachers">Teachers</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredAnnouncements.map((announcement) => (
              <li key={announcement.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getPriorityIcon(announcement.priority)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {announcement.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          By {announcement.author}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={getPriorityBadge(announcement.priority)}>
                        {announcement.priority}
                      </span>
                      <span className={getAudienceBadge(announcement.targetAudience)}>
                        {announcement.targetAudience}
                      </span>
                      {announcement.isPublished ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {announcement.content}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>
                        Created: {formatDate(announcement.createdAt)}
                      </span>
                      {announcement.publishedAt && (
                        <span>
                          Published: {formatDate(announcement.publishedAt)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <EyeIcon className="h-4 w-4" />
                      <span>{announcement.views} views</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-500">
          Showing {filteredAnnouncements.length} of {mockAnnouncements.length} announcements
        </div>
      </div>
    </DashboardLayout>
  )
}
