import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  createdAt: Date;
  updatedAt: Date;
}
