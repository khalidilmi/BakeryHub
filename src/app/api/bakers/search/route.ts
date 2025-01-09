import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../src/db'; // Tilpas stien til din db-konfiguration
import { bakers } from '../../../../../src/db/schema/schema'; // Importér din bager-schema
import { like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { search } = Object.fromEntries(new URL(request.url).searchParams);

    if (!search) {
      return NextResponse.json({ error: 'Search query missing' }, { status: 400 });
    }

    // Find bagerne, der matcher søgeforespørgslen
    const filteredBakers = await db
      .select()
      .from(bakers)
      .where(like(bakers.baker_name, `%${search}%`)) // Matcher delstrenge i baker_name
      .limit(10); // Begræns til 10 resultater

    return NextResponse.json(filteredBakers);
  } catch (error) {
    console.error('Error searching bakers:', error);
    return NextResponse.json({ error: 'Failed to search bakers' }, { status: 500 });
  }
}
