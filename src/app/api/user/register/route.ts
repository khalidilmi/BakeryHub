import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../src/db';
import { users } from '../../../../../src/db/schema/schema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Bruger med den email eksisterer allerede.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      role: 'user',
    }).returning();

    return NextResponse.json({ message: 'Bruger oprettet succesfuldt.', user: { id: newUser.id, email: newUser.email } }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registrering mislykkedes.' }, { status: 500 });
  }
}
