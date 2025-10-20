import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { sendEmail, getApprovalEmailTemplate, getRejectionEmailTemplate } from '@/lib/email'
import { createWalletPass, createOrUpdatePassClass } from '@/lib/googleWallet'

const prisma = new PrismaClient()

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
        const { applicationId, status, adminNotes } = body

        console.log('Verifying application:', { applicationId, status, adminNotes })

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
                        dateOfBirth: true,
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
                // Generate Google Wallet pass link
                let walletLink = '';
                try {
                    // Ensure the pass class exists
                    await createOrUpdatePassClass();

                    // Calculate expiration date (5 years from approval)
                    const expirationDate = new Date();
                    expirationDate.setFullYear(expirationDate.getFullYear() + 5);

                    // Parse services from the application (stored as JSON string)
                    let services = {
                        mobilityAid: false,
                        supportPerson: false,
                        serviceAnimal: false,
                    };
                    
                    if (application.services) {
                        try {
                            const parsedServices = JSON.parse(application.services);
                            services = {
                                mobilityAid: parsedServices.mobilityAid === 'yes' || parsedServices.mobilityAid === true,
                                supportPerson: parsedServices.supportPerson === 'yes' || parsedServices.supportPerson === true,
                                serviceAnimal: parsedServices.serviceAnimal === 'yes' || parsedServices.serviceAnimal === true,
                            };
                        } catch (parseError) {
                            console.error('Error parsing services:', parseError);
                        }
                    }

                    // Create the Google Wallet pass
                    walletLink = await createWalletPass({
                        userId: application.id,
                        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                        email: user.email,
                        dateOfBirth: user.dateOfBirth?.toISOString() || '',
                        expirationDate: expirationDate.toISOString(),
                        services,
                    });

                    console.log('✅ Google Wallet pass created successfully:', walletLink);
                } catch (walletError) {
                    console.error('❌ ERROR: Failed to create Google Wallet pass:', walletError);
                    console.error('📧 Email will be sent WITHOUT wallet link');
                    console.error('💡 To fix: Grant service account permissions - see FIX_PERMISSIONS.md');
                    // Continue with email even if wallet creation fails
                }

                const emailTemplate = getApprovalEmailTemplate({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    walletLink, // Pass the wallet link to the email template
                    lang,
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
