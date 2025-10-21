import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailParams {
    to: string
    subject: string
    html: string
}

export async function sendEmail({ to, subject, html }: EmailParams) {
    try {
        const data = await resend.emails.send({
            from: 'Carte Canadienne <onboarding@resend.dev>',
            to: [to],
            subject,
            html,
        })

        console.log('Email sent successfully:', data)
        return { success: true, data }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error }
    }
}