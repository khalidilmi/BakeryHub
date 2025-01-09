import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../src/db'; // Juster stien til din db-konfiguration
import { users, bakers } from '../../../../../src/db/schema/schema'; // Importér de relevante tabeller
import { authenticateUser } from '../../../../../lib/authUser'; // Funktion til autentificering
import { eq } from 'drizzle-orm'; // Importer `eq` til betingelser

export async function DELETE(request: NextRequest) {
  try {
    // Autentificér brugeren
    const auth = await authenticateUser(request);

    // Tjek om brugeren er admin
    if (!auth || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Træk userId fra request body
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Start sletning i databasen
    // Slet bageren, der er tilknyttet brugeren
    await db.delete(bakers).where(eq(bakers.user_id, userId));

    // Slet brugeren
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ success: true, message: `User and associated baker deleted successfully.` });
  } catch (error) {
    console.error('Error deleting user and baker:', error);
    return NextResponse.json({ error: 'Failed to delete user and baker' }, { status: 500 });
  }
}
