import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { checkDatabaseConnection } from '@/lib/db-connection-check';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        ...(startDate && endDate ? {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          }
        } : {}),
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
  }

  try {
    const { amount, type, category, description, date } = await request.json();

    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amount: parseFloat(amount),
        type: type as 'income' | 'expense',
        category,
        description,
        date: new Date(date),
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    // Проверяем, принадлежит ли транзакция текущему пользователю
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!transaction || transaction.userId !== session.user.id) {
      return NextResponse.json({ error: 'Transaction not found or not authorized' }, { status: 404 });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
