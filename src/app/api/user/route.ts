
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '../../../../lib/authUser';

export async function GET(request: NextRequest) {
  const auth = await authenticateUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { user } = auth;

  return NextResponse.json({ email: user.email, role: user.role }, { status: 200 });
}
