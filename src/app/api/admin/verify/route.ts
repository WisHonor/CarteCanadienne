import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    try {
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

        // TODO: Get the admin user ID from authentication
        // For now, we'll leave verifiedById as null since we don't have auth yet
        
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
