import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../src/db'; 
import { bakers } from '../../../../../src/db/schema/schema'; 
import { ilike } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { search } = Object.fromEntries(new URL(request.url).searchParams);

    if (!search) {
      return NextResponse.json({ error: 'Search query missing' }, { status: 400 });
    }


    const filteredBakers = await db
      .select()
      .from(bakers)
      .where(ilike(bakers.baker_name, `%${search}%`)) 
      .limit(10); 

    return NextResponse.json(filteredBakers);
  } catch (error) {
    console.error('Error searching bakers:', error);
    return NextResponse.json({ error: 'Failed to search bakers' }, { status: 500 });
  }
}
