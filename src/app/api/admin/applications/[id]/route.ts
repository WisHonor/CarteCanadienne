import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params

        const application = await prisma.application.findUnique({
            where: { id },
            include: {
                User_Application_userIdToUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        dateOfBirth: true,
                        addressLine1: true,
                        addressLine2: true,
                        city: true,
                        province: true,
                        postalCode: true,
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

        const formattedApplication = {
            id: application.id,
            status: application.status,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
            verifiedAt: application.verifiedAt,
            verifiedById: application.verifiedById,
            adminNotes: application.adminNotes,
            disabilities: application.disabilities ? JSON.parse(application.disabilities) : [],
            services: application.services ? JSON.parse(application.services) : [],
            otherText: application.otherText,
            details: application.details,
            identityDocUrl: application.identityDocUrl,
            medicalDocUrl: application.medicalDocUrl,
            user: {
                id: application.User_Application_userIdToUser.id,
                firstName: application.User_Application_userIdToUser.firstName,
                lastName: application.User_Application_userIdToUser.lastName,
                email: application.User_Application_userIdToUser.email,
                phone: application.User_Application_userIdToUser.phone,
                dateOfBirth: application.User_Application_userIdToUser.dateOfBirth,
                address: {
                    line1: application.User_Application_userIdToUser.addressLine1,
                    line2: application.User_Application_userIdToUser.addressLine2,
                    city: application.User_Application_userIdToUser.city,
                    province: application.User_Application_userIdToUser.province,
                    postalCode: application.User_Application_userIdToUser.postalCode,
                },
            },
        }

        return NextResponse.json(formattedApplication)
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
