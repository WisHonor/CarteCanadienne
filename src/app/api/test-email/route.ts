import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { to } = await request.json();

    if (!to) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    console.log('🧪 Testing email send to:', to);

    const result = await sendEmail({
      to,
      subject: '✅ Test Email from Carte Canadienne',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1e40af;">Email Test Successful! ✅</h1>
          <p>If you're seeing this email, your Resend configuration is working correctly.</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            This is a test email from your Carte Canadienne application.
          </p>
          <p style="color: #6b7280; font-size: 14px;">
            Time: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    console.log('📧 Email result:', result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!',
        data: result.data,
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to send email',
          details: result.error 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Test email error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
