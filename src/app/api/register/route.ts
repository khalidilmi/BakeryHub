// app/api/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import { users, bakers } from '../../../db/schema/schema'; // Opdateret sti
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
    const {
      email,
      password,
      business_type,
      name,
      baker_name,
      mobile_number,
      city,
      zip_code,
      street,
    } = await request.json();
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const [newUser] = await db.insert(users).values({
        email,
        password: hashedPassword,
        role: 'baker',
      }).returning();
  
      const [newBaker] = await db.insert(bakers).values({
        user_id: newUser.id,
        business_type,
        name,
        baker_name,
        mobile_number,
        city,
        zip_code,
        street,
      }).returning();
  
      return NextResponse.json({ user: newUser, baker: newBaker }, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
  }
