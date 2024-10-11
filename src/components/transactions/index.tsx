import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { Transaction } from '@/types';

interface TransactionsProps {
  transactions: Transaction[];
}

export const Transactions: React.FC<TransactionsProps> = ({ transactions }) => {
  return (
    <List>
      {transactions.map((transaction) => (
        <ListItem key={transaction.id}>
          <ListItemText
            primary={
              <Typography color={transaction.type === 'income' ? 'success.main' : 'error.main'}>
                {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </Typography>
            }
            secondary={`${transaction.category} - ${new Date(transaction.date).toLocaleDateString()}`}
          />
        </ListItem>
      ))}
    </List>
  );
};
