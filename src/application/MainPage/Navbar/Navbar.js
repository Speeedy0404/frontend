import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useTheme } from '../../ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

const CustomNavbar = ({ token, username }) => {
    const location = useLocation();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [expanded, setExpanded] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleNavClick = () => {
        if (window.innerWidth < 992) {
            setExpanded(false);
        }
    };

    return (
        <Navbar expanded={expanded} onToggle={setExpanded} className="navbar-custom" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">BelPlem</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            as={Link}
                            to="/"
                            onClick={handleNavClick}
                            className={isActive('/') ? 'active' : ''}
                        >
                            Главная
                        </Nav.Link>

                        {token && (
                            <>
                                <Nav.Link
                                    as={Link}
                                    to="/animals"
                                    onClick={handleNavClick}
                                    className={isActive('/animals') ? 'active' : ''}
                                >
                                    Животные
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/pin"
                                    onClick={handleNavClick}
                                    className={isActive('/pin') ? 'active' : ''}
                                >
                                    Закрепление
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/reports"
                                    onClick={handleNavClick}
                                    className={isActive('/reports') ? 'active' : ''}
                                >
                                    Отчеты
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/statistics"
                                    onClick={handleNavClick}
                                    className={isActive('/statistics') ? 'active' : ''}
                                >
                                    Статистика и Рейтинг
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/books"
                                    onClick={handleNavClick}
                                    className={isActive('/books') ? 'active' : ''}
                                >
                                    Справочники
                                </Nav.Link>
                            </>
                        )}
                    </Nav>

                    <Nav className="ml-auto">
                        {token && (
                            <div className="navbar-user">
                                Привет, <span style={{ marginLeft: '4px' }}>{username}</span>!
                            </div>
                        )}
                        <Nav.Link
                            as={Link}
                            to={token ? "/logout" : "/login"}
                            onClick={handleNavClick}
                            className={isActive(token ? '/logout' : '/login') ? 'active' : ''}
                        >
                            {token ? "Выйти" : "Войти"}
                        </Nav.Link>
                        <div className="theme-toggle" onClick={toggleDarkMode}>
                            {isDarkMode
                                ? <div className="icon sun" />
                                : <div className="icon moon" />}
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;
