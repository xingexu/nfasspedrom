import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'bigguy'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '!RY7!@gak'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Debug logging (remove after fixing)
    console.log('Login attempt:', {
      providedUsername: username,
      providedPasswordLength: password?.length,
      providedPasswordChars: password ? password.split('').map(c => c.charCodeAt(0)) : null,
      expectedUsername: ADMIN_USERNAME,
      expectedPasswordLength: ADMIN_PASSWORD?.length,
      expectedPasswordChars: ADMIN_PASSWORD ? ADMIN_PASSWORD.split('').map(c => c.charCodeAt(0)) : null,
      usernameMatch: username === ADMIN_USERNAME,
      passwordMatch: password === ADMIN_PASSWORD,
      envUsernameSet: !!process.env.ADMIN_USERNAME,
      envPasswordSet: !!process.env.ADMIN_PASSWORD,
    })

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      await createSession(username)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json(
      { ok: false, error: 'Invalid username or password' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Invalid request' },
      { status: 400 }
    )
  }
}



