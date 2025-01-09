import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../src/db';
import { users } from '../../../../../src/db/schema/schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    console.log('Login forsøg for email:', email);

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      console.log(`Bruger ikke fundet for email: ${email}`);
      return NextResponse.json({ error: 'Ugyldige legitimationsoplysninger.' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log(`Forkert password for email: ${email}`);
      return NextResponse.json({ error: 'Ugyldige legitimationsoplysninger.' }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    console.log('Genereret Token:', token);

    const response = NextResponse.json(
      { message: 'Logget ind succesfuldt.', role: user.role },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    console.log(`Login succesfuldt for email: ${email}`);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login mislykkedes.' }, { status: 500 });
  }
}
