import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './application/Auth/Login/Login'
import Logout from './application/Auth/Logout/Logout'

import { ThemeProvider, useTheme } from './application/ThemeContext';

import CustomNavbar from './application/MainPage/Navbar/Navbar';
import Footer from './application/MainPage/Footer/Footer';
import HomePage from './application/MainPage/HomePage/HomePage';
import FarmChouse from './application/Pin/FarmChouse'
import Animals from './application/Animals/Animals'
import Pin from './application/Pin/Pin'
import Reports from './application/Reports/Reports'

import Statistics from './application/StatisticsAndRating/Statistics';
import BooksApp from './application/Books/Books';

import './App2.css';

const AppContent = () => {
    const { isDarkMode } = useTheme();
    const [token, setToken] = useState(localStorage.getItem('authToken'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }, [token]);

    return (
        <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <CustomNavbar token={token} />
            <div className="content">
                <Routes>
                    <Route path="/" element={<HomePage />} />

                    <Route path="/animals" element={<Animals isDarkMode={isDarkMode} />} />

                    <Route path="/pin" element={<FarmChouse />} />
                    <Route path="/data-pin" element={<Pin />} />

                    <Route path="/reports" element={<Reports />} />

                    <Route path="/statistics" element={<Statistics />} />

                    <Route path="/*" element={<BooksApp />} />

                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/logout" element={<Logout token={token} setToken={setToken} />} />
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
