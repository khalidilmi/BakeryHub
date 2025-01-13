import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '../../../../../lib/auth';
import { db } from '../../../../db';
import { products } from '../../../../db/schema/schema';

export async function POST(request: NextRequest) {
  const auth = await authenticate(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { baker } = auth;

  const { name, description, price } = await request.json();

  try {
    const [newProduct] = await db.insert(products).values({
      baker_id: baker!.id,
      name,
      description,
      price,
    }).returning();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
