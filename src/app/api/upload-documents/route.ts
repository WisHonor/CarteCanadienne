import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextRequest, NextResponse } from 'next/server'

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File
        const type = formData.get('type') as string

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        if (!type || !['identity', 'medical'].includes(type)) {
            return NextResponse.json(
                { error: 'Invalid document type' },
                { status: 400 }
            )
        }

        // Validate file size (10 MB max)
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size exceeds 10 MB' },
                { status: 400 }
            )
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPG, PNG, and PDF are allowed.' },
                { status: 400 }
            )
        }

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(7)
        const fileExtension = file.name.split('.').pop()
        const fileName = `${type}-${timestamp}-${randomString}.${fileExtension}`
        const key = `documents/${fileName}`

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to S3 (private by default - more secure)
        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            // No ACL - file remains private for security
        })

        await s3Client.send(uploadCommand)

        // Generate a presigned URL valid for 7 days (for immediate viewing)
        const getCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
        })
        
        const presignedUrl = await getSignedUrl(s3Client, getCommand, { 
            expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
        })

        // Store the S3 key in database (not the presigned URL)
        // This allows generating new presigned URLs anytime
        const s3Key = key

        return NextResponse.json({
            success: true,
            url: presignedUrl, // Temporary URL for immediate use
            s3Key, // Permanent S3 key for database storage
            fileName,
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}
