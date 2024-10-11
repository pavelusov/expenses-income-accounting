import 'next-auth';

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Survey {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'multipleChoice' | 'radio';
  options?: string[];
}

export interface Response {
  id: string;
  userId: string;
  surveyId: string;
  answers: Answer[];
}

export interface Answer {
  questionId: string;
  value: string;
}

declare module 'next-auth' {
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isAdmin: boolean;
  }
}
