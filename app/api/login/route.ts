import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()

  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminUsername || !adminPassword) {
    return NextResponse.json(
      { ok: false, error: 'Server auth not configured' },
      { status: 500 }
    )
  }

  const isValid = username === adminUsername && password === adminPassword

  if (!isValid) {
    return NextResponse.json(
      { ok: false, error: 'Invalid username or password' },
      { status: 401 }
    )
  }

  const res = NextResponse.json({ ok: true })

  res.cookies.set('admin', 'true', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return res
}
