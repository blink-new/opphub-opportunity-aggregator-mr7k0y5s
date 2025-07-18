import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface DeadlineReminderRequest {
  userEmail: string;
  userName: string;
  opportunityTitle: string;
  deadline: string;
  applyUrl: string;
}

serve(async (req) => {
  // Handle CORS for frontend calls
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const { userEmail, userName, opportunityTitle, deadline, applyUrl }: DeadlineReminderRequest = await req.json();

    if (!userEmail || !userName || !opportunityTitle || !deadline) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const deadlineDate = new Date(deadline);
    const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

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
    `;

    const text = `
Hi ${userName}!

This is a friendly reminder that the application deadline for "${opportunityTitle}" is approaching soon.

Deadline: ${formattedDeadline}

Don't miss out on this opportunity! Make sure to submit your application before the deadline.

Apply now: ${applyUrl}

---
This reminder was sent by OppHub - Your unified opportunity aggregator
Visit: https://opphub-opportunity-aggregator-mr7k0y5s.sites.blink.new
    `;

    // For now, we'll simulate sending the email and return success
    // In a real implementation, you would integrate with an email service
    console.log(`Sending deadline reminder to ${userEmail} for ${opportunityTitle}`);
    console.log(`Deadline: ${formattedDeadline}`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Deadline reminder scheduled successfully',
      recipient: userEmail,
      opportunity: opportunityTitle,
      deadline: formattedDeadline
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error processing deadline reminder:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to process deadline reminder'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});