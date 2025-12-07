import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'

// Trim whitespace and newlines from env vars to prevent issues
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'bigguy').trim()
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || '!RY7!@gak').trim()

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    // Trim whitespace from inputs
    const trimmedUsername = username?.trim() || ''
    const trimmedPassword = password?.trim() || ''

    if (trimmedUsername === ADMIN_USERNAME && trimmedPassword === ADMIN_PASSWORD) {
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



