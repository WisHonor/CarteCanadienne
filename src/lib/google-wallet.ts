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
        throw new Error('Missing Google Wallet environment variables')
    }

    const objectId = `${issuerId}.${cardDetails.cardNumber}`

    // Create the pass object
    const genericObject = {
        id: objectId,
        classId: `${issuerId}.${classId}`,
        genericType: 'GENERIC_TYPE_UNSPECIFIED',
        hexBackgroundColor: '#1e40af',
        logo: {
            sourceUri: {
                uri: 'https://carte-canadienne.vercel.app/canada-logo.png'
            }
        },
        cardTitle: {
            defaultValue: {
                language: 'fr-CA',
                value: 'Carte Canadienne du Handicap'
            }
        },
        subheader: {
            defaultValue: {
                language: 'fr-CA',
                value: 'Gouvernement du Canada'
            }
        },
        header: {
            defaultValue: {
                language: 'fr-CA',
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
            },
            {
                id: 'expiry',
                header: 'Date d\'expiration',
                body: cardDetails.expiryDate
            }
        ],
        validTimeInterval: {
            start: {
                date: new Date().toISOString()
            },
            end: {
                date: cardDetails.expiryDate
            }
        }
    }

    // Create the JWT payload
    const payload = {
        iss: serviceAccountEmail,
        aud: 'google',
        typ: 'savetowallet',
        iat: Math.floor(Date.now() / 1000),
        origins: ['https://carte-canadienne.vercel.app'],
        payload: {
            genericObjects: [genericObject]
        }
    }

    // Sign the JWT
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' })

    // Return the save URL
    return `https://pay.google.com/gp/v/save/${token}`
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
