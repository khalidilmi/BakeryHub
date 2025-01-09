import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../src/db'; // Opdater din sti efter behov
import { users } from '../../../../../src/db/schema/schema'; // Tjek din schema-definition
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    // Læs data fra forespørgselens body
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email og password er påkrævet.' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Indsæt ny bruger i databasen
    await db.insert(users).values({
      email,
      password: hashedPassword,
      role: role || 'admin', // Hvis rolle ikke gives, brug 'admin' som standard
    });

    return NextResponse.json({ success: true, message: 'Admin oprettet succesfuldt!' });
  } catch (error) {
    console.error('Fejl ved oprettelse af admin:', error);
    return NextResponse.json({ error: 'Kunne ikke oprette admin.' }, { status: 500 });
  }
}
