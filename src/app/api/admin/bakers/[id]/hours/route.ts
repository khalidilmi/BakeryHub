import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../../db';
import { bakeryHours } from '../../../../../../db/schema/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bakerId = parseInt(params.id);
    if (isNaN(bakerId)) {
      return NextResponse.json({ error: 'Invalid baker ID' }, { status: 400 });
    }

    const hours = await db.select().from(bakeryHours).where(eq(bakeryHours.bakerId, bakerId));

    if (!hours.length) {
      return NextResponse.json({ error: 'No hours found for this baker' }, { status: 404 });
    }

    return NextResponse.json(hours);
  } catch (error) {
    console.error('Error fetching hours:', error);
    return NextResponse.json({ error: 'Failed to fetch hours' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bakerId = parseInt(params.id);
    if (isNaN(bakerId)) {
      return NextResponse.json({ error: 'Invalid baker ID' }, { status: 400 });
    }

    const { dayOfWeek, openingTime, closingTime } = await request.json();

    if (!dayOfWeek || !openingTime || !closingTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const inserted = await db.insert(bakeryHours).values({
      bakerId,
      dayOfWeek,
      openingTime,
      closingTime,
    });

    return NextResponse.json({ success: true, inserted });
  } catch (error) {
    console.error('Error adding hours:', error);
    return NextResponse.json({ error: 'Failed to add hours' }, { status: 500 });
  }
}
