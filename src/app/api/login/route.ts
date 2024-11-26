// app/api/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db'; // Juster stien efter din projekts struktur
import { users, bakers } from '../../../db/schema/schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  console.log('Login forsøg for email:', email);

  // Log JWT_SECRET for at sikre, at den er tilgængelig
  console.log('JWT_SECRET:', JWT_SECRET);
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  try {
    // Find bruger
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      console.log(`Bruger ikke fundet for email: ${email}`);
      return NextResponse.json({ error: 'Ugyldige legitimationsoplysninger.' }, { status: 401 });
    }

    // Tjek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Forkert password for email: ${email}`);
      return NextResponse.json({ error: 'Ugyldige legitimationsoplysninger.' }, { status: 401 });
    }

    // Opret JWT-token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // Sæt token i HttpOnly cookie
    const response = NextResponse.json({ message: 'Logget ind succesfuldt.' }, { status: 200 });
    response.cookies.set('token', token, { 
      httpOnly: true, 
      path: '/', 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict' 
    });

    console.log(`Login succesfuldt for email: ${email}`);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login mislykkedes.' }, { status: 500 });
  }
}
