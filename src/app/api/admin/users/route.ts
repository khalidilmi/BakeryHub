import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../src/db';
import { users } from '../../../../../src/db/schema/schema';
import { authenticateUser } from '../../../../../lib/authUser';

export async function GET(request: NextRequest) {
  const auth = await authenticateUser(request);

  if (!auth || auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const allUsers = await db.select().from(users);
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
