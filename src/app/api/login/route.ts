import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../../../../src/db';
import { users } from '../../../../src/db/schema/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Hardcoded admin credentials for testing
  const adminEmail = 'admin@example.com';
  const adminPassword = 'adminpassword';

  try {
    // Check if email and password match hardcoded admin credentials
    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign({ id: 1, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
      return NextResponse.json({ token, role: 'admin' }, { status: 200 });
    }

    // Check in the database for other users (non-admins)
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token for the user
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({ token, role: user.role }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

