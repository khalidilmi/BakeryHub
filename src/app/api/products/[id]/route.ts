// app/api/products/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '../../../../../lib/auth';
import { db } from '../../../../db';
import { products } from '../../../../../src/db/schema/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Denne funktion kan bruges til at hente et enkelt produkt, hvis nødvendigt
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticate(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { baker } = auth;
  const productId = parseInt(params.id);

  const { name, description, price } = await request.json();

  try {
    const updatedProduct = await db
      .update(products)
      .set({
        name,
        description,
        price,
      })
      .where(
        and(eq(products.id, productId), eq(products.baker_id, baker!.id))
      )
      .returning();

    if (updatedProduct.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct[0], { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticate(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { baker } = auth;
  const productId = parseInt(params.id);

  try {
    const deletedProduct = await db
      .delete(products)
      .where(
        and(eq(products.id, productId), eq(products.baker_id, baker!.id))
      )
      .returning();

    if (deletedProduct.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
