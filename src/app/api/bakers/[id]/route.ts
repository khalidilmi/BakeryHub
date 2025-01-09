import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bakers } from '@/db/schema/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bakerId = parseInt(params.id);

    const bakerInfo = await db.query.bakers.findFirst({
      where: eq(bakers.id, bakerId),
      columns: {
        baker_name: true,
        mobile_number: true,
        street: true,
        city: true,
        zip_code: true,
      },
    });

    if (!bakerInfo) {
      return NextResponse.json(
        { error: 'Baker not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(bakerInfo);
  } catch (error) {
    console.error('Error fetching baker info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch baker info' },
      { status: 500 }
    );
  }
} 