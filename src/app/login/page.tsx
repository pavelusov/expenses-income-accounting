'use client';
import React from 'react';
import { LoginForm } from '@/components/form/LoginForm';
import { Container } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        console.error('Login failed:', result.error);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <LoginForm onSubmit={handleLogin} />
    </Container>
  );
}