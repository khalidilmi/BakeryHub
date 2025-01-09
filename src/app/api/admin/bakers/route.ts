import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../src/db';
import { bakers } from '../../../../../src/db/schema/schema';
import { authenticateUser } from '../../../../../lib/authUser';

export async function GET(request: NextRequest) {
  const auth = await authenticateUser(request);

  if (!auth || auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const allBakers = await db.select().from(bakers);
    return NextResponse.json(allBakers, { status: 200 });
  } catch (error) {
    console.error('Error fetching bakers:', error);
    return NextResponse.json({ error: 'Failed to fetch bakers' }, { status: 500 });
  }
}
