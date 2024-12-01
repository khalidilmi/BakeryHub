// app/api/logout/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Opret en response uden indhold
  const response = NextResponse.json({ message: 'Logged out successfully.' });

  // Sæt token-cookien til at udløbe i fortiden
  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0), // Sæt udløbsdatoen til en tid i fortiden
  });

  return response;
}
