'use client'

import React, { useState, useEffect } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function SetupPage() {
  const [configured, setConfigured] = useState(false)
  const [envVars, setEnvVars] = useState({
    url: '',
    anonKey: '',
    serviceKey: ''
  })

  useEffect(() => {
    setConfigured(isSupabaseConfigured())
    setEnvVars({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    })
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const steps = [
    {
      title: 'Create Supabase Project',
      description: 'Sign up at supabase.com and create a new project',
      status: 'pending'
    },
    {
      title: 'Get API Keys',
      description: 'Go to Settings > API in your Supabase dashboard',
      status: 'pending'
    },
    {
      title: 'Update Environment Variables',
      description: 'Add your Supabase credentials to .env.local',
      status: configured ? 'complete' : 'pending'
    },
    {
      title: 'Run Database Schema',
      description: 'Execute the SQL schema in Supabase SQL Editor',
      status: 'pending'
    },
    {
      title: 'Setup Demo Data',
      description: 'Create demo users and sample data',
      status: 'pending'
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
            School Management System Setup
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these steps to configure your School Management System with Supabase.
          </p>
        </div>

        {/* Configuration Status */}
        <div className={`rounded-lg p-6 mb-8 ${configured ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center">
            {configured ? (
              <CheckCircleIcon className="h-8 w-8 text-green-600 mr-4" />
            ) : (
              <XCircleIcon className="h-8 w-8 text-red-600 mr-4" />
            )}
            <div>
              <h3 className={`text-lg font-medium ${configured ? 'text-green-900' : 'text-red-900'}`}>
                {configured ? 'Supabase Configured' : 'Supabase Not Configured'}
              </h3>
              <p className={`text-sm ${configured ? 'text-green-700' : 'text-red-700'}`}>
                {configured 
                  ? 'Your Supabase configuration looks good! You can proceed with the setup.'
                  : 'Please configure your Supabase environment variables to continue.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Environment Variables Check */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Environment Variables</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">NEXT_PUBLIC_SUPABASE_URL</span>
                <div className="flex items-center">
                  {envVars.url && !envVars.url.includes('your-project') ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {envVars.url || 'Not set'}
                  </code>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                <div className="flex items-center">
                  {envVars.anonKey && !envVars.anonKey.includes('example') ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {envVars.anonKey ? `${envVars.anonKey.substring(0, 20)}...` : 'Not set'}
                  </code>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">SUPABASE_SERVICE_ROLE_KEY</span>
                <div className="flex items-center">
                  {envVars.serviceKey && !envVars.serviceKey.includes('example') ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {envVars.serviceKey ? `${envVars.serviceKey.substring(0, 20)}...` : 'Not set'}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Setup Steps</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    {step.status === 'complete' ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <span className="text-xs text-gray-500">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Detailed Instructions</h2>
          </div>
          <div className="p-6">
            <div className="prose max-w-none">
              <h3 className="text-lg font-medium text-gray-900 mb-4">1. Create Supabase Project</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 mb-6">
                <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">supabase.com</a></li>
                <li>Sign up or sign in to your account</li>
                <li>Click &quot;New Project&quot;</li>
                <li>Choose your organization and enter project details</li>
                <li>Wait for the project to be created (2-3 minutes)</li>
              </ol>

              <h3 className="text-lg font-medium text-gray-900 mb-4">2. Get API Keys</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 mb-6">
                <li>In your Supabase dashboard, go to Settings → API</li>
                <li>Copy the &quot;Project URL&quot;</li>
                <li>Copy the &quot;anon public&quot; key</li>
                <li>Copy the &quot;service_role secret&quot; key (keep this secure!)</li>
              </ol>

              <h3 className="text-lg font-medium text-gray-900 mb-4">3. Update Environment Variables</h3>
              <p className="text-sm text-gray-700 mb-4">
                Update your <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> file with your Supabase credentials:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span>NEXT_PUBLIC_SUPABASE_URL=your_project_url</span>
                  <button 
                    onClick={() => copyToClipboard('NEXT_PUBLIC_SUPABASE_URL=your_project_url')}
                    className="text-gray-400 hover:text-white"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</span>
                  <button 
                    onClick={() => copyToClipboard('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key')}
                    className="text-gray-400 hover:text-white"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>SUPABASE_SERVICE_ROLE_KEY=your_service_role_key</span>
                  <button 
                    onClick={() => copyToClipboard('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')}
                    className="text-gray-400 hover:text-white"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-4">4. Run Database Schema</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 mb-6">
                <li>In your Supabase dashboard, go to the SQL Editor</li>
                <li>Copy the contents of <code className="bg-gray-100 px-1 py-0.5 rounded">supabase-schema.sql</code></li>
                <li>Paste it into the SQL Editor and click &quot;Run&quot;</li>
                <li>Verify that all tables and policies were created successfully</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-center">
          {configured ? (
            <div className="space-y-4">
              <p className="text-green-700 font-medium">✅ Configuration looks good!</p>
              <Link
                href="/setup-demo"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Continue to Demo Setup
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
                <p className="text-yellow-800">
                  Please configure your Supabase environment variables and restart the development server.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
