import { NextResponse } from 'next/server'
import { generateGoogleWalletJWT, generateCardNumber, formatExpiryDate } from '@/lib/google-wallet'

export async function GET() {
    try {
        // Test with dummy data
        const testCardDetails = {
            cardNumber: generateCardNumber(),
            firstName: 'Jean',
            lastName: 'Dupont',
            dateOfBirth: '1990-01-15',
            expiryDate: formatExpiryDate(5),
            province: 'QC'
        }

        const walletUrl = generateGoogleWalletJWT(testCardDetails)

        return NextResponse.json({
            success: true,
            walletUrl,
            cardDetails: testCardDetails,
            env: {
                hasIssuerId: !!process.env.GOOGLE_WALLET_ISSUER_ID,
                hasClassId: !!process.env.GOOGLE_WALLET_CLASS_ID,
                hasEmail: !!process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL,
                hasKey: !!process.env.GOOGLE_WALLET_PRIVATE_KEY,
                issuerId: process.env.GOOGLE_WALLET_ISSUER_ID,
                classId: process.env.GOOGLE_WALLET_CLASS_ID
            }
        })
    } catch (error) {
        console.error('Test wallet error:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 })
    }
}
