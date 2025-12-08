import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'

// Get credentials from environment or use defaults
// In production, these should be set in Vercel environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.trim() || 'bigguy'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim() || '!RY7!@gak'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    // Trim whitespace from inputs
    const trimmedUsername = (username || '').trim()
    const trimmedPassword = (password || '').trim()

    // Debug logging for troubleshooting (safe - no passwords exposed)
    console.log('Login attempt:', {
      providedUsername: trimmedUsername,
      providedPasswordLength: trimmedPassword.length,
      expectedUsername: ADMIN_USERNAME,
      expectedPasswordLength: ADMIN_PASSWORD.length,
      usernameMatch: trimmedUsername === ADMIN_USERNAME,
      passwordMatch: trimmedPassword === ADMIN_PASSWORD,
      envUsernameSet: !!process.env.ADMIN_USERNAME,
      envPasswordSet: !!process.env.ADMIN_PASSWORD,
      nodeEnv: process.env.NODE_ENV,
    })

    // Compare credentials (case-sensitive)
    if (trimmedUsername === ADMIN_USERNAME && trimmedPassword === ADMIN_PASSWORD) {
      await createSession(trimmedUsername)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}








