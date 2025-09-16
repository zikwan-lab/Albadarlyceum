'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { isSupabaseConfigured } from '@/lib/supabase'
import Link from 'next/link'
import {
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

export default function SetupDemoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [configured, setConfigured] = useState(true)

  useEffect(() => {
    setConfigured(isSupabaseConfigured())
  }, [])

  const handleSetupDemo = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/setup-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-key': 'demo-setup-key-123' // In production, this should be more secure
        }
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please check your configuration.')
      }

      const data = await response.json()

      if (response.ok) {
        toast.success('Demo data setup completed successfully!')
        setSetupComplete(true)
      } else {
        const errorMessage = data.error || 'Failed to setup demo data'
        if (errorMessage.includes('Supabase is not configured')) {
          toast.error('Supabase is not configured. Please set up your environment variables first.')
        } else if (errorMessage.includes('fetch failed')) {
          toast.error('Cannot connect to Supabase. Please check your configuration.')
        } else {
          toast.error(errorMessage)
        }
        console.error('Setup error:', data)
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('JSON')) {
          toast.error('Configuration error: Please check your Supabase setup')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error('An unexpected error occurred during setup')
      }
      console.error('Setup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const demoCredentials = [
    {
      role: 'Admin',
      email: 'admin@school.com',
      password: 'admin123',
      icon: UserGroupIcon,
      color: 'bg-red-500',
      description: 'Full system access, manage all users and settings'
    },
    {
      role: 'Teacher',
      email: 'teacher@school.com',
      password: 'teacher123',
      icon: AcademicCapIcon,
      color: 'bg-blue-500',
      description: 'Manage classes, students, attendance, and lectures'
    },
    {
      role: 'Student',
      email: 'student@school.com',
      password: 'student123',
      icon: BookOpenIcon,
      color: 'bg-green-500',
      description: 'View lectures, attendance, and announcements'
    },
    {
      role: 'Parent',
      email: 'parent@school.com',
      password: 'parent123',
      icon: BuildingOfficeIcon,
      color: 'bg-purple-500',
      description: 'Monitor child\'s attendance, grades, and school updates'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
            <span className="text-white font-bold text-xl">SMS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            School Management System Demo Setup
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Set up demo data and user accounts to explore all features of the School Management System.
          </p>
        </div>

        {/* Configuration Warning */}
        {!configured && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Supabase Not Configured
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Please configure your Supabase environment variables before setting up demo data.
                </p>
                <div className="mt-3">
                  <Link
                    href="/setup"
                    className="text-sm font-medium text-red-800 underline hover:text-red-600"
                  >
                    Go to Setup Guide →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Development Environment Only
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                This setup is intended for development and demo purposes only.
                Do not use in production environments.
              </p>
            </div>
          </div>
        </div>

        {/* Setup Button */}
        <div className="text-center mb-12">
          {!setupComplete ? (
            <button
              onClick={handleSetupDemo}
              disabled={isLoading || !configured}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Setting up demo data...
                </>
              ) : !configured ? (
                <>
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                  Configuration Required
                </>
              ) : (
                <>
                  <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                  Setup Demo Data
                </>
              )}
            </button>
          ) : (
            <div className="inline-flex items-center px-6 py-3 border border-green-200 text-base font-medium rounded-md text-green-800 bg-green-100">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Demo setup completed successfully!
            </div>
          )}
        </div>

        {/* Demo Credentials */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Demo User Accounts</h2>
            <p className="text-sm text-gray-500 mt-1">
              Use these credentials to test different user roles and permissions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {demoCredentials.map((credential) => (
              <div key={credential.role} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className={`${credential.color} rounded-lg p-2 mr-3`}>
                    <credential.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{credential.role}</h3>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Email:</span>
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {credential.email}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Password:</span>
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {credential.password}
                    </code>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">{credential.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What gets created */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">What Gets Created</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Demo School</h3>
                <p className="text-sm text-gray-500">Demo High School with basic information</p>
              </div>
              
              <div className="text-center">
                <BookOpenIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Subjects & Classes</h3>
                <p className="text-sm text-gray-500">5 subjects and 3 classes with proper assignments</p>
              </div>
              
              <div className="text-center">
                <UserGroupIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">User Accounts</h3>
                <p className="text-sm text-gray-500">4 demo users with different roles and permissions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {setupComplete && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">Next Steps</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>✅ Demo data has been created successfully</p>
              <p>✅ User accounts are ready for testing</p>
              <p>🔗 <a href="/auth/signin" className="underline hover:text-blue-600">Go to Sign In Page</a> to start testing</p>
              <p>📚 Try logging in with different user roles to see role-based features</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
