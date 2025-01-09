import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import { favorites, bakers } from '../../../db/schema/schema';
import { authenticateUser } from '../../../../lib/authUser';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Hent alle favoritter for den autentificerede bruger
    const userFavorites = await db
      .select({
        bakerId: bakers.id,
        bakerName: bakers.baker_name,
        businessType: bakers.business_type,
      })
      .from(favorites)
      .innerJoin(bakers, eq(favorites.bakerId, bakers.id))
      .where(eq(favorites.userId, auth.user.id));

    if (!userFavorites || userFavorites.length === 0) {
      return NextResponse.json({ message: 'No favorites found' }, { status: 200 });
    }

    return NextResponse.json(userFavorites, { status: 200 });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}
