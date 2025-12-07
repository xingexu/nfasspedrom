import { NextResponse } from 'next/server'

export async function GET() {
  // Temporary debug endpoint - REMOVE AFTER FIXING
  const username = process.env.ADMIN_USERNAME || 'bigguy'
  const password = process.env.ADMIN_PASSWORD || '!RY7!@gak'
  
  return NextResponse.json({
    envUsernameSet: !!process.env.ADMIN_USERNAME,
    envPasswordSet: !!process.env.ADMIN_PASSWORD,
    usernameLength: username.length,
    passwordLength: password.length,
    usernameChars: username.split('').map(c => c.charCodeAt(0)),
    passwordChars: password.split('').map(c => c.charCodeAt(0)),
    usernameValue: username,
    // Don't expose actual password, just first char for verification
    passwordFirstChar: password[0],
    passwordLastChar: password[password.length - 1],
  })
}
