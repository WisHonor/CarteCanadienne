import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }
  
  // Redirect to Google Wallet with the JWT token
  const googleWalletUrl = `https://pay.google.com/gp/v/save/${token}`
  
  return NextResponse.redirect(googleWalletUrl)
}
