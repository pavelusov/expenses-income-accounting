import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

interface SignupFormProps {
  onSubmit: (name: string, email: string, password: string) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email, password);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Регистрация
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Имя"
        name="name"
        autoComplete="name"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email адрес"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Пароль"
        type="password"
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Зарегистрироваться
      </Button>
    </Box>
  );
};
