'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Image from 'next/image'
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { profile, signOut } = useAuth()
  const [notifications] = useState([
    { id: 1, title: 'New student enrolled', time: '5 min ago', unread: true },
    { id: 2, title: 'Attendance report ready', time: '1 hour ago', unread: true },
    { id: 3, title: 'Parent meeting scheduled', time: '2 hours ago', unread: false },
  ])

  const unreadCount = notifications.filter(n => n.unread).length

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/auth/signin'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Page title */}
          <div className="flex-1 lg:flex-none">
            <h1 className="text-xl font-semibold text-gray-900 ml-4 lg:ml-0">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Menu as="div" className="relative">
              <Menu.Button className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  </div>
                  {notifications.map((notification) => (
                    <Menu.Item key={notification.id}>
                      {({ active }) => (
                        <div
                          className={cn(
                            'px-4 py-3 border-b border-gray-100 last:border-b-0',
                            active ? 'bg-gray-50' : '',
                            notification.unread ? 'bg-blue-50' : ''
                          )}
                        >
                          <p className="text-sm text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                  <div className="px-4 py-2 border-t border-gray-200">
                    <Link
                      href="/dashboard/notifications"
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      View all notifications
                    </Link>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="sr-only">Open user menu</span>
                {profile?.avatar_url ? (
                  <Image
                    className="h-8 w-8 rounded-full"
                    src={profile.avatar_url}
                    alt="User avatar"
                    width={32}
                    height={32}
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                )}
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/profile"
                        className={cn(
                          'flex items-center px-4 py-2 text-sm text-gray-700',
                          active ? 'bg-gray-100' : ''
                        )}
                      >
                        <UserCircleIcon className="mr-3 h-4 w-4" />
                        Your Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/settings"
                        className={cn(
                          'flex items-center px-4 py-2 text-sm text-gray-700',
                          active ? 'bg-gray-100' : ''
                        )}
                      >
                        <Cog6ToothIcon className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={cn(
                          'flex w-full items-center px-4 py-2 text-sm text-gray-700',
                          active ? 'bg-gray-100' : ''
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  )
}
