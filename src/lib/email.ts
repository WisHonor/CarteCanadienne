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
            from: 'Carte Canadienne <onboarding@resend.dev>', // Change this to your verified domain
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

// Email templates
export function getApprovalEmailTemplate(params: {
    firstName: string
    lastName: string
    lang: 'fr' | 'en'
}) {
    const { firstName, lastName, lang } = params

    if (lang === 'fr') {
        return {
            subject: '✅ Votre demande de Carte Canadienne du Handicap a été approuvée',
            html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande approuvée</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Gouvernement du Canada</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Service de la Carte d'accessibilité</p>
    </div>
    
    <div style="background: #ffffff; padding: 40px; border: 2px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #10b981; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 48px;">✓</span>
            </div>
            <h2 style="color: #059669; margin: 0; font-size: 24px;">Félicitations!</h2>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 20px;">Bonjour ${firstName} ${lastName},</p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
            Nous avons le plaisir de vous informer que votre demande de <strong>Carte Canadienne du Handicap</strong> a été <strong style="color: #059669;">approuvée</strong>.
        </p>
        
        <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #065f46; font-size: 18px;">Prochaines étapes</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Votre carte sera produite et expédiée à votre adresse dans les 10 à 15 jours ouvrables.</li>
                <li style="margin-bottom: 10px;">Vous recevrez un courriel de confirmation avec le numéro de suivi.</li>
                <li style="margin-bottom: 10px;">En attendant, vous pouvez consulter le statut de votre demande en ligne.</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/application/check-status" 
               style="background: #1e40af; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                Voir ma demande
            </a>
        </div>
        
        <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
            Si vous avez des questions, n'hésitez pas à nous contacter au <strong>1-800-123-4567</strong> ou par courriel.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} Gouvernement du Canada. Tous droits réservés.<br>
            Ceci est un message automatique, veuillez ne pas y répondre.
        </p>
    </div>
</body>
</html>
            `,
        }
    } else {
        return {
            subject: '✅ Your Canadian Accessibility Card Application Has Been Approved',
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Approved</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Government of Canada</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Accessible Card Service</p>
    </div>
    
    <div style="background: #ffffff; padding: 40px; border: 2px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #10b981; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 48px;">✓</span>
            </div>
            <h2 style="color: #059669; margin: 0; font-size: 24px;">Congratulations!</h2>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 20px;">Hello ${firstName} ${lastName},</p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
            We are pleased to inform you that your <strong>Canadian Accessibility Card</strong> application has been <strong style="color: #059669;">approved</strong>.
        </p>
        
        <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #065f46; font-size: 18px;">Next Steps</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Your card will be produced and shipped to your address within 10-15 business days.</li>
                <li style="margin-bottom: 10px;">You will receive a confirmation email with tracking information.</li>
                <li style="margin-bottom: 10px;">In the meantime, you can check your application status online.</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/application/check-status" 
               style="background: #1e40af; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                View My Application
            </a>
        </div>
        
        <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
            If you have any questions, please contact us at <strong>1-800-123-4567</strong> or by email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} Government of Canada. All rights reserved.<br>
            This is an automated message, please do not reply.
        </p>
    </div>
</body>
</html>
            `,
        }
    }
}

export function getRejectionEmailTemplate(params: {
    firstName: string
    lastName: string
    adminNotes?: string | null
    lang: 'fr' | 'en'
}) {
    const { firstName, lastName, adminNotes, lang } = params

    if (lang === 'fr') {
        return {
            subject: 'Mise à jour de votre demande de Carte Canadienne du Handicap',
            html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mise à jour de votre demande</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Gouvernement du Canada</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Service de la Carte d'accessibilité</p>
    </div>
    
    <div style="background: #ffffff; padding: 40px; border: 2px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #ef4444; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 48px;">✕</span>
            </div>
            <h2 style="color: #dc2626; margin: 0; font-size: 24px;">Mise à jour de votre demande</h2>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 20px;">Bonjour ${firstName} ${lastName},</p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
            Nous vous remercions d'avoir soumis votre demande de <strong>Carte Canadienne du Handicap</strong>.
        </p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
            Malheureusement, après examen de votre dossier, nous ne sommes pas en mesure d'approuver votre demande à ce stade.
        </p>
        
        ${adminNotes ? `
        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 30px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #991b1b; font-size: 18px;">Raison du refus</h3>
            <p style="margin: 0; color: #7f1d1d;">${adminNotes}</p>
        </div>
        ` : ''}
        
        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">Que faire maintenant?</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Vous pouvez soumettre une nouvelle demande avec les documents requis.</li>
                <li style="margin-bottom: 10px;">Contactez-nous si vous avez des questions ou besoin d'éclaircissements.</li>
                <li style="margin-bottom: 10px;">Notre équipe est disponible pour vous aider au <strong>1-800-123-4567</strong>.</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/demande" 
               style="background: #1e40af; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                Nouvelle demande
            </a>
        </div>
        
        <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
            Nous vous remercions de votre compréhension et restons à votre disposition pour toute question.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} Gouvernement du Canada. Tous droits réservés.<br>
            Ceci est un message automatique, veuillez ne pas y répondre.
        </p>
    </div>
</body>
</html>
            `,
        }
    } else {
        return {
            subject: 'Update on Your Canadian Accessibility Card Application',
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Government of Canada</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Accessible Card Service</p>
    </div>
    
    <div style="background: #ffffff; padding: 40px; border: 2px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #ef4444; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 48px;">✕</span>
            </div>
            <h2 style="color: #dc2626; margin: 0; font-size: 24px;">Application Update</h2>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 20px;">Hello ${firstName} ${lastName},</p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
            Thank you for submitting your <strong>Canadian Accessibility Card</strong> application.
        </p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
            Unfortunately, after reviewing your application, we are unable to approve it at this time.
        </p>
        
        ${adminNotes ? `
        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 30px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #991b1b; font-size: 18px;">Reason for Rejection</h3>
            <p style="margin: 0; color: #7f1d1d;">${adminNotes}</p>
        </div>
        ` : ''}
        
        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">What to do next?</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">You can submit a new application with the required documents.</li>
                <li style="margin-bottom: 10px;">Contact us if you have questions or need clarification.</li>
                <li style="margin-bottom: 10px;">Our team is available to help you at <strong>1-800-123-4567</strong>.</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/demande" 
               style="background: #1e40af; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                New Application
            </a>
        </div>
        
        <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
            Thank you for your understanding. We remain at your disposal for any questions.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} Government of Canada. All rights reserved.<br>
            This is an automated message, please do not reply.
        </p>
    </div>
</body>
</html>
            `,
        }
    }
}
