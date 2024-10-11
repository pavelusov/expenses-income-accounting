import { prisma } from './prisma';

export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.error('Database connection success');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}
