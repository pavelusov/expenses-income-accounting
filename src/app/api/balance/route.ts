import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
    });

    const balance = transactions.reduce((acc, transaction) => {
      return transaction.type === 'income'
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, 0);

    return NextResponse.json({ balance });
  } catch (error) {
    console.error('Error calculating balance:', error);
    return NextResponse.json({ error: 'Failed to calculate balance' }, { status: 500 });
  }
}
