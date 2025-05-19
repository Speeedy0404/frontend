import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './application/Auth/Login/Login'
import Logout from './application/Auth/Logout/Logout'

import { ThemeProvider, useTheme } from './application/ThemeContext';

import CustomNavbar from './application/MainPage/Navbar/Navbar';
import Footer from './application/MainPage/Footer/Footer';
import HomePage from './application/MainPage/HomePage/HomePage';
import FarmChoose from './application/Pin/FarmChoose'
import Animals from './application/Animals/Animals'
import Pin from './application/Pin/Pin'
import Reports from './application/Reports/Reports'
import axios from 'axios';
import Statistics from './application/StatisticsAndRating/Statistics';
import BooksApp from './application/Books/Books';

import './App2.css';

const AppContent = () => {
    const { isDarkMode } = useTheme();
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [username, setUsername] = useState(localStorage.getItem('authUsername'));


    useEffect(() => {
        const validateToken = async () => {
            if (!token) return;
    
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            } catch (error) {
                console.warn("Невалидный токен, выполняется выход...");
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUsername');
                setToken(null);
            }
        };
    
        validateToken();
    }, [token]);
    

    return (
        <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <CustomNavbar token={token} username={username}/>
            <div className="content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    {token && (
                        <>
                            <Route path="/animals" element={<Animals isDarkMode={isDarkMode} />} />

                            <Route path="/pin" element={<FarmChoose />} />
                            <Route path="/data-pin" element={<Pin />} />

                            <Route path="/reports" element={<Reports />} />

                            <Route path="/statistics" element={<Statistics />} />

                            <Route path="/*" element={<BooksApp />} />
                        </>
                    )}
                    <Route path="/login" element={<Login setToken={setToken} setUserName={setUsername} />} />
                    <Route path="/logout" element={<Logout token={token} setToken={setToken} setUsername={setUsername} />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <Router>
                <AppContent />
            </Router>
        </ThemeProvider>
    );
};

export default App;
