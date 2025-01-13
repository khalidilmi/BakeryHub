import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { favorites } from '../../../../db/schema/schema'; 
import { authenticateUser } from '../../../../../lib/authUser'; 
import { eq, and } from 'drizzle-orm'; 

export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { bakerId } = await request.json(); 

    if (!bakerId) {
      return NextResponse.json({ error: 'BakerId is required' }, { status: 400 });
    }


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
