export interface User {
  id: string
  userId: string
  email: string
  displayName?: string
  avatarUrl?: string
  preferences?: UserPreferences
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  emailNotifications: boolean
  deadlineReminders: boolean
  categories: string[]
  sources: string[]
  theme: 'light' | 'dark' | 'system'
}

export interface Application {
  id: string
  userId: string
  opportunityId: string
  opportunityTitle: string
  opportunitySource: string
  status: 'applied' | 'shortlisted' | 'rejected' | 'accepted'
  appliedAt: string
  updatedAt: string
  notes?: string
  deadline?: string
}

export interface Bookmark {
  id: string
  userId: string
  opportunityId: string
  opportunityTitle: string
  opportunitySource: string
  opportunityCategory: string
  opportunityDeadline?: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  type: 'deadline_reminder' | 'application_update'
  title: string
  message: string
  opportunityId?: string
  isRead: boolean
  scheduledFor?: string
  sentAt?: string
  createdAt: string
}