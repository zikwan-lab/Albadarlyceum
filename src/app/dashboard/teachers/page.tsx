'use client'

import React, { useState } from 'react'

export const dynamic = 'force-dynamic'
import { useRequireAuth, useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  PlusIcon,
  MagnifyingGlassIcon,

  EllipsisVerticalIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

// Mock data - in a real app, this would come from your API
const mockTeachers = [
  {
    id: '1',
    employeeId: 'TCH001',
    fullName: 'John Smith',
    email: 'john.smith@school.com',
    phone: '+1-555-0101',
    department: 'Mathematics',
    qualification: 'M.Sc. Mathematics',
    subjects: ['Algebra', 'Geometry', 'Calculus'],
    classes: ['10-A', '11-B'],
    hireDate: '2023-08-15',
    status: 'active',
    experience: '5 years'
  },
  {
    id: '2',
    employeeId: 'TCH002',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@school.com',
    phone: '+1-555-0102',
    department: 'English',
    qualification: 'M.A. English Literature',
    subjects: ['English Literature', 'Creative Writing'],
    classes: ['9-C', '10-A'],
    hireDate: '2022-01-10',
    status: 'active',
    experience: '8 years'
  },
  {
    id: '3',
    employeeId: 'TCH003',
    fullName: 'Michael Brown',
    email: 'michael.brown@school.com',
    phone: '+1-555-0103',
    department: 'Science',
    qualification: 'M.Sc. Physics',
    subjects: ['Physics', 'Chemistry'],
    classes: ['11-B', '12-A'],
    hireDate: '2021-09-01',
    status: 'active',
    experience: '12 years'
  },
  {
    id: '4',
    employeeId: 'TCH004',
    fullName: 'Emily Davis',
    email: 'emily.davis@school.com',
    phone: '+1-555-0104',
    department: 'Computer Science',
    qualification: 'M.Tech. Computer Science',
    subjects: ['Programming', 'Database Systems'],
    classes: ['10-A', '11-B'],
    hireDate: '2023-03-20',
    status: 'active',
    experience: '3 years'
  }
]

export default function TeachersPage() {
  useRequireAuth('admin')
  const { profile } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')


  // Filter teachers based on search and department
  const filteredTeachers = mockTeachers.filter(teacher => {
    const matchesSearch = teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === 'all' || teacher.department === selectedDepartment
    
    return matchesSearch && matchesDepartment
  })

  const departments = ['all', ...Array.from(new Set(mockTeachers.map(t => t.department)))]

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
            <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage teacher profiles, assignments, and performance
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Teacher
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Teachers</dt>
                    <dd className="text-lg font-medium text-gray-900">{mockTeachers.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarDaysIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Teachers</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {mockTeachers.filter(t => t.status === 'active').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 bg-purple-600 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Departments</dt>
                    <dd className="text-lg font-medium text-gray-900">{departments.length - 1}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 bg-yellow-600 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Experience</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {Math.round(mockTeachers.reduce((acc, t) => acc + parseInt(t.experience), 0) / mockTeachers.length)} years
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search teachers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Department Filter */}
              <div className="sm:w-48">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredTeachers.map((teacher) => (
              <li key={teacher.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {teacher.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{teacher.fullName}</div>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {teacher.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {teacher.employeeId} • {teacher.department}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="hidden sm:block text-sm text-gray-500">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        {teacher.email}
                      </div>
                      <div className="flex items-center mt-1">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        {teacher.phone}
                      </div>
                    </div>
                    
                    <div className="hidden md:block text-sm text-gray-500">
                      <div>Classes: {teacher.classes.join(', ')}</div>
                      <div>Experience: {teacher.experience}</div>
                    </div>

                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600">
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                  } block px-4 py-2 text-sm w-full text-left`}
                                >
                                  View Profile
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                  } block px-4 py-2 text-sm w-full text-left`}
                                >
                                  Edit Teacher
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                  } block px-4 py-2 text-sm w-full text-left`}
                                >
                                  Assign Classes
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                  } block px-4 py-2 text-sm w-full text-left`}
                                >
                                  View Schedule
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-500">
          Showing {filteredTeachers.length} of {mockTeachers.length} teachers
        </div>
      </div>
    </DashboardLayout>
  )
}
