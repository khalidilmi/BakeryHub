import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../../src/db';
import { users } from '../../../../../../src/db/schema/schema';
import { eq } from 'drizzle-orm';
import { authenticateUser } from '../../../../../../lib/authUser';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateUser(request);

  if (!auth || auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const userId = parseInt(params.id, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const userExists = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
