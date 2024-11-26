import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Tjek om der er en token i localStorage
  const token = request.cookies.get('token')

  // Hvis brugeren prøver at tilgå dashboard uden at være logget ind
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    // Redirect til login siden
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Konfigurer hvilke paths middleware skal køre på
export const config = {
  matcher: '/dashboard/:path*'
} 