import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const to = searchParams.get('to')

        if (!to) {
            return NextResponse.json({
                error: 'Please provide email address: /api/test-sendgrid?to=email@example.com'
            }, { status: 400 })
        }

        console.log('Testing SendGrid email to:', to)

        const result = await sendEmail({
            to,
            subject: '🧪 SendGrid Test - Carte Canadienne',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #1e40af; margin-top: 0;">✅ SendGrid Test Successful!</h1>
        <p style="font-size: 16px; line-height: 1.6;">
            If you're reading this email, <strong>SendGrid is working correctly</strong>!
        </p>
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>📧 From:</strong> ${process.env.SENDGRID_FROM}</p>
            <p style="margin: 10px 0 0 0;"><strong>🕐 Sent at:</strong> ${new Date().toLocaleString('fr-CA', { 
                timeZone: 'America/Toronto',
                dateStyle: 'full',
                timeStyle: 'long'
            })}</p>
        </div>
        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            This is a test email from Carte Canadienne application.
        </p>
    </div>
</body>
</html>
            `,
        })

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `✅ Test email sent successfully to ${to}!`,
                details: 'Check your inbox (and spam folder) for the test email.',
                sendgridResponse: result.data?.[0]?.statusCode || 'sent'
            })
        } else {
            return NextResponse.json({
                success: false,
                error: 'Failed to send email',
                details: result.error
            }, { status: 500 })
        }
    } catch (error: any) {
        console.error('Test email error:', error)
        return NextResponse.json({
            success: false,
            error: error.message,
            details: error.response?.body || error
        }, { status: 500 })
    }
}
