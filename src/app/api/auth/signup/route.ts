import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { checkDatabaseConnection } from '@/lib/db-connection-check';

export async function POST(request: Request) {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
  }

  try {
    const { name, email, password } = await request.json();

    // Проверка наличия обязательных полей
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Проверка, существует ли уже пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя в транзакции
    const user = await prisma.$transaction(async (prisma) => {
      // Создание пользователя
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Здесь можно добавить дополнительную логику, например, создание начального баланса
      await prisma.transaction.create({
        data: {
          userId: newUser.id,
          amount: 0,
          type: 'income',
          category: 'Initial Balance',
          description: 'Initial account balance',
          date: new Date(),
        },
      });

      return newUser;
    });

    // Не возвращаем пароль в ответе
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    // console.error('Error in signup:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}