import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '../src/db';
import { users } from '../src/db/schema/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function authenticateUser(request: NextRequest) {
  // Attempt to get the token from the Authorization header
  const authHeader = request.headers.get('Authorization');
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    // If no Authorization header, check cookies
    token = request.cookies.get('token')?.value;
  }

  console.log('Token from request:', token);

  if (!token) {
    console.log('No token found in the request.');
    return null;
  }

  try {
    // Decode the JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    console.log('Decoded JWT:', decoded);

    // Find the user in the database based on the token ID
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!user) {
      console.log(`User not found for ID: ${decoded.id}`);
      return null;
    }

    // Return user and decoded JWT data
    return { user, decoded };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
