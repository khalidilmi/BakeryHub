import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../../src/db';
import { bakers } from '../../../../../../src/db/schema/schema';
import { eq } from 'drizzle-orm';
import { authenticateUser } from '../../../../../../lib/authUser';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateUser(request);

  // Tjek om brugeren er admin
  if (!auth || auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const bakerId = parseInt(params.id, 10);

  if (isNaN(bakerId)) {
    return NextResponse.json({ error: 'Invalid baker ID' }, { status: 400 });
  }

  try {
    // Tjek om bageren eksisterer
    const bakerExists = await db.query.bakers.findFirst({
      where: eq(bakers.id, bakerId),
    });

    if (!bakerExists) {
      return NextResponse.json({ error: 'Baker not found' }, { status: 404 });
    }

    // Slet bageren
    await db.delete(bakers).where(eq(bakers.id, bakerId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting baker:', error);
    return NextResponse.json({ error: 'Failed to delete baker' }, { status: 500 });
  }
}
