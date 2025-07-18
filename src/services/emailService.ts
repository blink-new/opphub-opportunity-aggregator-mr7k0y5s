import { blink } from '@/blink/client'

export interface EmailNotification {
  to: string
  subject: string
  html: string
  text?: string
}

export class EmailService {
  static async sendDeadlineReminder(
    userEmail: string,
    userName: string,
    opportunityTitle: string,
    deadline: string,
    applyUrl: string
  ) {
    const deadlineDate = new Date(deadline)
    const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6366F1 0%, #F59E0B 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">⏰ Deadline Reminder</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1f2937; margin-top: 0;">Hi ${userName}!</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            This is a friendly reminder that the application deadline for <strong>"${opportunityTitle}"</strong> is approaching soon.
          </p>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #92400e; font-weight: 600;">
              📅 Deadline: ${formattedDeadline}
            </p>
          </div>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Don't miss out on this opportunity! Make sure to submit your application before the deadline.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${applyUrl}" 
               style="background: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Apply Now →
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This reminder was sent by <strong>OppHub</strong> - Your unified opportunity aggregator<br>
            <a href="https://opphub-opportunity-aggregator-mr7k0y5s.sites.blink.new" style="color: #6366F1;">Visit OppHub</a>
          </p>
        </div>
      </div>
    `

    const text = `
Hi ${userName}!

This is a friendly reminder that the application deadline for "${opportunityTitle}" is approaching soon.

Deadline: ${formattedDeadline}

Don't miss out on this opportunity! Make sure to submit your application before the deadline.

Apply now: ${applyUrl}

---
This reminder was sent by OppHub - Your unified opportunity aggregator
Visit: https://opphub-opportunity-aggregator-mr7k0y5s.sites.blink.new
    `

    try {
      const result = await blink.notifications.email({
        to: userEmail,
        from: 'reminders@opphub.com',
        subject: `⏰ Deadline Reminder: ${opportunityTitle}`,
        html,
        text
      })

      return result
    } catch (error) {
      console.error('Failed to send deadline reminder:', error)
      throw error
    }
  }

  static async sendApplicationStatusUpdate(
    userEmail: string,
    userName: string,
    opportunityTitle: string,
    oldStatus: string,
    newStatus: string
  ) {
    const statusEmoji = {
      applied: '📝',
      shortlisted: '🎯',
      accepted: '🎉',
      rejected: '😔'
    }

    const statusColor = {
      applied: '#3b82f6',
      shortlisted: '#f59e0b',
      accepted: '#10b981',
      rejected: '#ef4444'
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6366F1 0%, #F59E0B 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📬 Application Update</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1f2937; margin-top: 0;">Hi ${userName}!</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Great news! There's an update on your application for <strong>"${opportunityTitle}"</strong>.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Status Updated</p>
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
              <span style="color: #9ca3af; text-decoration: line-through; text-transform: capitalize;">
                ${oldStatus}
              </span>
              <span style="color: #6b7280;">→</span>
              <span style="color: ${statusColor[newStatus as keyof typeof statusColor]}; font-weight: 600; font-size: 18px; text-transform: capitalize;">
                ${statusEmoji[newStatus as keyof typeof statusEmoji]} ${newStatus}
              </span>
            </div>
          </div>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Keep track of all your applications in your personal dashboard.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://opphub-opportunity-aggregator-mr7k0y5s.sites.blink.new" 
               style="background: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              View Dashboard →
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This update was sent by <strong>OppHub</strong> - Your unified opportunity aggregator<br>
            <a href="https://opphub-opportunity-aggregator-mr7k0y5s.sites.blink.new" style="color: #6366F1;">Visit OppHub</a>
          </p>
        </div>
      </div>
    `

    const text = `
Hi ${userName}!

Great news! There's an update on your application for "${opportunityTitle}".

Status Updated: ${oldStatus} → ${newStatus}

Keep track of all your applications in your personal dashboard.

Visit your dashboard: https://opphub-opportunity-aggregator-mr7k0y5s.sites.blink.new

---
This update was sent by OppHub - Your unified opportunity aggregator
    `

    try {
      const result = await blink.notifications.email({
        to: userEmail,
        from: 'updates@opphub.com',
        subject: `📬 Application Update: ${opportunityTitle}`,
        html,
        text
      })

      return result
    } catch (error) {
      console.error('Failed to send application status update:', error)
      throw error
    }
  }
}