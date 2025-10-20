import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { step1, step2, identityDocUrl, medicalDocUrl } = body

        console.log('Received application data:', {
            hasStep1: !!step1,
            hasStep2: !!step2,
            identityDocUrl,
            medicalDocUrl,
        })

        if (!step1 || !step2 || !identityDocUrl || !medicalDocUrl) {
            console.error('Missing required data:', {
                step1: !!step1,
                step2: !!step2,
                identityDocUrl: !!identityDocUrl,
                medicalDocUrl: !!medicalDocUrl,
            })
            return NextResponse.json(
                { error: 'Missing required data' },
                { status: 400 }
            )
        }

        // First, create or get the user
        const user = await prisma.user.upsert({
            where: { email: step1.courriel },
            update: {
                firstName: step1.prenom,
                lastName: step1.nom,
                dateOfBirth: new Date(step1.dateNaissance),
                phone: step1.telephone,
                addressLine1: step1.adresse1,
                addressLine2: step1.adresse2 || null,
                city: step1.ville,
                province: step1.province,
                postalCode: step1.codePostal,
                updatedAt: new Date(),
            },
            create: {
                id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                email: step1.courriel,
                firstName: step1.prenom,
                lastName: step1.nom,
                dateOfBirth: new Date(step1.dateNaissance),
                phone: step1.telephone,
                addressLine1: step1.adresse1,
                addressLine2: step1.adresse2 || null,
                city: step1.ville,
                province: step1.province,
                postalCode: step1.codePostal,
                updatedAt: new Date(),
            },
        })

        // Create or update the application (upsert)
        const application = await prisma.application.upsert({
            where: {
                userId: user.id,
            },
            update: {
                disabilities: JSON.stringify(step2.disabilities || []),
                services: JSON.stringify(step2.services || []),
                otherText: step2.otherText || null,
                details: step2.details || null,
                identityDocUrl,
                medicalDocUrl,
                status: 'PENDING',
                updatedAt: new Date(),
            },
            create: {
                userId: user.id,
                disabilities: JSON.stringify(step2.disabilities || []),
                services: JSON.stringify(step2.services || []),
                otherText: step2.otherText || null,
                details: step2.details || null,
                identityDocUrl,
                medicalDocUrl,
                status: 'PENDING',
            },
        })

        return NextResponse.json({
            success: true,
            applicationId: application.id,
            userId: user.id,
        })
    } catch (error) {
        console.error('Save application error:', error)
        
        // Return more detailed error message
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        
        return NextResponse.json(
            { 
                error: 'Failed to save application',
                details: errorMessage,
                hint: 'Check console for detailed error'
            },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
