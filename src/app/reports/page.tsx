// src/app/reports/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid2 as Grid, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

interface CategoryTotal {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ name: string; income: number; expense: number }[]>([]);
  const [expenseCategoryData, setExpenseCategoryData] = useState<CategoryTotal[]>([]);
  const [incomeCategoryData, setIncomeCategoryData] = useState<CategoryTotal[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const response = await fetch('/api/transactions');
    if (response.ok) {
      const data = await response.json();
      setTransactions(data);
      processData(data);
    } else {
      console.error('Failed to fetch transactions');
    }
  };

  const processData = (data: Transaction[]) => {
    // Process monthly data
    const monthlyTotals: { [key: string]: { income: number; expense: number } } = {};
    data.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (!monthlyTotals[monthYear]) {
        monthlyTotals[monthYear] = { income: 0, expense: 0 };
      }
      monthlyTotals[monthYear][transaction.type] += transaction.amount;
    });

    const monthlyChartData = Object.entries(monthlyTotals).map(([name, totals]) => ({
      name,
      income: totals.income,
      expense: totals.expense
    }));
    setMonthlyData(monthlyChartData);

    // Process category data for expenses
    const expenseTotals: { [key: string]: number } = {};
    // Process category data for income
    const incomeTotals: { [key: string]: number } = {};

    data.forEach(transaction => {
      if (transaction.type === 'expense') {
        expenseTotals[transaction.category] = (expenseTotals[transaction.category] || 0) + transaction.amount;
      } else {
        incomeTotals[transaction.category] = (incomeTotals[transaction.category] || 0) + transaction.amount;
      }
    });

    const expenseChartData = Object.entries(expenseTotals).map(([name, value]) => ({ name, value }));
    setExpenseCategoryData(expenseChartData);

    const incomeChartData = Object.entries(incomeTotals).map(([name, value]) => ({ name, value }));
    setIncomeCategoryData(incomeChartData);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Financial Reports
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Monthly Income vs Expense</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#82ca9d" />
                  <Bar dataKey="expense" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Expense Categories</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Income Categories</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#82ca9d"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {incomeCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Financial Summary</Typography>
              <Typography variant="body1">
                Total Income: ${transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Total Expense: ${transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Balance: ${transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0).toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
