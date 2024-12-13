// CustomNavbar.js
import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

const CustomNavbar = ({ token, toggleDarkMode, isDarkMode }) => {
    return (
        <Navbar className="navbar-custom" expand="lg">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>Отдел оценки</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {token && (  // Только отображаем пункты меню, если пользователь авторизован
                            <>
                                {/* <LinkContainer to="/procedures">
                                    <Nav.Link>Процедуры</Nav.Link>
                                </LinkContainer> */}
                                <LinkContainer to="/cowanimals">
                                    <Nav.Link>Коровы</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/animals">
                                    <Nav.Link>Быки</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/report">
                                    <Nav.Link>Отчет</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/pin/individual">
                                    <Nav.Link>Закрепление</Nav.Link>
                                </LinkContainer>
                                {/* <NavDropdown title="Закрепление" id="basic-nav-dropdown">
                                    <LinkContainer to="/pin/group">
                                        <NavDropdown.Item>Групповое</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/pin/individual">
                                        <NavDropdown.Item>Индивидуальное</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown> */}
                                <LinkContainer to="/statistics">
                                    <Nav.Link>Статистика</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/books">
                                    <Nav.Link>Справочники</Nav.Link>
                                </LinkContainer>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {/* <Button variant="outline-light" onClick={toggleDarkMode}>
                            {isDarkMode ? 'Светлая тема' : 'Темная тема'}
                        </Button> */}
                        {token ? (
                            <LinkContainer to="/logout">
                                <Nav.Link>Выйти</Nav.Link>
                            </LinkContainer>
                        ) : (
                            <LinkContainer to="/login">
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
