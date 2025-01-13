import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../src/db';
import { users, bakers } from '../../../../../src/db/schema/schema';
import { authenticateUser } from '../../../../../lib/authUser';
import { eq } from 'drizzle-orm'; 

export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);

    if (!auth || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await db.delete(bakers).where(eq(bakers.user_id, userId));

    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ success: true, message: `User and associated baker deleted successfully.` });
  } catch (error) {
    console.error('Error deleting user and baker:', error);
    return NextResponse.json({ error: 'Failed to delete user and baker' }, { status: 500 });
  }
}
