import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'bigguy'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '!RY7!@gak'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
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








