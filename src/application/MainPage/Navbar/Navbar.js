import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useTheme } from '../../ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
const CustomNavbar = ({ token, username }) => {
    const location = useLocation();
    const { isDarkMode, toggleDarkMode } = useTheme();
    
    return (
        <Navbar className="navbar-custom" expand="lg">
            <Container>
                <Navbar.Brand>BelPlem</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/" className={location.pathname === '/' ? 'active' : ''}>
                            <Nav.Link>Главная</Nav.Link>
                        </LinkContainer>
                        {token && (
                            <>
                                <LinkContainer to="/animals" className={location.pathname === '/animals' ? 'active' : ''}>
                                    <Nav.Link>Животные</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/pin" className={location.pathname === '/pin' ? 'active' : ''}>
                                    <Nav.Link>Закрепление</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/reports" className={location.pathname === '/reports' ? 'active' : ''}>
                                    <Nav.Link>Отчеты</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/statistics" className={location.pathname === '/statistics' ? 'active' : ''}>
                                    <Nav.Link>Статистика и Рейтинг</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/books" className={location.pathname === '/books' ? 'active' : ''}>
                                    <Nav.Link>Справочники</Nav.Link>
                                </LinkContainer>
                            </>
                        )}
                    </Nav>

                    <Nav className="ml-auto">
                        <div className="theme-toggle" onClick={toggleDarkMode}>
                            {isDarkMode
                                ? <div className="icon sun" />
                                : <div className="icon moon" />}
                        </div>
                        {token && (
                            <div className="navbar-user">
                                Привет, <span style={{ marginLeft: '4px' }}>{username}</span>!
                            </div>
                        )}
                        {token ? (
                            <LinkContainer to="/logout" className={location.pathname === '/logout' ? 'active' : ''}>
                                <Nav.Link>Выйти</Nav.Link>
                            </LinkContainer>
                        ) : (
                            <LinkContainer to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                                <Nav.Link>Войти</Nav.Link>
                            </LinkContainer>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;
