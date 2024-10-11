// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Typography, Box, Button, Paper, Grid } from '@mui/material';
import Link from 'next/link';
import { Transaction } from '@/types';
import { Transactions } from '@/components/transactions';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (session) {
      fetchBalance();
      fetchRecentTransactions();
    }
  }, [session]);

  const fetchBalance = async () => {
    const response = await fetch('/api/balance');
    if (response.ok) {
      const data = await response.json();
      setBalance(data.balance);
    }
  };

  const fetchRecentTransactions = async () => {
    const response = await fetch('/api/transactions?limit=5');
    if (response.ok) {
      const data = await response.json();
      setRecentTransactions(data);
    }
  };

  if (status === 'loading') {
    return <Typography>Loading...</Typography>;
  }

  if (!session) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to the Finance Tracker
          </Typography>
          <Typography variant="body1" paragraph>
            Please log in or sign up to manage your finances.
          </Typography>
          <Button component={Link} href="/login" variant="contained" color="primary" sx={{ mr: 2 }}>
            Log In
          </Button>
          <Button component={Link} href="/signup" variant="outlined" color="primary">
            Sign Up
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Finance Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Current Balance
              </Typography>
              <Typography variant="h4">${balance.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <Transactions transactions={recentTransactions} />
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Button component={Link} href="/transactions" variant="contained" color="primary">
            Manage Transactions
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
