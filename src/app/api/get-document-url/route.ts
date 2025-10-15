import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextRequest, NextResponse } from 'next/server'

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})

/**
 * Generate a presigned URL for viewing a document
 * Usage: GET /api/get-document-url?key=documents/identity-123.jpg
 */
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const key = searchParams.get('key')

        if (!key) {
            return NextResponse.json(
                { error: 'Missing document key' },
                { status: 400 }
            )
        }

        // Security: Only allow documents from the documents/ folder
        if (!key.startsWith('documents/')) {
            return NextResponse.json(
                { error: 'Invalid document path' },
                { status: 403 }
            )
        }

        // Generate presigned URL valid for 1 hour
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
        })

        const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600, // 1 hour
        })

        return NextResponse.json({
            url: presignedUrl,
            expiresIn: 3600,
        })
    } catch (error) {
        console.error('Error generating presigned URL:', error)
        return NextResponse.json(
            { error: 'Failed to generate document URL' },
            { status: 500 }
        )
    }
}
