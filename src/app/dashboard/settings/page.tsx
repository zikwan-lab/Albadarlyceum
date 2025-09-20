'use client'

import React, { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRequireAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { supabase } from '@/lib/supabase'
import {
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

interface SystemSettings {
  school_name: string
  school_email: string
  school_phone: string
  school_address: string
  academic_year: string
  attendance_threshold: number
  notification_enabled: boolean
  email_notifications: boolean
  sms_notifications: boolean
  auto_backup: boolean
  maintenance_mode: boolean
}

export default function SettingsPage() {
  useRequireAuth('admin')
  const [settings, setSettings] = useState<SystemSettings>({
    school_name: '',
    school_email: '',
    school_phone: '',
    school_address: '',
    academic_year: '2024-2025',
    attendance_threshold: 75,
    notification_enabled: true,
    email_notifications: true,
    sms_notifications: false,
    auto_backup: true,
    maintenance_mode: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // In a real app, fetch settings from database
      // For now, using default values
      setLoading(false)
    } catch (error) {
      console.error('Error fetching settings:', error)
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      
      // In a real app, save to database
      // await supabase.from('system_settings').upsert(settings)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
      
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'backup', name: 'Backup & Maintenance', icon: ExclamationTriangleIcon },
  ]

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
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Configure school system preferences and administrative settings
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex">
              {message.type === 'success' ? (
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              )}
              <div className="ml-3">
                <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {message.text}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">School Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                        School Name
                      </label>
                      <input
                        type="text"
                        value={settings.school_name}
                        onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter school name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                        School Email
                      </label>
                      <input
                        type="email"
                        value={settings.school_email}
                        onChange={(e) => setSettings({ ...settings, school_email: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="school@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <PhoneIcon className="h-4 w-4 inline mr-1" />
                        School Phone
                      </label>
                      <input
                        type="tel"
                        value={settings.school_phone}
                        onChange={(e) => setSettings({ ...settings, school_phone: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <AcademicCapIcon className="h-4 w-4 inline mr-1" />
                        Academic Year
                      </label>
                      <select
                        value={settings.academic_year}
                        onChange={(e) => setSettings({ ...settings, academic_year: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="2024-2025">2024-2025</option>
                        <option value="2025-2026">2025-2026</option>
                        <option value="2026-2027">2026-2027</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Address
                    </label>
                    <textarea
                      rows={3}
                      value={settings.school_address}
                      onChange={(e) => setSettings({ ...settings, school_address: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter complete school address"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Attendance Threshold (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={settings.attendance_threshold}
                        onChange={(e) => setSettings({ ...settings, attendance_threshold: parseInt(e.target.value) })}
                        className="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Students below this threshold will be flagged for poor attendance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-900">
                          Enable Notifications
                        </label>
                        <p className="text-sm text-gray-500">
                          Master switch for all system notifications
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, notification_enabled: !settings.notification_enabled })}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${settings.notification_enabled ? 'bg-blue-600' : 'bg-gray-200'}
                        `}
                      >
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                            transition duration-200 ease-in-out
                            ${settings.notification_enabled ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-900">
                          Email Notifications
                        </label>
                        <p className="text-sm text-gray-500">
                          Send notifications via email
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, email_notifications: !settings.email_notifications })}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${settings.email_notifications ? 'bg-blue-600' : 'bg-gray-200'}
                        `}
                      >
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                            transition duration-200 ease-in-out
                            ${settings.email_notifications ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-900">
                          SMS Notifications
                        </label>
                        <p className="text-sm text-gray-500">
                          Send critical notifications via SMS
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, sms_notifications: !settings.sms_notifications })}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${settings.sms_notifications ? 'bg-blue-600' : 'bg-gray-200'}
                        `}
                      >
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                            transition duration-200 ease-in-out
                            ${settings.sms_notifications ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security & Access</h3>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <div className="flex">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Security Features Coming Soon
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>Advanced security features including:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Two-factor authentication</li>
                              <li>Password policy configuration</li>
                              <li>Session timeout settings</li>
                              <li>IP whitelist management</li>
                              <li>Audit log configuration</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Active Sessions</h4>
                        <p className="text-2xl font-bold text-blue-600">12</p>
                        <p className="text-sm text-gray-500">Currently logged in users</p>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Failed Login Attempts</h4>
                        <p className="text-2xl font-bold text-red-600">3</p>
                        <p className="text-sm text-gray-500">In the last 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Backup & Maintenance Settings */}
            {activeTab === 'backup' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Backup & Maintenance</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-900">
                          Automatic Backups
                        </label>
                        <p className="text-sm text-gray-500">
                          Automatically backup system data daily
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, auto_backup: !settings.auto_backup })}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${settings.auto_backup ? 'bg-blue-600' : 'bg-gray-200'}
                        `}
                      >
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                            transition duration-200 ease-in-out
                            ${settings.auto_backup ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-900">
                          Maintenance Mode
                        </label>
                        <p className="text-sm text-gray-500">
                          Put system in maintenance mode for updates
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                          ${settings.maintenance_mode ? 'bg-red-600' : 'bg-gray-200'}
                        `}
                      >
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                            transition duration-200 ease-in-out
                            ${settings.maintenance_mode ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
                      <div className="space-y-3">
                        <button className="w-full text-left px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                          <div className="flex items-center">
                            <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Create Manual Backup</p>
                              <p className="text-xs text-gray-500">Backup all system data now</p>
                            </div>
                          </div>
                        </button>

                        <button className="w-full text-left px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                          <div className="flex items-center">
                            <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">System Health Check</p>
                              <p className="text-xs text-gray-500">Run diagnostic tests</p>
                            </div>
                          </div>
                        </button>

                        <button className="w-full text-left px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                          <div className="flex items-center">
                            <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Clear Cache</p>
                              <p className="text-xs text-gray-500">Clear system cache and temporary files</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <div className="flex">
                        <CheckCircleIcon className="h-5 w-5 text-blue-400" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">
                            Last Backup Status
                          </h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <p>✅ Completed successfully on {new Date().toLocaleDateString()}</p>
                            <p className="mt-1">Next scheduled backup: Tomorrow at 2:00 AM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
