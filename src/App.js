// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomNavbar from './components/MainPage/Navbar/Navbar';
import Footer from './components/MainPage/Footer/Footer';
import GroupPin from './components/GroupPin/GroupPin';
import IndividualPin from './components/IndividualPin/IndividualPin';
import IndividualDataDisplay from './components/IndividualPin/IndividualDataDisplay/IndividualDataDisplay';
import DataDisplay from './components/DataDisplay/DataDisplay';
import Animal from './components/Animal/Animal';
import CowAnimal from './components/Animal/CowAnimal';
import Reports from './components/Reports/Reports'
import Statistics from './components/Statistics/Statistics';
import Login from './auth/login/Login';
import Logout from './auth/logout/Logout';
import WelcomePage from './components/MainPage/WelcomePage/WelcomePage';
import './App.css';
import BooksApp from './components/Books/Books';  // Импортируем компонент с роутами

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }, [token]);

    useEffect(() => {
        localStorage.setItem('darkMode', isDarkMode);
        document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <Router>
            <div className="page-background">
                <CustomNavbar token={token} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />

                <Routes>
                    <Route path="/animals" element={<Animal />} />
                    <Route path="/cowanimals" element={<CowAnimal />} />
                    <Route path="/report" element={<Reports />} />
                    <Route path="/data-display" element={<DataDisplay />} />
                    <Route path="/data-display-individual" element={<IndividualDataDisplay />} />
                    <Route path="/*" element={<BooksApp />} />  {/* Роут на все страницы BooksApp */}
                    </Routes>

                <div className="content-wrapper">
                    <Routes>
                        <Route path="/" element={<WelcomePage token={token} />} />
                        <Route path="/pin/group" element={<GroupPin />} />
                        <Route path="/pin/individual" element={<IndividualPin />} />
                        <Route path="/statistics" element={<Statistics />} />
                        <Route path="/login" element={<Login setToken={setToken} />} />
                        <Route path="/logout" element={<Logout token={token} setToken={setToken} />} />
                    </Routes>
                </div>

                <br></br>

                <Footer />
            </div>
        </Router>
    );
};

export default App;
