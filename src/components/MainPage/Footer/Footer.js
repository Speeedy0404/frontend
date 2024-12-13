import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import UsefulLinks from '../../UsefulLinks/UsefulLinks';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-custom">
            <Container>
                <Row>
                    <Col md={3} className="footer-col">
                        <h5>Белплемживобъединение</h5>
                        <p>Отдел оценки занимается оценкой сельскохозяйственных животных для улучшения племенных качеств и продуктивности.</p>
                    </Col>
                    <Col md={3} className="footer-col">
                        <h5>Контактная информация</h5>
                        <p><strong>Адрес:</strong> г. Минск, ул. Казинца, д. 88</p>
                        <p><strong>Телефон:</strong> +375 (17) 374-63-74 </p>
                        <p><strong>Email:</strong> info@belplem.by</p>
                    </Col>
                    <Col md={3} className="footer-col">
                        <UsefulLinks />
                    </Col>
                     {/* <Col md={4} className="footer-col">
                        <h5>Социальные сети</h5>
                        <ul className="social-icons">
                            <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                            <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                            <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                            <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                        </ul>
                    </Col> */}
                </Row>
                <Row className="footer-bottom">
                    <Col md={12} className="text-center">
                        <p>© {new Date().getFullYear()} Отдел оценки. Все права защищены.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
