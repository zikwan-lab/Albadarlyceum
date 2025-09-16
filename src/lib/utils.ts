import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatTime(time: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(`2000-01-01T${time}`))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getAttendanceColor(status: string) {
  switch (status) {
    case 'present':
      return 'text-green-600 bg-green-100'
    case 'absent':
      return 'text-red-600 bg-red-100'
    case 'late':
      return 'text-yellow-600 bg-yellow-100'
    case 'excused':
      return 'text-blue-600 bg-blue-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 bg-red-100'
    case 'high':
      return 'text-orange-600 bg-orange-100'
    case 'medium':
      return 'text-yellow-600 bg-yellow-100'
    case 'low':
      return 'text-green-600 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'active':
    case 'completed':
    case 'present':
      return 'text-green-600 bg-green-100'
    case 'inactive':
    case 'cancelled':
    case 'absent':
      return 'text-red-600 bg-red-100'
    case 'pending':
    case 'scheduled':
    case 'late':
      return 'text-yellow-600 bg-yellow-100'
    case 'ongoing':
      return 'text-blue-600 bg-blue-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string) {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

export function calculateAge(birthDate: string) {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export function getAcademicYear() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // JavaScript months are 0-indexed
  
  // Academic year typically starts in August/September
  if (currentMonth >= 8) {
    return `${currentYear}-${currentYear + 1}`
  } else {
    return `${currentYear - 1}-${currentYear}`
  }
}

export function isValidAcademicYear(year: string) {
  const yearRegex = /^\d{4}-\d{4}$/
  if (!yearRegex.test(year)) return false
  
  const [startYear, endYear] = year.split('-').map(Number)
  return endYear === startYear + 1
}

export function getWeekDays() {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
}

export function getTimeSlots() {
  const slots = []
  for (let hour = 8; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      slots.push(time)
    }
  }
  return slots
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
