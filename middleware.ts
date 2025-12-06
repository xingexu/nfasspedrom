import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for session cookie (used by both /api/login and /api/auth/login)
  const session = request.cookies.get('session')?.value
  const isAdmin = !!session

  // Allow access to login pages
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (isAdmin) {
      return NextResponse.next()
    }

    const loginUrl = new URL('/login', request.url)
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



