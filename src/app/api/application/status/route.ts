import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

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

        return NextResponse.json({
            id: application.id,
            status: application.status,
            createdAt: application.createdAt,
            identityDocUrl: application.identityDocUrl,
            medicalDocUrl: application.medicalDocUrl,
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
