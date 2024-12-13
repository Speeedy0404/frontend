// src/axiosConfig.js
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

const instance = axios.create({
    baseURL: `${apiUrl}/api/v1/`,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning', // Добавляем этот заголовок
    },
});

instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default instance;