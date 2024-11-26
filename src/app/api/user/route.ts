// app/api/user/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  const auth = await authenticate(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { user, baker } = auth;
  return NextResponse.json({ email: user.email, baker_name: baker.baker_name, business_type: baker.business_type }, { status: 200 });
}
