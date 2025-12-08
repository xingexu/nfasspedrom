import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'bigguy'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '!RY7!@gak'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    // Trim whitespace from inputs
    const trimmedUsername = username?.trim() || ''
    const trimmedPassword = password?.trim() || ''

    // Debug logging (remove after fixing)
    console.log('Login attempt (auth/login):', {
      providedUsername: trimmedUsername,
      providedPasswordLength: trimmedPassword?.length,
      providedPasswordChars: trimmedPassword ? trimmedPassword.split('').map((c: string) => c.charCodeAt(0)) : null,
      expectedUsername: ADMIN_USERNAME,
      expectedPasswordLength: ADMIN_PASSWORD?.length,
      expectedPasswordChars: ADMIN_PASSWORD ? ADMIN_PASSWORD.split('').map((c: string) => c.charCodeAt(0)) : null,
      usernameMatch: trimmedUsername === ADMIN_USERNAME,
      passwordMatch: trimmedPassword === ADMIN_PASSWORD,
      envUsernameSet: !!process.env.ADMIN_USERNAME,
      envPasswordSet: !!process.env.ADMIN_PASSWORD,
    })

    if (trimmedUsername === ADMIN_USERNAME && trimmedPassword === ADMIN_PASSWORD) {
      await createSession(username)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}








