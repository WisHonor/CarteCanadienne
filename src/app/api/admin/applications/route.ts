import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
    try {
        // TODO: Add authentication check here
        // For now, anyone can access this endpoint
        // In production, verify the user has admin role

        const applications = await prisma.application.findMany({
            include: {
                User_Application_userIdToUser: {
                    select: {
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
            orderBy: {
                createdAt: 'desc',
            },
        })

        const formattedApplications = applications.map(app => ({
            id: app.id,
            status: app.status,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
            user: {
                firstName: app.User_Application_userIdToUser.firstName,
                lastName: app.User_Application_userIdToUser.lastName,
                email: app.User_Application_userIdToUser.email,
                phone: app.User_Application_userIdToUser.phone,
                dateOfBirth: app.User_Application_userIdToUser.dateOfBirth,
                address: {
                    line1: app.User_Application_userIdToUser.addressLine1,
                    line2: app.User_Application_userIdToUser.addressLine2,
                    city: app.User_Application_userIdToUser.city,
                    province: app.User_Application_userIdToUser.province,
                    postalCode: app.User_Application_userIdToUser.postalCode,
                },
            },
        }))

        return NextResponse.json(formattedApplications)
    } catch (error) {
        console.error('Fetch applications error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch applications' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
