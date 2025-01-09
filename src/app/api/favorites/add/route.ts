import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../src/db'; // Juster stien til din db-konfiguration
import { favorites } from '../../../../../src/db/schema/schema'; // Importér `favorites` korrekt
import { eq, and } from 'drizzle-orm'; // Importér korrekt operator til at matche værdier
import { authenticateUser } from '../../../../../lib/authUser'; // Autentificér brugeren

export async function POST(request: NextRequest) {
  try {
    // Autentificér brugeren
    const auth = await authenticateUser(request);
    console.log('Authenticated user:', auth);

    if (!auth) {
      console.log('Unauthorized request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Træk `bakerId` fra request body
    const { bakerId } = await request.json();
    console.log('Received bakerId:', bakerId);

    if (!bakerId) {
      console.log('Invalid bakerId provided');
      return NextResponse.json({ error: 'Invalid bakerId' }, { status: 400 });
    }

    // Kontroller, om favoritten allerede findes
    const existingFavorite = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, auth.user.id), eq(favorites.bakerId, bakerId)));

    console.log('Existing favorite:', existingFavorite);

    if (existingFavorite.length > 0) {
      console.log('Favorite already exists');
      return NextResponse.json({ error: 'Already favorited' }, { status: 400 });
    }

    // Indsæt favoritten i databasen
    const inserted = await db.insert(favorites).values({
      userId: auth.user.id,
      bakerId,
      created_at: new Date(),
    });

    console.log('Inserted favorite:', inserted);

    return NextResponse.json({ success: true, inserted }, { status: 201 });
  } catch (error) {
    console.error('Error adding favorite:', error);


    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}
