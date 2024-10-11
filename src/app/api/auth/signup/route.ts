import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { name, email, password, isAdmin } = await request.json();

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    },
  });

  return NextResponse.json({ userId: user.id }, { status: 201 });
}