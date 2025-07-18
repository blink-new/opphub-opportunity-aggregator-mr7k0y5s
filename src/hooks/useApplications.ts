import { useState, useEffect, useCallback } from 'react'
import { blink } from '@/blink/client'
import { Application } from '@/types/user'
import { useAuth } from '@/hooks/useAuth'

export function useApplications() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchApplications = useCallback(async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      const apps = await blink.db.applications.list({
        where: { userId: user.id },
        orderBy: { appliedAt: 'desc' }
      })
      setApplications(apps)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) {
      setApplications([])
      setIsLoading(false)
      return
    }

    fetchApplications()
  }, [user?.id, fetchApplications])

  const applyToOpportunity = async (opportunityId: string, opportunityTitle: string, opportunitySource: string, deadline?: string) => {
    if (!user?.id) return

    try {
      const application = {
        id: `app_${Date.now()}`,
        userId: user.id,
        opportunityId,
        opportunityTitle,
        opportunitySource,
        status: 'applied' as const,
        deadline: deadline || null,
        notes: null
      }

      await blink.db.applications.create(application)
      setApplications(prev => [application, ...prev])

      // Schedule deadline reminder if deadline exists and user has notifications enabled
      if (deadline) {
        const deadlineDate = new Date(deadline)
        const reminderDate = new Date(deadlineDate.getTime() - 24 * 60 * 60 * 1000) // 1 day before

        if (reminderDate > new Date()) {
          await blink.db.notifications.create({
            id: `notif_${Date.now()}`,
            userId: user.id,
            type: 'deadline_reminder',
            title: 'Application Deadline Reminder',
            message: `Your application for "${opportunityTitle}" is due tomorrow!`,
            opportunityId,
            isRead: 0,
            scheduledFor: reminderDate.toISOString()
          })
        }
      }

      return application
    } catch (error) {
      console.error('Error applying to opportunity:', error)
      throw error
    }
  }

  const updateApplicationStatus = async (applicationId: string, status: Application['status'], notes?: string) => {
    try {
      await blink.db.applications.update(applicationId, {
        status,
        notes: notes || null,
        updatedAt: new Date().toISOString()
      })

      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status, notes: notes || app.notes, updatedAt: new Date().toISOString() }
          : app
      ))
    } catch (error) {
      console.error('Error updating application status:', error)
      throw error
    }
  }

  const deleteApplication = async (applicationId: string) => {
    try {
      await blink.db.applications.delete(applicationId)
      setApplications(prev => prev.filter(app => app.id !== applicationId))
    } catch (error) {
      console.error('Error deleting application:', error)
      throw error
    }
  }

  return {
    applications,
    isLoading,
    applyToOpportunity,
    updateApplicationStatus,
    deleteApplication,
    refetch: fetchApplications
  }
}