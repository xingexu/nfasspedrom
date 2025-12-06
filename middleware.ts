import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.get('admin')?.value === 'true'

  // Allow access to login page
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

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
