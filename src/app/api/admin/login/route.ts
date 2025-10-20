import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import crypto from 'crypto'

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex')
}

// Generate a simple session token
function generateToken(): string {
    return crypto.randomBytes(32).toString('hex')
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Check if user is admin
        if (user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized access' },
                { status: 403 }
            )
        }

        // For now, we'll use a simple password check
        // In production, you should store hashed passwords and use bcrypt
        const hashedPassword = hashPassword(password)
        
        // For the demo admin, the password is "admin123"
        const demoPasswordHash = hashPassword('admin123')
        
        if (hashedPassword !== demoPasswordHash) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Generate session token
        const token = generateToken()

        // Return success with token
        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        })
    } catch (error) {
        console.error('Admin login error:', error)
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
