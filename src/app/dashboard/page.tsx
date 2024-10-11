'use client';

import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Добро пожаловать, {session?.user?.name}!
        </Typography>
        <Typography variant="body1">
          Вы успешно вошли в систему. Здесь будет располагаться ваш дашборд.
        </Typography>
        <Button variant="contained" onClick={() => signOut()} sx={{ mt: 2 }}>
          Выйти
        </Button>
      </Box>
    </Container>
  );
}
