import { NextRequest, NextResponse } from 'next/server'

export function checkAdminAuth(request: NextRequest): boolean {
    // Check for admin token in headers
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    // For now, just check if token exists
    // In production, you'd validate the token against a session store or JWT
    return !!token
}

export function requireAdmin(handler: (req: NextRequest) => Promise<NextResponse>) {
    return async (req: NextRequest) => {
        const authHeader = req.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '')
        
        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            )
        }
        
        return handler(req)
    }
}
