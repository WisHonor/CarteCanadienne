import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { identityDocUrl, medicalDocUrl, applicationId } = body

        if (!identityDocUrl || !medicalDocUrl) {
            return NextResponse.json(
                { error: 'Both identity and medical document URLs are required' },
                { status: 400 }
            )
        }

        // For now, we'll store in session/cookie or create a new application
        // In a real app, you'd get the application ID from a session
        // This is a simplified version that updates or creates based on applicationId

        if (applicationId) {
            // Update existing application
            const application = await prisma.application.update({
                where: { id: applicationId },
                data: {
                    identityDocUrl,
                    medicalDocUrl,
                },
            })

            return NextResponse.json({
                success: true,
                applicationId: application.id,
            })
        } else {
            // This shouldn't happen in normal flow, but handle it gracefully
            return NextResponse.json(
                { error: 'No application ID provided' },
                { status: 400 }
            )
        }
    } catch (error) {
        console.error('Save documents error:', error)
        return NextResponse.json(
            { error: 'Failed to save document information' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
