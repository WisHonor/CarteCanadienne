import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const applicationId = searchParams.get('id')
        const email = searchParams.get('email')

        console.log('Fetching application - ID:', applicationId, 'Email:', email)

        if (!applicationId && !email) {
            return NextResponse.json(
                { error: 'Application ID or email is required' },
                { status: 400 }
            )
        }

        let application

        if (applicationId) {
            // Find application by ID
            application = await prisma.application.findUnique({
                where: { id: applicationId },
            })
            console.log('Application found by ID:', !!application)
        } else if (email) {
            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email },
                include: {
                    Application_Application_userIdToUser: true,
                },
            })
            console.log('User found:', !!user)
            console.log('Application found:', !!user?.Application_Application_userIdToUser)
            
            application = user?.Application_Application_userIdToUser
        }

        if (!application) {
            return NextResponse.json(
                { error: 'No application found' },
                { status: 404 }
            )
        }

        // Fetch full application with user details
        const fullApplication = await prisma.application.findUnique({
            where: { id: application.id },
            include: {
                User_Application_userIdToUser: true,
            },
        })

        if (!fullApplication || !fullApplication.User_Application_userIdToUser) {
            return NextResponse.json(
                { error: 'Application or user not found' },
                { status: 404 }
            )
        }

        const user = fullApplication.User_Application_userIdToUser

        return NextResponse.json({
            id: fullApplication.id,
            status: fullApplication.status,
            createdAt: fullApplication.createdAt,
            updatedAt: fullApplication.updatedAt,
            disabilities: JSON.parse(fullApplication.disabilities || '[]'),
            services: JSON.parse(fullApplication.services || '[]'),
            otherText: fullApplication.otherText,
            details: fullApplication.details,
            identityDocUrl: fullApplication.identityDocUrl,
            medicalDocUrl: fullApplication.medicalDocUrl,
            adminNotes: fullApplication.adminNotes,
            verifiedAt: fullApplication.verifiedAt,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                address: {
                    line1: user.addressLine1,
                    line2: user.addressLine2,
                    city: user.city,
                    province: user.province,
                    postalCode: user.postalCode,
                },
            },
        })
    } catch (error) {
        console.error('Fetch application error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch application' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
