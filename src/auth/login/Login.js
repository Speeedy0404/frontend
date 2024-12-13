import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Stack,
} from '@mui/material';

const apiUrl = process.env.REACT_APP_API_URL;

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Сбросить предыдущее сообщение об ошибке
    console.log('API URL:', apiUrl); // Должен вывести https://918b-57-129-1-102.ngrok-free.app

    try {
      console.log(apiUrl)
      const response = await axios.post(`${apiUrl}/auth/token/login/`, {
        username,
        password,
      });

      setToken(response.data.auth_token);
      localStorage.setItem('authToken', response.data.auth_token);
      navigate('/'); // Перенаправляем на домашнюю страницу после успешного входа
    } catch (error) {
      console.error('Ошибка авторизации', error);
      setError('Неверное имя пользователя или пароль.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Вход в систему
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Stack spacing={2} sx={{ width: '100%', mt: 3 }}>
          <TextField
            label="Имя пользователя"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Пароль"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Войти
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Login;
