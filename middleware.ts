import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for the admin dashboard
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    // Get the admin token from the session
    const adminToken = request.cookies.get('adminToken')?.value

    // If there's no admin token, redirect to the login page
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/dashboard/:path*',
} 