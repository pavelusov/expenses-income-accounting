'use client';

import React from 'react';
import { SignupForm } from '@/components/form/SignupForm';
import { Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (name: string, email: string, password: string, isAdmin: boolean) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, isAdmin }),
      });
      if (response.ok) {
        // После успешной регистрации, выполняем вход
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          console.error('Login after signup failed:', result.error);
        } else {
          router.push('/dashboard');
        }
      } else {
        console.error('Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <SignupForm onSubmit={handleSignup} allowAdminSignup={true} />
    </Container>
  );
}
