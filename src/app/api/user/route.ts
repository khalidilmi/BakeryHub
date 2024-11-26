import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { verifyJwtToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Hent token fra header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyJwtToken(token);

    if (!payload?.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Hent brugerdata fra databasen
    const { rows } = await sql`
      SELECT baker_name, business_type
      FROM users
      WHERE id = ${payload.userId}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 