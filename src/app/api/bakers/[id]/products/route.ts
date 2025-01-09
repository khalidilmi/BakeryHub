// app/api/bakers/[id]/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '../../../../../../lib/authUser';
import { db } from '../../../../../db';
import { products } from '../../../../../db/schema/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bakerId = parseInt(params.id, 10);
  const bakerProducts = await db.select().from(products).where(eq(products.baker_id, bakerId));

  return NextResponse.json(bakerProducts, { status: 200 });
}

