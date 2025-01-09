// app/api/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth';
import { db } from '../../../db';
import { products } from '../../../../src/db/schema/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const auth = await authenticate(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { baker } = auth;

  try {
    const userProducts = await db
      .select()
      .from(products)
      .where(eq(products.baker_id, baker!.id));

    return NextResponse.json(userProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
