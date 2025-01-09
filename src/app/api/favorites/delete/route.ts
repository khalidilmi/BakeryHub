import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db'; // Juster stien til din db-konfiguration
import { favorites } from '../../../../db/schema/schema'; // Importér din `favorites` tabel
import { authenticateUser } from '../../../../../lib/authUser'; // Autentificér brugeren
import { eq, and } from 'drizzle-orm'; // Importér operatorer for betingelser

export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { bakerId } = await request.json(); // Træk bakerId fra request body

    if (!bakerId) {
      return NextResponse.json({ error: 'BakerId is required' }, { status: 400 });
    }

    // Slet favoritten fra databasen
    const deleted = await db
      .delete(favorites)
      .where(and(eq(favorites.userId, auth.user.id), eq(favorites.bakerId, bakerId)));

    if (deleted.rowCount === 0) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return NextResponse.json({ error: 'Failed to delete favorite' }, { status: 500 });
  }
}
