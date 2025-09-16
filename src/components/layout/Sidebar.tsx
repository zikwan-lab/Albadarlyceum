'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  SpeakerWaveIcon,
  ChartBarIcon,
  CogIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

interface SidebarProps {
  onClose?: () => void
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    roles: ['admin', 'teacher', 'student', 'parent']
  },
  {
    name: 'Schools',
    href: '/dashboard/schools',
    icon: BuildingOfficeIcon,
    roles: ['admin']
  },
  {
    name: 'Students',
    href: '/dashboard/students',
    icon: UserGroupIcon,
    roles: ['admin', 'teacher']
  },
  {
    name: 'Teachers',
    href: '/dashboard/teachers',
    icon: AcademicCapIcon,
    roles: ['admin']
  },
  {
    name: 'Classes',
    href: '/dashboard/classes',
    icon: BookOpenIcon,
    roles: ['admin', 'teacher']
  },
  {
    name: 'Subjects',
    href: '/dashboard/subjects',
    icon: BookOpenIcon,
    roles: ['admin', 'teacher']
  },
  {
    name: 'Lectures',
    href: '/dashboard/lectures',
    icon: CalendarDaysIcon,
    roles: ['admin', 'teacher', 'student']
  },
  {
    name: 'Attendance',
    href: '/dashboard/attendance',
    icon: ClipboardDocumentCheckIcon,
    roles: ['admin', 'teacher', 'student', 'parent']
  },
  {
    name: 'Announcements',
    href: '/dashboard/announcements',
    icon: SpeakerWaveIcon,
    roles: ['admin', 'teacher', 'student', 'parent']
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: ChartBarIcon,
    roles: ['admin', 'teacher']
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: UserIcon,
    roles: ['admin', 'teacher', 'student', 'parent']
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: CogIcon,
    roles: ['admin']
  },
]

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const { profile } = useAuth()

  const filteredNavigation = navigation.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  )

  return (
    <div className="flex h-full flex-col bg-white shadow-lg">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SMS</span>
            </div>
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-gray-900">School MS</h1>
          </div>
        </div>
        
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">
                {profile?.full_name?.charAt(0)?.toUpperCase() || profile?.email?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.full_name || profile?.email}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {profile?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
