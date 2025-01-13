// app/api/bakers/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '../../../../lib/authUser';
import { db } from '../../../../src/db';
import { bakers } from '../../../../src/db/schema/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const auth = await authenticateUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const query = searchParams.get('query') || '';

  let foundBakers = [];

  if (type === 'baker' && query) {
    foundBakers = await db.select().from(bakers).where(eq(bakers.baker_name, query));
  } 
  else if (type === 'city' && query) {
    foundBakers = await db.select().from(bakers).where(eq(bakers.city, query));
  } else {
    foundBakers = await db.select().from(bakers);
  }

  return NextResponse.json(foundBakers, { status: 200 });
}
