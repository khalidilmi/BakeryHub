// lib/auth.ts

import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '../src/db';
import { users, bakers } from '../src/db/schema/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function authenticate(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  console.log('Token fra cookie:', token);

  if (!token) {
    console.log('Ingen token fundet i cookie.');
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    console.log('Decoded JWT:', decoded);

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!user) {
      console.log(`Bruger ikke fundet for id: ${decoded.id}`);
      return null;
    }

    // Hent bageren baseret på user.id
    const baker = await db.query.bakers.findFirst({
      where: eq(bakers.user_id, user.id),
    });

    if (!baker) {
      console.log(`Bager ikke fundet for user_id: ${user.id}`);
      return null;
    }

    return { user, baker, decoded };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
