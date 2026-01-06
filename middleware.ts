import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.trim() || 'bigguy'

async function validateSession(sessionToken: string): Promise<boolean> {
  try {
    const secretKey = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    const key = new TextEncoder().encode(secretKey)
    
    const { payload } = await jwtVerify(sessionToken, key, {
      algorithms: ['HS256'],
    })
    
    return payload?.username === ADMIN_USERNAME
  } catch (error) {
    return false
  }
}

export async function middleware(request: NextRequest) {
  // Get session cookie
  const sessionCookie = request.cookies.get('session')?.value
  
  // Validate session if cookie exists
  let isAdmin = false
  if (sessionCookie) {
    isAdmin = await validateSession(sessionCookie)
  }

  // Allow access to login pages
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Protect /admin routes (except login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (isAdmin) {
      return NextResponse.next()
    }

    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)

    return NextResponse.redirect(loginUrl)
  }

  // Protect /posts/new route - only logged-in users can create posts
  if (request.nextUrl.pathname === '/posts/new') {
    if (isAdmin) {
      return NextResponse.next()
    }

    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/posts/new'],
}



