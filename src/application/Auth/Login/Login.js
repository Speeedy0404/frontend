import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
} from '@mui/material';
import './Login.css';
import LoadingDots from '../LoadingDots';

const apiUrl = process.env.REACT_APP_API_URL;

const Login = ({ setToken, setUserName }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${apiUrl}/auth/token/login/`, {
                username,
                password,
            });

            setToken(response.data.auth_token);
            localStorage.setItem('authToken', response.data.auth_token);
            localStorage.setItem('authUsername', username);
            setUserName(username);
            navigate('/');
        } catch (error) {
            console.error('Ошибка авторизации', error);
            if (error.response && error.response.status === 400) {
                setError('Неверное имя пользователя или пароль.');
            } else {
                setError('Ошибка сети или сервера. Попробуйте снова.');
            }
        } finally {
            setLoading(false);
        }
    };


    return (


        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Вход в систему</h2>
                {error && <Alert severity="error">{error}</Alert>}
                <div className="form-group">
                    <label htmlFor="username">Имя пользователя</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Введите имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group password-group">
                    <label htmlFor="password">Пароль</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className={`password-toggle ${showPassword ? 'visible' : 'hidden'}`}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Скрыть' : 'Показать'}
                        </span>
                    </div>
                </div>
                <button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                >
                    {loading ? <LoadingDots /> : 'Войти'}
                </button>
            </form>
        </div>
    );
};

export default Login;
