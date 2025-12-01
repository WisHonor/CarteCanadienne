import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { sendEmail, getApprovalEmailTemplate, getRejectionEmailTemplate } from '@/lib/email'
import { generateGoogleWalletJWT, generateCardNumber, formatExpiryDate } from '@/lib/google-wallet'

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const authHeader = req.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '')
        
        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { applicationId, status, adminNotes, approvedServices } = body

        console.log('Verifying application:', { applicationId, status, adminNotes, approvedServices })

        if (!applicationId || !status) {
            return NextResponse.json(
                { error: 'Application ID and status are required' },
                { status: 400 }
            )
        }

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return NextResponse.json(
                { error: 'Status must be APPROVED or REJECTED' },
                { status: 400 }
            )
        }

        // Get the application with user details for email
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                User_Application_userIdToUser: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        })

        if (!application) {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            )
        }

        // Update the application
        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: {
                status,
                adminNotes: adminNotes || null,
                approvedServices: status === 'APPROVED' && approvedServices
                    ? JSON.stringify(approvedServices)
                    : null,
                verifiedAt: new Date(),
                verifiedById: null, // Will be set to actual admin ID once auth is implemented
                updatedAt: new Date(),
            },
        })

        console.log('Application verified:', updatedApplication)

        // Send email notification
        try {
            const user = application.User_Application_userIdToUser
            const lang: 'fr' | 'en' = 'fr' // Default to French, could be stored in user preferences
            
            if (status === 'APPROVED') {
                // Generate Google Wallet URL with JWT
                let walletUrl: string | undefined
                try {
                    // Get full user details for wallet
                    const fullUser = await prisma.user.findUnique({
                        where: { id: application.userId }
                    })

                    if (fullUser && fullUser.dateOfBirth) {
                        const cardNumber = generateCardNumber()
                        const expiryDate = formatExpiryDate(5) // 5 years expiry
                        
                        // Use approved services if available, otherwise use all requested services
                        let services: string[] = []
                        try {
                            // If admin approved specific services, use those; otherwise use all requested services
                            const servicesToUse = approvedServices ||
                                (application.services ? JSON.parse(application.services) : [])
                            services = Array.isArray(servicesToUse) ? servicesToUse : []
                        } catch (e) {
                            console.error('Error parsing services:', e)
                            services = []
                        }
                        
                        walletUrl = generateGoogleWalletJWT({
                            cardNumber,
                            firstName: fullUser.firstName || '',
                            lastName: fullUser.lastName || '',
                            dateOfBirth: fullUser.dateOfBirth.toISOString().split('T')[0],
                            expiryDate,
                            province: fullUser.province || 'QC',
                            services, // These are service keys that will be converted to labels
                            lang // Pass language for proper label conversion
                        })

                        console.log('Generated Google Wallet URL with approved service keys:', services)
                    }
                } catch (walletError) {
                    console.error('Error generating Google Wallet URL:', walletError)
                    // Continue without wallet URL if it fails
                }

                const emailTemplate = getApprovalEmailTemplate({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    lang,
                    walletUrl,
                })
                
                await sendEmail({
                    to: user.email,
                    subject: emailTemplate.subject,
                    html: emailTemplate.html,
                })
                
                console.log('Approval email sent to:', user.email)
            } else if (status === 'REJECTED') {
                const emailTemplate = getRejectionEmailTemplate({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    adminNotes: adminNotes || null,
                    lang,
                })
                
                await sendEmail({
                    to: user.email,
                    subject: emailTemplate.subject,
                    html: emailTemplate.html,
                })
                
                console.log('Rejection email sent to:', user.email)
            }
        } catch (emailError) {
            console.error('Error sending email:', emailError)
            // Don't fail the request if email fails
            // The application status was still updated successfully
        }

        return NextResponse.json({
            success: true,
            application: updatedApplication,
        })
    } catch (error) {
        console.error('Verify application error:', error)
        
        // Return more detailed error message
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        
        return NextResponse.json(
            { 
                error: 'Failed to verify application',
                details: errorMessage,
                hint: 'Check server logs for more details'
            },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
