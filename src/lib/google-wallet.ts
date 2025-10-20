import jwt from 'jsonwebtoken'

interface CardDetails {
    cardNumber: string
    firstName: string
    lastName: string
    dateOfBirth: string
    expiryDate: string
    province: string
}

export function generateGoogleWalletJWT(cardDetails: CardDetails): string {
    const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID
    const classId = process.env.GOOGLE_WALLET_CLASS_ID
    const serviceAccountEmail = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL
    const privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (!issuerId || !classId || !serviceAccountEmail || !privateKey) {
        console.error('Missing Google Wallet environment variables:', {
            hasIssuerId: !!issuerId,
            hasClassId: !!classId,
            hasEmail: !!serviceAccountEmail,
            hasKey: !!privateKey
        })
        throw new Error('Missing Google Wallet environment variables')
    }

    // Clean up the card number for use in ID (remove special characters)
    const cleanCardNumber = cardDetails.cardNumber.replace(/[^a-zA-Z0-9]/g, '_')
    const objectId = `${issuerId}.${cleanCardNumber}`
    const fullClassId = `${issuerId}.${classId}`

    // Simple generic class definition
    const genericClass = {
        id: fullClassId
    }

    // Create the pass object with simplified structure
    const genericObject = {
        id: objectId,
        classId: fullClassId,
        hexBackgroundColor: '#1e40af',
        logo: {
            sourceUri: {
                uri: 'https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/pass_google_logo.jpg'
            }
        },
        cardTitle: {
            defaultValue: {
                language: 'fr',
                value: 'Carte Canadienne du Handicap'
            }
        },
        subheader: {
            defaultValue: {
                language: 'fr',
                value: 'Gouvernement du Canada'
            }
        },
        header: {
            defaultValue: {
                language: 'fr',
                value: `${cardDetails.firstName} ${cardDetails.lastName}`
            }
        },
        textModulesData: [
            {
                id: 'card_number',
                header: 'Numéro de carte',
                body: cardDetails.cardNumber
            },
            {
                id: 'date_of_birth',
                header: 'Date de naissance',
                body: cardDetails.dateOfBirth
            },
            {
                id: 'province',
                header: 'Province',
                body: cardDetails.province
            }
        ]
    }

    // Create the JWT payload
    const claims = {
        iss: serviceAccountEmail,
        aud: 'google',
        typ: 'savetowallet',
        iat: Math.floor(Date.now() / 1000),
        origins: [],
        payload: {
            genericClasses: [genericClass],
            genericObjects: [genericObject]
        }
    }

    try {
        // Sign the JWT
        const token = jwt.sign(claims, privateKey, { algorithm: 'RS256' })
        
        console.log('Generated Google Wallet JWT token')
        
        // Return the save URL
        return `https://pay.google.com/gp/v/save/${token}`
    } catch (error) {
        console.error('Error signing JWT:', error)
        throw error
    }
}

export function generateCardNumber(): string {
    // Generate a unique card number (format: CAN-XXXX-XXXX-XXXX)
    const randomPart = Math.random().toString(36).substring(2, 14).toUpperCase()
    return `CAN-${randomPart.slice(0, 4)}-${randomPart.slice(4, 8)}-${randomPart.slice(8, 12)}`
}

export function formatExpiryDate(years: number = 5): string {
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + years)
    return expiryDate.toISOString()
}
