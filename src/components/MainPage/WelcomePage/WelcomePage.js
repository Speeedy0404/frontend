import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = ({ token }) => {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1 className='convertingColorsRadialTextGradient'>Добро пожаловать на сайт оценки сельскохозяйственных животных</h1>
                <p>Ваш центр управления и оценки сельскохозяйственных животных</p>

                {token ? (
                    // Если пользователь авторизован, показываем кнопки
                    <div className="welcome-buttons">
                        <Link to="/statistics" className="welcome-button">Посмотреть статистику</Link>
                        <Link to="/pin/individual" className="welcome-button">Закрепление</Link>
                    </div>
                ) : (
                    // Если пользователь не авторизован, показываем сообщение
                    <p className="auth-message">Пожалуйста, авторизуйтесь для доступа к дополнительным функциям</p>
                )}
            </div>
        </div>
    );
};

export default WelcomePage;
