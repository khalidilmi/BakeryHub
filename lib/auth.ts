// lib/auth.ts

import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '../src/db';
import { users, bakers } from '../src/db/schema/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function authenticate(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!user) {
      return null;
    }

    // Hent bageren baseret på user.id
    const baker = await db.query.bakers.findFirst({
      where: eq(bakers.user_id, user.id),
    });

    if (!baker) {
      return null;
    }

    return { user, baker, decoded };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
