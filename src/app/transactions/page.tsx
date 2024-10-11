// src/app/transactions/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Transaction } from '@/types';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const response = await fetch('/api/transactions');
    if (response.ok) {
      const data = await response.json();
      setTransactions(data);
    } else {
      console.error('Failed to fetch transactions');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTransaction),
    });

    if (response.ok) {
      fetchTransactions();
      setNewTransaction({
        amount: '',
        type: 'expense',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    } else {
      console.error('Failed to add transaction');
    }
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchTransactions();
    } else {
      console.error('Failed to delete transaction');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Transactions
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add New Transaction
          </Typography>
          <TextField
            label="Amount"
            type="number"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            required
            sx={{ mr: 2 }}
          />
          <FormControl sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense' })}
              label="Type"
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Category"
            value={newTransaction.category}
            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
            required
            sx={{ mr: 2 }}
          />
          <TextField
            label="Description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Date"
            type="date"
            value={newTransaction.date}
            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mr: 2 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Add Transaction
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell align="right" sx={{ color: transaction.type === 'income' ? 'success.main' : 'error.main' }}>
                    {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(transaction.id)} color="error">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}